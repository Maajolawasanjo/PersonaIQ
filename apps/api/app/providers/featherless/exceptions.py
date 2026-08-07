class FeatherlessProviderError(Exception):
    """Base exception for Featherless AI LLM provider errors."""
    def __init__(self, message: str, code: str = "PROVIDER_FAILURE"):
        super().__init__(message)
        self.code = code


class FeatherlessAuthError(FeatherlessProviderError):
    def __init__(self, message: str = "Invalid or expired Featherless API Key"):
        super().__init__(message, code="PROVIDER_AUTH_ERROR")


class FeatherlessRateLimitError(FeatherlessProviderError):
    def __init__(self, message: str = "Featherless rate limit exceeded (429)"):
        super().__init__(message, code="PROVIDER_RATE_LIMIT")


class FeatherlessTimeoutError(FeatherlessProviderError):
    def __init__(self, message: str = "Featherless request timed out"):
        super().__init__(message, code="PROVIDER_TIMEOUT")
