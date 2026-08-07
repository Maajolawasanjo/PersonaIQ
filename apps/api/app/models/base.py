import time
import uuid
from app.core.database import Base


def uuid7() -> uuid.UUID:
    """Generate a time-ordered UUID v7 per RFC 9562."""
    timestamp_ms = int(time.time() * 1000)
    rand_a = uuid.uuid4().int & 0xFFF
    rand_b = uuid.uuid4().int & 0x3FFFFFFFFFFFFFFF

    # Construct 128-bit integer for UUID v7
    uuid_int = (timestamp_ms & 0x0000FFFFFFFFFFFF) << 80
    uuid_int |= (0x7 & 0xF) << 76  # Version 7
    uuid_int |= rand_a << 64
    uuid_int |= (0x2 & 0x3) << 62  # Variant 10 (RFC 4122)
    uuid_int |= rand_b

    return uuid.UUID(int=uuid_int)


class BaseModel(Base):
    """Base declarative class for all SQLAlchemy 2.0 entities."""
    __abstract__ = True

