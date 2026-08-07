import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_and_list_wardrobe_items(client: AsyncClient, auth_headers: dict):
    # 1. Create Wardrobe Item
    payload = {
        "name": "Navy Executive Blazer",
        "category": "Outerwear",
        "color": "Navy",
        "formality": "Formal",
        "photo_url": "https://example.com/blazer.jpg"
    }
    response = await client.post("/api/v1/wardrobe", json=payload, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["data"]["name"] == "Navy Executive Blazer"
    assert data["data"]["category"] == "Outerwear"

    # 2. List Wardrobe Items
    list_res = await client.get("/api/v1/wardrobe", headers=auth_headers)
    assert list_res.status_code == 200
    list_data = list_res.json()
    assert list_data["success"] is True
    assert len(list_data["data"]) >= 1
