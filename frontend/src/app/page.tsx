"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  ListGroup,
  Row,
  Spinner,
  Stack,
} from "react-bootstrap";

type Operation = "+" | "-" | "*" | "/";

type HistoryItem = {
  expression: string;
  result: number;
};

const ALLOWED_OPERATIONS: Operation[] = ["+", "-", "*", "/"];

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") || "http://localhost:8000";

const digitButtons = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0"];

export default function Home() {
  const [currentValue, setCurrentValue] = useState<string>("");
  const [operator, setOperator] = useState<Operation | "">("");
  const [firstOperand, setFirstOperand] = useState<string>("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [operations, setOperations] = useState<Operation[]>(["+","-","*","/"]);
  const [lastResult, setLastResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchHistory();
    fetchOperations();
  }, []);

  const displayExpression = useMemo(() => {
    if (firstOperand && operator) {
      return `${firstOperand} ${operator} ${currentValue || "…"}`;
    }
    return currentValue || "0";
  }, [currentValue, firstOperand, operator]);

  async function fetchOperations() {
    try {
      const res = await fetch(`${API_BASE}/operations`);
      if (!res.ok) return;
      const ops = (await res.json()) as Operation[];
      const filtered = ops.filter((op): op is Operation =>
        ALLOWED_OPERATIONS.includes(op as Operation),
      );
      if (filtered.length) {
        setOperations(filtered);
      }
    } catch {
      // silently keep defaults
    }
  }

  async function fetchHistory() {
    try {
      const res = await fetch(`${API_BASE}/history`);
      if (!res.ok) return;
      const items = (await res.json()) as HistoryItem[];
      setHistory(items);
      if (items.length) {
        setLastResult(items[items.length - 1].result.toString());
      }
    } catch {
      // ignore
    }
  }

  function handleDigit(d: string) {
    setError("");
    setCurrentValue((prev) => (prev === "0" ? d : prev + d));
  }

  function handleOperator(op: Operation) {
    setError("");
    if (!currentValue && !firstOperand) {
      return;
    }
    if (firstOperand && operator && currentValue) {
      // chain operations: compute current result first
      void handleEquals(op);
      return;
    }
    setFirstOperand(currentValue || firstOperand);
    setCurrentValue("");
    setOperator(op);
  }

  async function handleEquals(nextOperator?: Operation) {
    const opToUse = nextOperator || operator;
    if (!opToUse) {
      setError("Válassz műveletet.");
      return;
    }

    if (!firstOperand || !currentValue) {
      setError("Adj meg két számot a számításhoz.");
      return;
    }

    const a = parseFloat(firstOperand);
    const b = parseFloat(currentValue);

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ a, b, op: opToUse }),
      });
      const payload = await res.json();
      if (!res.ok) {
        setError(payload?.detail ?? "Ismeretlen hiba a számítás közben.");
        return;
      }
      setLastResult(payload.result.toString());
      setHistory((prev) => {
        const next = [...prev, payload].slice(-10);
        return next;
      });
      setFirstOperand("");
      setCurrentValue(payload.result.toString());
      setOperator(nextOperator ? nextOperator : "");
      if (nextOperator) {
        setFirstOperand(payload.result.toString());
        setCurrentValue("");
      }
    } catch {
      setError("Nem sikerült elérni a szervert. Ellenőrizd a backendet.");
    } finally {
      setLoading(false);
    }
  }

  async function handleClearHistory() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/history`, { method: "DELETE" });
      if (res.ok) {
        setHistory([]);
      }
    } catch {
      setError("Nem sikerült törölni az előzményeket.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setFirstOperand("");
    setCurrentValue("");
    setOperator("");
    setLastResult("");
    setError("");
  }

  return (
    <div className="app-shell">
      <Container fluid>
        <Card className="calculator-card">
          <Card.Header className="bg-white py-4 px-4 px-md-5">
            <Stack direction="horizontal" gap={3} className="flex-wrap">
              <div>
                <h1 className="h3 mb-1">MI Kalkulátor</h1>
                <p className="mb-0 text-muted">
                  Alapműveletek FastAPI backenddel, műveleti előzményekkel.
                </p>
              </div>
              <div className="ms-auto d-flex align-items-center gap-2">
                <Badge bg="primary">Backend: FastAPI</Badge>
                <Badge bg="secondary">Frontend: Next.js + React-Bootstrap</Badge>
              </div>
            </Stack>
          </Card.Header>

          <Card.Body className="p-4 p-md-5">
            {error ? (
              <Alert variant="danger" className="mb-4">
                {error}
              </Alert>
            ) : null}

            <Row className="g-4">
              <Col lg={7}>
                <Stack gap={3}>
                  <div className="display-panel">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <small className="text-muted">Aktuális művelet</small>
                      {lastResult && (
                        <small className="text-muted">
                          Utolsó eredmény: <strong>{lastResult}</strong>
                        </small>
                      )}
                    </div>
                    <h2 className="h4 mb-1">{displayExpression}</h2>
                  </div>

                  <Row className="g-3">
                    <Col md={8}>
                      <Card className="h-100">
                        <Card.Body className="p-3">
                          <Row className="g-2">
                            {digitButtons.map((d) => (
                              <Col xs={4} key={d}>
                                <Button
                                  variant="light"
                                  className="w-100 py-3 fs-5"
                                  onClick={() => handleDigit(d)}
                                >
                                  {d}
                                </Button>
                              </Col>
                            ))}
                            <Col xs={8}>
                              <Button
                                variant="outline-secondary"
                                className="w-100 py-3"
                                onClick={handleReset}
                              >
                                AC
                              </Button>
                            </Col>
                            <Col xs={4}>
                              <Button
                                variant="success"
                                className="w-100 py-3"
                                onClick={() => handleEquals()}
                                disabled={loading}
                              >
                                {loading ? (
                                  <Spinner size="sm" animation="border" />
                                ) : (
                                  "="
                                )}
                              </Button>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col md={4}>
                      <Card className="h-100">
                        <Card.Body className="p-3 d-grid gap-2">
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted">Műveletek</span>
                            <Badge bg="light" text="dark">
                              {operations.length}
                            </Badge>
                          </div>
                          {operations.map((op) => (
                            <Button
                              key={op}
                              variant={operator === op ? "primary" : "outline-primary"}
                              className="py-2"
                              onClick={() => handleOperator(op)}
                              disabled={loading}
                            >
                              {op === "*" ? "×" : op === "/" ? "÷" : op}
                            </Button>
                          ))}
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Stack>
              </Col>

              <Col lg={5}>
                <Card className="h-100">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold">Számítási előzmények</div>
                      <small className="text-muted">Az utolsó 10 művelet</small>
                    </div>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={handleClearHistory}
                      disabled={loading || history.length === 0}
                    >
                      Előzmények törlése
                    </Button>
                  </Card.Header>
                  <Card.Body className="history-list">
                    {history.length === 0 ? (
                      <p className="text-muted mb-0">Nincs még előzmény.</p>
                    ) : (
                      <ListGroup variant="flush">
                        {history
                          .slice()
                          .reverse()
                          .map((item, idx) => (
                            <ListGroup.Item
                              key={`${item.expression}-${idx}`}
                              className="d-flex justify-content-between align-items-center"
                            >
                              <span>{item.expression}</span>
                              <Badge bg="success" pill>
                                {item.result}
                              </Badge>
                            </ListGroup.Item>
                          ))}
                      </ListGroup>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
