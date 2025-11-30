# Az MI ágenssel való fejlesztés lépései

Az alábbi dokumentáció azt írja le, hogyan használtam MI eszközöket a feladat lépésenkénti megoldásához. Mindegyik lépésnél leírom, hogy milyen eszközöket használtam pontosan, valamint a promptot ill. a promptolási heurisztikát.

## Specifikáció írása

Fontos, hogy a prompt tartalmazza a pontos elvárásokat. A specifikáció megírásához használtam a ChatGPT 5 nevű modellt, az alábbiak szerint:

Létrehoztam egy új projektet az online felhasználói felületen, majd a moodle-ben található házi feladat elvárások pdf-et feltöltöttem a fájlok közé.

Instrukcióként megadtam, hogy egy kalkulátort szeretnék fejleszteni, majd megadtam neki a specifikáció elvárt terjedelmét. Hangsúlyoztam, hogy vegye figyelembe a házi feladat elvárásokat és olyan specifikációt írjon, melyből hatékonyan lehet több pontot szerezni.

A specifikációt átnéztem, helyenként pontosítást, bővítést kértem, illetve ha túl sok követelményt szabott meg, azt kitöröltem. Fontos volt a specifikáció pontossága, ugyanis a későbbiek folyamán ebből a specifikációból kiindulva promptoltam az ágenseket.

## Felhasznált Promptok a kódolás során

```text
This is the specification of the sofware you need to write. You need to use FastAPI with Python to code the server logic in the /backend folder. Be precise about the expectations. Start by first writing the server code in the /backend folder.
```
```text
Now based on the specification.md write tests that test all the requirements that the backend should met, including possible errors. use pytest.
```

The result after this was, that it created the tests, including edge cases throughtly, and based on the results it iteratively fixed the backend code.

### Creating the frontend

```text
okay. now your next task is that using npx create-next-app@latest commdn in the /frontend folder. there you first scaffold the app, review the new folder structure, delete unnecessary starter page files, and you create the interface that fully complies with the specification attached. Also take the backend code you wrote earlier into consideration. Be precise and create a simple user interface using react bootstrap.
```
After this prompt, the Codex Agent used the scaffold command I tipped (this ensures it does not use deprecated scaffolding), and by itself, created a simple yet fully functional calculator.


