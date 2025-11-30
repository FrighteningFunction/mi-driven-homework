# Kalkulátor Alkalmazás – Részletes Dokumentáció

## 1. Cél és áttekintés
Ez a dokumentáció a FastAPI alapú backenddel és Next.js + React-Bootstrap alapú frontenddel megvalósított egyszerű, webes kalkulátor alkalmazást írja le. A cél: alapműveletek (+, −, ×, ÷) végrehajtása, az utolsó 10 művelet tárolása és megjelenítése, valamint a műveleti lista törlése. A dokumentum fejlesztőknek szól, hogy egy nappal később visszanézve is azonnal érthető legyen a kód és a futtatási mód.

## 2. Fő mappák és fájlok
- `backend/`: FastAPI alkalmazás és tesztek.
  - `main.py`: API, üzleti logika, CORS, memória-alapú előzménytár.
  - `requirements.txt`: Python függőségek (fastapi, uvicorn).
  - `test_main.py`: Pytest-alapú egységtesztek az összes követelményre.
- `frontend/`: Next.js 16 App Router alapú UI.
  - `src/app/layout.tsx`: Globális layout, Bootstrap import, meta adatok.
  - `src/app/globals.css`: Alap stílusok, háttér, kártya és lista layout.
  - `src/app/page.tsx`: Teljes kalkulátor felület React-Bootstrap komponensekkel, backend hívásokkal.
  - `package.json`: NPM függőségek (next, react, react-bootstrap, bootstrap).
  - `postcss.config.mjs`: Üres plugin lista (Tailwind eltávolítva).
- `documentation.md`: Jelen dokumentum.
- `specification.md`: Eredeti funkcionális követelmények (referenciának).

## 3. Architektúra röviden
- **Backend (FastAPI)**: REST végpontok `POST /calculate`, `GET/DELETE /history`, `GET /last`, `GET /operations`. Memóriában tartja az utolsó 10 műveletet; nullával osztás és nem támogatott operátor esetén hibát dob.
- **Frontend (Next.js, React-Bootstrap)**: Egyoldalas UI. A felhasználó számjegyekkel és műveleti gombokkal állítja össze a kifejezést; a backend végzi a számítást. Előzménylista jobbra, törlés gombbal.
- **Adattárolás**: Memória (lista). Minden indításkor tiszta állapot.
- **Kommunikáció**: JSON REST HTTP-n keresztül. Alap host: `http://localhost:8000`, konfigurálható `NEXT_PUBLIC_API_BASE` env változóval.

## 4. Backend részletei (`backend/main.py`)
### 4.1 Adatmodellek
- `CalculationRequest`: Pydantic modell, mezők: `operand1` (alias `a`), `operand2` (alias `b`), `operator` (alias `op`). `populate_by_name=True` engedi az aliasokat. `operator` szabad sztring, hogy saját hibaüzenetet adhassunk 400-ra.
- `CalculationResult`: `expression` (sztring), `result` (float).

### 4.2 Állapot
- `history: List[CalculationResult]`: Memóriában tartja az utolsó 10 műveletet. `_push_history` gondoskodik a limitről (régi elemek levágása).

### 4.3 Üzleti logika
- `_compute(req)`: Ellenőrzi az operátort, nullával osztás esetét, majd végrehajtja a műveletet a `SUPPORTED_OPERATIONS` lambda táblázattal.

### 4.4 Végpontok
- `POST /calculate`: Számít, push-olja az előzményt, visszaadja az eredményt.
- `GET /history`: Teljes előzménylista (max 10).
- `DELETE /history`: Kiüríti az előzménylistát, üres listát ad vissza.
- `GET /last`: Utolsó művelet, 404 ha nincs.
- `GET /operations`: Támogatott operátorok listája.
- `GET /`: Alap státusz, végpont felsorolással.

### 4.5 CORS
`CORSMiddleware` engedi az összes origin/method/header-t a frontendhez.

### 4.6 Indítás
`uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)` a fejlesztői futtatáshoz.

## 5. Backend tesztelés (`backend/test_main.py`)
- Pytest + FastAPI `TestClient` használata. Az `autouse` fixture minden tesztnél törli a history-t.
- Fő tesztcsoportok:
  - Root és `/operations` elérhetőség.
  - Négy alapművelet helyes eredménnyel.
  - Hibák: nem támogatott operátor (400), nullával osztás (400).
  - Előzmény hossza, 10 elemre vágás, törlés működése.
  - `/last` 404 üres állapotban, és helyes érték utolsó műveletnél.
  - Kimeneti aliasok használata az API hívásokban (`a`, `b`, `op`).

## 6. Frontend felépítés
### 6.1 Technológia
- Next.js 16 App Router, TypeScript.
- React-Bootstrap komponensek, Bootstrap 5.3 CSS globálisan importálva.

