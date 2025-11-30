import pytest
from fastapi.testclient import TestClient

from main import app, history


@pytest.fixture(autouse=True)
def reset_history():
    history.clear()
    yield
    history.clear()


def get_client() -> TestClient:
    return TestClient(app)


@pytest.fixture
def client():
    return get_client()


def test_root_lists_endpoints(client: TestClient):
    response = client.get("/")
    assert response.status_code == 200
    payload = response.json()
    assert payload.get("status") == "ok"
    assert set(payload.get("endpoints", [])) == {"/calculate", "/history", "/last", "/operations"}


def test_operations_returns_supported_ops(client: TestClient):
    response = client.get("/operations")
    assert response.status_code == 200
    assert set(response.json()) == {"+", "-", "*", "/"}


def test_calculate_addition(client: TestClient):
    response = client.post("/calculate", json={"a": 5, "b": 3, "op": "+"})
    assert response.status_code == 200
    payload = response.json()
    assert payload["expression"] == "5.0 + 3.0"
    assert payload["result"] == 8.0


def test_calculate_subtraction(client: TestClient):
    response = client.post("/calculate", json={"a": 10, "b": 4, "op": "-"})
    assert response.status_code == 200
    assert response.json()["result"] == 6.0


def test_calculate_multiplication(client: TestClient):
    response = client.post("/calculate", json={"a": 7, "b": 6, "op": "*"})
    assert response.status_code == 200
    assert response.json()["result"] == 42.0


def test_calculate_division(client: TestClient):
    response = client.post("/calculate", json={"a": 9, "b": 3, "op": "/"})
    assert response.status_code == 200
    assert response.json()["result"] == 3.0


def test_division_by_zero_returns_error(client: TestClient):
    response = client.post("/calculate", json={"a": 8, "b": 0, "op": "/"})
    assert response.status_code == 400
    assert "Division by zero" in response.json()["detail"]


def test_unsupported_operator_returns_error(client: TestClient):
    response = client.post("/calculate", json={"a": 1, "b": 2, "op": "%"})
    assert response.status_code == 400
    assert "Unsupported operator" in response.json()["detail"]


def test_history_returns_last_operations(client: TestClient):
    for _ in range(3):
        client.post("/calculate", json={"a": 2, "b": 2, "op": "+"})
    response = client.get("/history")
    assert response.status_code == 200
    items = response.json()
    assert len(items) == 3
    assert items[-1]["result"] == 4.0


def test_history_keeps_only_last_ten(client: TestClient):
    for i in range(12):
        client.post("/calculate", json={"a": i, "b": 1, "op": "+"})
    response = client.get("/history")
    assert response.status_code == 200
    items = response.json()
    assert len(items) == 10
    assert items[0]["expression"] == "2.0 + 1.0"
    assert items[-1]["expression"] == "11.0 + 1.0"


def test_clear_history_empties_list(client: TestClient):
    client.post("/calculate", json={"a": 1, "b": 1, "op": "+"})
    response = client.delete("/history")
    assert response.status_code == 200
    assert response.json() == []
    assert client.get("/history").json() == []


def test_get_last_when_empty_returns_404(client: TestClient):
    response = client.get("/last")
    assert response.status_code == 404


def test_get_last_returns_latest_item(client: TestClient):
    client.post("/calculate", json={"a": 3, "b": 5, "op": "+"})
    client.post("/calculate", json={"a": 10, "b": 2, "op": "-"})
    response = client.get("/last")
    assert response.status_code == 200
    payload = response.json()
    assert payload["expression"] == "10.0 - 2.0"
    assert payload["result"] == 8.0