from typing import Annotated, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field


class CalculationRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    operand1: Annotated[
        float,
        Field(
            ...,
            validation_alias="a",
            serialization_alias="a",
            description="First operand",
        ),
    ]
    operand2: Annotated[
        float,
        Field(
            ...,
            validation_alias="b",
            serialization_alias="b",
            description="Second operand",
        ),
    ]
    operator: Annotated[
        str,
        Field(
            ...,
            validation_alias="op",
            serialization_alias="op",
            description="Math operator",
        ),
    ]


class CalculationResult(BaseModel):
    expression: str
    result: float


SUPPORTED_OPERATIONS = {
    '+': lambda a, b: a + b,
    '-': lambda a, b: a - b,
    '*': lambda a, b: a * b,
    '/': lambda a, b: a / b,
}

app = FastAPI(title="Calculator API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


history: List[CalculationResult] = []


def _push_history(item: CalculationResult) -> None:
    """Store the latest calculation and keep only the last 10."""
    history.append(item)
    if len(history) > 10:
        # remove oldest entries if over capacity
        del history[0 : len(history) - 10]


def _compute(req: CalculationRequest) -> CalculationResult:
    if req.operator not in SUPPORTED_OPERATIONS:
        raise HTTPException(status_code=400, detail="Unsupported operator")

    if req.operator == '/' and req.operand2 == 0:
        raise HTTPException(status_code=400, detail="Division by zero is not allowed")

    result = SUPPORTED_OPERATIONS[req.operator](req.operand1, req.operand2)
    expression = f"{req.operand1} {req.operator} {req.operand2}"
    return CalculationResult(expression=expression, result=result)


@app.post("/calculate", response_model=CalculationResult)
def calculate(req: CalculationRequest) -> CalculationResult:
    item = _compute(req)
    _push_history(item)
    return item


@app.get("/history", response_model=List[CalculationResult])
def get_history() -> List[CalculationResult]:
    return history


@app.delete("/history", response_model=List[CalculationResult])
def clear_history() -> List[CalculationResult]:
    history.clear()
    return history


@app.get("/last", response_model=CalculationResult)
def get_last() -> CalculationResult:
    if not history:
        raise HTTPException(status_code=404, detail="No calculations available")
    return history[-1]


@app.get("/operations", response_model=List[str])
def get_operations() -> List[str]:
    return list(SUPPORTED_OPERATIONS.keys())


@app.get("/")
def root():
    return {"status": "ok", "endpoints": ["/calculate", "/history", "/last", "/operations"]}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
