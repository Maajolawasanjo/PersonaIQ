import logging
import os
import tempfile
import uuid
from pathlib import Path
from fastapi import UploadFile
import httpx
from app.core.config import settings
from app.core.errors import AppException, ErrorCode

logger = logging.getLogger(__name__)

ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB

# Magic byte signatures for image formats
JPEG_MAGIC = b"\xff\xd8\xff"
PNG_MAGIC = b"\x89PNG\r\n\x1a\n"
WEBP_MAGIC = b"RIFF"


class StorageService:
    def __init__(self, upload_dir: str | None = None):
        if not upload_dir:
            upload_dir = os.path.join(tempfile.gettempdir(), "personaiq_uploads")
        self.upload_dir = Path(upload_dir)
        self.upload_dir.mkdir(parents=True, exist_ok=True)
        self.supabase_url = settings.SUPABASE_URL
        self.supabase_key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY

    async def validate_and_save(
        self, file: UploadFile, folder: str, user_id: str, journey_id: str
    ) -> tuple[str, int, str]:
        """Validates magic bytes format and size, uploads to Supabase Storage (or local fallback), returns (storage_url, file_size_bytes, mime_type)."""

        mime_type = file.content_type or "application/octet-stream"
        content = await file.read()
        file_size = len(content)

        # 1. Size Validation
        if file_size > MAX_FILE_SIZE_BYTES:
            raise AppException(
                code=ErrorCode.UPLOAD_002,
                message=f"File size ({file_size / (1024*1024):.2f} MB) exceeds maximum allowed limit of 10 MB.",
                status_code=400,
            )

        # 2. Magic-Byte Image Validation (Defensive against spoofed Content-Type header)
        is_valid_image = (
            content.startswith(JPEG_MAGIC)
            or content.startswith(PNG_MAGIC)
            or (content.startswith(WEBP_MAGIC) and b"WEBP" in content[:16])
        )
        if not is_valid_image or mime_type not in ALLOWED_MIME_TYPES:
            raise AppException(
                code=ErrorCode.UPLOAD_001,
                message=f"Unsupported file format '{mime_type}'. Allowed formats: JPEG, PNG, WEBP.",
                status_code=400,
            )

        # 3. Generate Storage Filename
        ext = ".jpg"
        if mime_type == "image/png":
            ext = ".png"
        elif mime_type == "image/webp":
            ext = ".webp"

        filename = f"{journey_id}_{uuid.uuid4().hex[:8]}{ext}"
        storage_path = f"{folder}/{user_id}/{filename}"

        # 4. Attempt Supabase Storage Upload if Configured
        if self.supabase_url and "supabase.co" in self.supabase_url and self.supabase_key:
            try:
                upload_endpoint = f"{self.supabase_url}/storage/v1/object/personaiq-uploads/{storage_path}"
                headers = {
                    "Authorization": f"Bearer {self.supabase_key}",
                    "apikey": self.supabase_key,
                    "Content-Type": mime_type,
                    "x-upsert": "true",
                }
                async with httpx.AsyncClient(timeout=10.0) as client:
                    res = await client.post(upload_endpoint, headers=headers, content=content)
                    if res.status_code in (200, 201):
                        public_url = f"{self.supabase_url}/storage/v1/object/public/personaiq-uploads/{storage_path}"
                        return public_url, file_size, mime_type
            except Exception as exc:
                logger.warning(f"[StorageService] Supabase upload failed, using local storage fallback: {exc}")

        # 5. Local Storage Fallback
        dest_dir = self.upload_dir / folder / str(user_id)
        dest_dir.mkdir(parents=True, exist_ok=True)
        file_path = dest_dir / filename
        with open(file_path, "wb") as f:
            f.write(content)

        storage_url = f"/media/uploads/{folder}/{user_id}/{filename}"
        return storage_url, file_size, mime_type
