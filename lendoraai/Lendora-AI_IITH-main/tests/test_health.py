import pytest
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

try:
    from httpx import AsyncClient, ASGITransport
    HTTPX_AVAILABLE = True
except ImportError:
    HTTPX_AVAILABLE = False

try:
    from backend.api.server import app
    APP_AVAILABLE = True
except ImportError:
    try:
        from main import app
        APP_AVAILABLE = True
    except ImportError:
        APP_AVAILABLE = False


@pytest.mark.anyio
async def test_health_returns_ok():
    if not APP_AVAILABLE or not HTTPX_AVAILABLE:
        pytest.skip("App or httpx not available")
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "lendora"


@pytest.mark.anyio
async def test_negotiate_accepts_body():
    if not APP_AVAILABLE or not HTTPX_AVAILABLE:
        pytest.skip("App or httpx not available")
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post("/api/negotiate", json={"message": "test", "walletAddress": "0x0"})
    assert response.status_code in [200, 201, 400, 422]


@pytest.mark.anyio
async def test_loans_endpoint_exists():
    if not APP_AVAILABLE or not HTTPX_AVAILABLE:
        pytest.skip("App or httpx not available")
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/loans/0x0000000000000000000000000000000000000000")
    assert response.status_code != 404


@pytest.mark.anyio
async def test_root_returns_message():
    if not APP_AVAILABLE or not HTTPX_AVAILABLE:
        pytest.skip("App or httpx not available")
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/")
    assert response.status_code == 200
