"""Private portrait and garment media storage.

Production must use a private Supabase bucket and the service-role key.
Never persist public object URLs or silently fall back to public/local media.
"""
import logging
import os
import tempfile
import uuid
from pathlib import Path
from urllib.parse import urlparse

import httpx
from fastapi import UploadFile

from app.core.config import settings
from app.core.errors import AppException, ErrorCode

logger = logging.getLogger(__name__)

ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024
JPEG_MAGIC = b"\xff\xd8\xff"
PNG_MAGIC = b"\x89PNG\r\n\x1a\n"
WEBP_MAGIC = b"RIFF"


def invalid_upload(message: str, code: ErrorCode = ErrorCode.UPLOAD_001) -> AppException:
    return AppException(code=code, message=message, status_code=400)


def storage_unavailable(message: str) -> AppException:
    return AppException(code=ErrorCode.SYS_002, message=message, status_code=503)


class StorageService:
    def __init__(self, upload_dir: str | None = None):
        self.upload_dir = Path(upload_dir or os.path.join(tempfile.gettempdir(), "personaiq_uploads"))
        self.bucket = settings.SUPABASE_STORAGE_BUCKET
        self.supabase_url = settings.SUPABASE_URL.rstrip("/")
        # The anon key must never be used for privileged object operations.
        self.supabase_key = settings.SUPABASE_SERVICE_ROLE_KEY

    def _local_enabled(self) -> bool:
        if settings.ENVIRONMENT.lower() == "testing":
            return True
        return (
            settings.ENVIRONMENT.lower() == "development"
            and settings.ALLOW_LOCAL_PRIVATE_UPLOADS
            and not os.getenv("RENDER")
            and not os.getenv("RENDER_SERVICE_ID")
        )

    def _supabase_configured(self) -> bool:
        parsed = urlparse(self.supabase_url)
        return bool(
            self.supabase_key
            and parsed.scheme == "https"
            and parsed.hostname
            and parsed.hostname.endswith(".supabase.co")
            and not parsed.username and not parsed.password
        )

    def _headers(self, content_type: str | None = None) -> dict:
        headers = {
            "Authorization": "Bearer " + self.supabase_key,
            "apikey": self.supabase_key,
        }
        if content_type:
            headers["Content-Type"] = content_type
        return headers

    async def _ensure_private_bucket(self, client: httpx.AsyncClient) -> None:
        response = await client.get(
            self.supabase_url + "/storage/v1/bucket/" + self.bucket,
            headers=self._headers(),
        )
        if response.status_code != 200 or response.json().get("public") is not False:
            raise storage_unavailable(
                "Private photo storage is not ready. Configure a non-public Supabase bucket."
            )

    async def validate_and_save(
        self, file: UploadFile, folder: str, user_id: str, journey_id: str
    ) -> tuple[str, int, str]:
        if folder not in {"selfies", "outfits"}:
            raise invalid_upload("Invalid upload category.")
        mime_type = file.content_type or "application/octet-stream"
        content = await file.read(MAX_FILE_SIZE_BYTES + 1)
        file_size = len(content)

        if file_size > MAX_FILE_SIZE_BYTES:
            raise invalid_upload("The image exceeds the 10 MB file limit.", ErrorCode.UPLOAD_002)

        valid_magic = (
            (mime_type == "image/jpeg" and content.startswith(JPEG_MAGIC))
            or (mime_type == "image/png" and content.startswith(PNG_MAGIC))
            or (
                mime_type == "image/webp"
                and content.startswith(WEBP_MAGIC)
                and content[8:12] == b"WEBP"
            )
        )
        if mime_type not in ALLOWED_MIME_TYPES or not valid_magic:
            raise invalid_upload("Unsupported or invalid image. Use a JPG, PNG, or WEBP file.")

        ext = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}[mime_type]
        filename = journey_id + "_" + uuid.uuid4().hex + ext
        storage_path = folder + "/" + user_id + "/" + filename

        if self._supabase_configured():
            try:
                async with httpx.AsyncClient(timeout=15.0) as client:
                    await self._ensure_private_bucket(client)
                    response = await client.post(
                        self.supabase_url + "/storage/v1/object/" + self.bucket + "/" + storage_path,
                        headers=self._headers(mime_type),
                        content=content,
                    )
                    if response.status_code not in (200, 201):
                        raise storage_unavailable("Photo storage upload failed. Please retry.")
                    # Store an internal reference, not a public URL or temporary signed URL.
                    return "supabase://" + self.bucket + "/" + storage_path, file_size, mime_type
            except AppException:
                raise
            except (httpx.HTTPError, ValueError, OSError) as exc:
                logger.warning("Private image storage request failed", error_type=type(exc).__name__)
                raise storage_unavailable("Private photo storage is temporarily unavailable.") from exc

        if self._local_enabled():
            destination = self.upload_dir / folder / user_id
            destination.mkdir(parents=True, exist_ok=True)
            image_path = destination / filename
            image_path.write_bytes(content)
            return "/media/uploads/" + storage_path, file_size, mime_type

        raise storage_unavailable(
            "Private photo storage is not configured. Contact support before uploading images."
        )

    async def create_signed_download_url(self, reference: str, expires_in: int = 300) -> str:
        prefix = "supabase://" + self.bucket + "/"
        if not reference.startswith(prefix) or not self._supabase_configured():
            raise storage_unavailable("This media is not available in private storage.")

        object_path = reference[len(prefix):]
        if not object_path or any(segment in ("", ".", "..") for segment in object_path.split("/")):
            raise storage_unavailable("The media reference is invalid.")
        expires_in = min(max(expires_in, 30), 300)

        try:
            async with httpx.AsyncClient(timeout=12.0) as client:
                await self._ensure_private_bucket(client)
                response = await client.post(
                    self.supabase_url + "/storage/v1/object/sign/" + self.bucket + "/" + object_path,
                    headers=self._headers("application/json"),
                    json={"expiresIn": expires_in},
                )
                if response.status_code not in (200, 201):
                    raise storage_unavailable("Could not grant temporary image access.")
                signed_path = response.json().get("signedURL")
                if not isinstance(signed_path, str):
                    raise storage_unavailable("Media signing service returned an invalid response.")
                accepted_prefix = "/object/sign/" + self.bucket + "/"
                if not signed_path.startswith(accepted_prefix) or "?token=" not in signed_path:
                    raise storage_unavailable("Media signing service returned an invalid URL.")
                return self.supabase_url + "/storage/v1" + signed_path
        except AppException:
            raise
        except (httpx.HTTPError, ValueError, OSError) as exc:
            logger.warning("Media signing failed", error_type=type(exc).__name__)
            raise storage_unavailable("Temporary image access is unavailable.") from exc