### 6.2 Fájlok és szerepük
- `layout.tsx`: Beállítja a dokumentum nyelvét (hu), meta cím/desc, betölti a Bootstrap CSS-t és a globális stílusokat.
- `globals.css`: Háttér gradiensek, kártya keretezés, display panel, history lista max-magasság. Egyszerű, letisztult, nem Tailwind-alapú.
- `page.tsx`: Egyetlen UI oldal:
  - State: `currentValue`, `operator`, `firstOperand`, `history`, `operations`, `lastResult`, `loading`, `error`.
  - `API_BASE`: `NEXT_PUBLIC_API_BASE` env vagy `http://localhost:8000`.
  - `fetchOperations`, `fetchHistory`: betöltés induláskor, művelet-lista szűrés megengedett operátorokra.
  - Kezelők: `handleDigit`, `handleOperator`, `handleEquals`, `handleClearHistory`, `handleReset`.
  - UI: bal oldalt kijelző + numerikus keypad + művelet gombok; jobb oldalt előzmény lista, törlés gomb; badge-ek a technológiákhoz; hibaüzenet Alertben; Loading jelzés gombon.
  - Műveletláncolás: ha már van `firstOperand` és `operator` és új operátor érkezik, `handleEquals` meghívódik, így folyamatos számítás lehetséges.

### 6.3 Styling döntések
- Minimalista, világos téma, könnyen olvasható tipó (Segoe UI).
- Shadow és kártya keret a kalkulátor dobozhoz; külön panel az előzményeknek.

## 7. API szerződés összefoglaló
- `POST /calculate` body: `{ "a": number, "b": number, "op": "+|-|*|/" }` → `200 { "expression": "a op b", "result": number }` vagy `400` hibákra.
- `GET /history` → lista `[{expression, result}]`, max 10.
- `DELETE /history` → üres lista.
- `GET /last` → utolsó elem vagy `404`.
- `GET /operations` → pl. `["+", "-", "*", "/"]`.
- `GET /` → státusz + végpont lista.

## 8. Fejlesztői környezet és futtatás
### 8.1 Előkészületek
- Python 3.10+ javasolt, de 3.11-en tesztelve.
- Node 18+ javasolt Next.js-hez.

### 8.2 Backend futtatás
```
cd backend
python -m venv .venv && .venv\Scripts\activate  # ha nincs aktív env
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
Swagger UI: `http://localhost:8000/docs`

### 8.3 Frontend futtatás
```
cd frontend
npm install
npm run dev
```
Alap URL: `http://localhost:3000`. Ha a backend nem a defaulton fut, állítsd: `NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000 npm run dev`.

## 9. Tesztek futtatása
```
cd backend
pytest
```
Minden funkcionális követelmény lefedve (13 teszt). A futtatás után keletkező `.pytest_cache` és venv mappák `.gitignore`-ban szerepelnek.

## 10. Hibakezelés és edge case-ek
- **Nullával osztás**: 400, üzenet: "Division by zero is not allowed".
- **Nem támogatott operátor**: 400, üzenet: "Unsupported operator".
- **Hiányzó operandus vagy operátor** (frontend): felhasználói hibaüzenet; backend Pydantic validáció is véd.
- **Előzmény limit**: 10 elemre vágás `_push_history`-ben.
- **Üres előzmény**: `/last` 404-et ad, frontend üres listát mutat.
- **Hálózati hiba**: frontend "Nem sikerült elérni a szervert" üzenetet ad.

## 11. Példafolyamat
1) Felhasználó beírja `8 × 7`-et a UI-ban, `=`-et nyom.
2) Frontend POST: `{ "a": 8, "b": 7, "op": "*" }` → backend kiszámol, visszaadja az eredményt 56.
3) Frontend kijelző frissül, history listához hozzáadja az új sort, `lastResult` is frissül.
4) Felhasználó az "Előzmények törlése" gombra kattint → `DELETE /history`, UI kiüríti a listát.

## 12. Függőségek
- **Backend**: `fastapi`, `uvicorn`. Tesztek: `pytest`, `httpx` (TestClient miatt transitív).
- **Frontend**: `next@16`, `react@19`, `react-dom@19`, `react-bootstrap`, `bootstrap`.
- **Eszközök**: ESLint (Next config), TypeScript.

## 13. Ismert korlátok és jövőbeli bővítések
- **Perzisztencia**: Memória alapú; újraindításkor törlődik. Jövőbeli lépés: SQLite/JSON fájl mentés.
- **Validáció**: Operátor lista fix; további funkció (pl. hatványozás) esetén bővítés a `SUPPORTED_OPERATIONS`-ben és a frontenden.
- **Nemzetközi formátum**: Tizedes ponttal számol (Python float). Lokalizált formázás jövőbeli feladat.
- **E2E tesztek**: Nincsenek. Playwright/Cypress hozzáadható a frontend viselkedésének teszteléséhez.
- **Stílus**: Világos téma fixen; sötét mód opcionálisan bevezethető.

## 14. Telepítés és üzemeltetés
- Minimális követelmények: ~200 MB memória a backendhez, Node futtatókörnyezet a frontendhez.
- Ajánlott: külön processz vagy konténer a backendnek és a frontendnek; reverse proxy (nginx) a két szolgáltatás elé, CORS helyett ugyanazon host alá proxizva.

## 15. MI-eszközök használata
Az alkalmazás specifikációja, backend, frontend és dokumentáció MI-eszköz (ChatGPT) segítségével készült, emberi felügyelettel átnézve és tesztelve. A kód kommentjei és tesztjei biztosítják az utólagos érthetőséget.

## 16. Rövid összegzés
Az alkalmazás megfelel a specifikációban rögzített követelményeknek: négy alapművelet, előzménykezelés (max 10 elem), törlés, hibakezelés, reszponzív webes felület, FastAPI backend és React/Next frontend. A projektszerkezet egyszerű, karbantartható, a tesztek lefedik az üzleti logikát, a frontend pedig jól elkülöníti a felhasználói interakciókat az API-hívásoktól.
