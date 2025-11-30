## **Kalkulátor Alkalmazás – Specifikáció**

### 1. **Bevezetés**

A házi feladat célja egy egyszerű, webalapú **kalkulátor alkalmazás** fejlesztése, amely képes alapvető matematikai műveletek (összeadás, kivonás, szorzás, osztás) elvégzésére.
Az alkalmazás két komponensből áll:

* **Frontend:** egy letisztult webes felület, ahol a felhasználó beírhatja a műveletet, illetve láthatja az eredményt.
* **Backend:** egy kiszolgáló (Python FastAPI), amely a műveletet elvégzi és visszaküldi az eredményt a kliensnek.

A fejlesztés során **mesterséges intelligencia (MI) alapú fejlesztési eszközöket** (például ChatGPT, GitHub Copilot, Gemini, Claude) használok a specifikáció, a backend, a frontend és a dokumentáció elkészítéséhez.
A cél annak demonstrálása, hogy az MI-eszközök segítségével gyorsan és hatékonyan lehet egyszerű, működőképes szoftveralkalmazásokat fejleszteni.

---

### 2. **Felhasználói szerepkörök**

Az alkalmazásban egyetlen felhasználói szerepkör van:

* **Felhasználó**

  * Matematikai műveleteket adhat meg (pl. „5 + 3”).
  * Az eredményt megtekintheti a kijelzőn.
  * Az előző műveletek listáját megtekintheti („számítási előzmények”).
  * A listát törölheti, ha újrakezdené a számolást.

---

### 3. **Forgatókönyvek**

**1. Alapművelet elvégzése**

* A felhasználó megnyitja az alkalmazást.
* A képernyőn megjelenik egy numerikus billentyűzet (0–9) és az alapvető műveleti gombok (+, −, ×, ÷, =).
* A felhasználó beírja: „8 × 7”, majd megnyomja az „=” gombot.
* A frontend elküldi a műveletet a backendnek.
* A backend elvégzi a számítást, és visszaküldi az eredményt (56).
* Az eredmény megjelenik a kijelzőn, és bekerül a műveleti előzmények közé.

**2. Előzmények törlése**

* A felhasználó megnyomja az „Előzmények törlése” gombot.
* A frontend HTTP-kérést küld a backendnek.
* A backend törli az előzménylistát, majd visszaküld egy üres listát.
* A frontend frissíti a kijelzőt.

---

### 4. **Funkcionális követelmények**

| Azonosító | Funkció                  | Leírás                                                                           |
| --------- | ------------------------ | -------------------------------------------------------------------------------- |
| F1        | Összeadás                | A backend elvégzi két szám összeadását.                                          |
| F2        | Kivonás                  | A backend elvégzi két szám kivonását.                                            |
| F3        | Szorzás                  | A backend elvégzi két szám szorzását.                                            |
| F4        | Osztás                   | A backend elvégzi két szám osztását, és hibát jelez nullával való osztás esetén. |
| F5        | Előzmények megjelenítése | A backend listában tárolja az utolsó 10 műveletet.                               |
| F6        | Előzmények törlése       | A backend kiüríti a tárolt előzményeket.                                         |

---

### 5. **Nem funkcionális követelmények**

* **Használhatóság:** az alkalmazás egy egyszerű, reszponzív webes felületen működik.
* **Megbízhatóság:** a backend kezelje a hibás bemeneteket (pl. „8 ÷ 0”).
* **Karbantarthatóság:** a kód AI-segítséggel generált, de ember által áttekintett és kommentált.

---

### 6. **Architektúra**

**Frontend:**

* HTML/CSS + TypeScript (React)
* Kommunikál a backenddel REST API-n keresztül (pl. `POST /calculate`, `GET /history`, `DELETE /history`)

**Backend:**

* Python FastAPI
* Végpontok:

  * `POST /calculate` – fogad két operandust és egy operátort, visszaküldi az eredményt
  * `GET /history` – visszaadja az előzményeket
  * `GET /last` – visszaadja az utoljára elvégzett számítást és eredményét
  * `GET /operations` – visszaadja a támogatott műveletek listáját (pl. ["+", "-", "*", "/"])
  * `DELETE /history` – törli az előzményeket

**Adattárolás:**

* Egyszerű Python lista (vagy JSON fájl) tárolja az utolsó 10 számítást.
---

### 7. **Összefoglalás**

A kalkulátor alkalmazás célja, hogy gyorsan és egyszerűen elvégezze az alapvető matematikai műveleteket, mint az összeadás, kivonás, szorzás és osztás. A rendszer reszponzív webes felülettel és stabil háttérszolgáltatással rendelkezik, így a számítások azonnal megjelennek és eltárolhatók az előzmények között. Az alkalmazás a mindennapi használatra készült, egyszerű, letisztult és megbízható működéssel.
