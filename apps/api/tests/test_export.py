import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_pdf_export_generation(client: AsyncClient, auth_headers: dict):
    # 1. Create a Journey
    journey_res = await client.post(
        "/api/v1/journeys",
        json={"title": "Exportable Executive Journey", "event_type": "Conference"},
        headers=auth_headers
    )
    assert journey_res.status_code == 201
    journey_id = journey_res.json()["data"]["id"]

    # 2. Request PDF Export
    export_res = await client.post(
        "/api/v1/export/pdf",
        json={"journey_id": journey_id, "format": "pdf"},
        headers=auth_headers
    )
    assert export_res.status_code == 200
    export_data = export_res.json()
    assert export_data["success"] is True
    assert "download_url" in export_data["data"]
