from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class YouCamFileRequest(BaseModel):
    content_type: str
    file_name: str
    file_size: int


class YouCamFileInitResponse(BaseModel):
    file_id: str
    upload_url: str
    method: str = "PUT"
    headers: Dict[str, str] = Field(default_factory=dict)


class YouCamTaskCreateRequest(BaseModel):
    src_file_id: Optional[str] = None
    src_file_url: Optional[str] = None
    dst_actions: List[str] = Field(default_factory=list)
    format: str = "json"


class YouCamTaskCreateResponse(BaseModel):
    task_id: str
    status_code: int = 200


class YouCamResultItem(BaseModel):
    type: str
    ui_score: int
    raw_score: float
    mask_urls: List[str] = Field(default_factory=list)


class YouCamTaskStatusResponse(BaseModel):
    task_id: str
    task_status: str  # "running" | "success" | "error"
    overall_score: Optional[int] = None
    output: List[YouCamResultItem] = Field(default_factory=list)
    raw_response: Dict[str, Any] = Field(default_factory=dict)
