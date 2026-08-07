import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_presence_dna_fetch(client: AsyncClient, auth_headers: dict):
    response = await client.get("/api/v1/presence-dna", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "avg_presence_index" in data["data"] or "top_style" in data["data"]
