import pytest
from httpx import ASGITransport, AsyncClient
from app.main import app


@pytest.mark.asyncio
async def test_health_endpoint():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://testserver"
    ) as client:
        response = await client.get("/api/v1/health")
        assert response.status_code == 200

        payload = response.json()
        assert payload["success"] is True
        assert payload["message"] == "System health check completed."
        assert "data" in payload
        assert "meta" in payload
        assert "request_id" in payload["meta"]
        assert "timestamp" in payload["meta"]
        assert payload["data"]["app_name"] == "PersonaIQ Backend API"
        assert payload["data"]["environment"] == "development"
