class YouCamProviderError(Exception):
    """Base exception for YouCam API provider errors."""
    def __init__(self, message: str, code: str = "PROVIDER_FAILURE"):
        super().__init__(message)
        self.code = code


class YouCamAuthError(YouCamProviderError):
    def __init__(self, message: str = "Invalid or expired YouCam API Key"):
        super().__init__(message, code="PROVIDER_AUTH_ERROR")


class YouCamRateLimitError(YouCamProviderError):
    def __init__(self, message: str = "YouCam rate limit exceeded (429)"):
        super().__init__(message, code="PROVIDER_RATE_LIMIT")


class YouCamTimeoutError(YouCamProviderError):
    def __init__(self, message: str = "YouCam request timed out"):
        super().__init__(message, code="PROVIDER_TIMEOUT")


class YouCamImageValidationError(YouCamProviderError):
    def __init__(self, message: str = "Uploaded image failed YouCam resolution or face detection validation"):
        super().__init__(message, code="IMAGE_VALIDATION_ERROR")
