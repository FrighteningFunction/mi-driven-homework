# Az MI ágenssel való fejlesztés lépései

Az alábbi dokumentáció azt írja le, hogyan használtam MI eszközöket a feladat lépésenkénti megoldásához. Mindegyik lépésnél leírom, hogy milyen eszközöket használtam pontosan, valamint a promptot ill. a promptolási heurisztikát.

## Felhasznált ágens

A promptolás során hibrid megközelítéssel használtam a ChatGPT webes chat felületét, valamint a VS Code-ba tervezett Codex bővítményt is. A kódoláshoz elsősorban az utóbbit használtam.

## Specifikáció írása

Fontos, hogy a prompt tartalmazza a pontos elvárásokat. A specifikáció megírásához használtam a ChatGPT 5 nevű modellt, az alábbiak szerint:

Létrehoztam egy új projektet az online felhasználói felületen, majd a moodle-ben található házi feladat elvárások pdf-et feltöltöttem a fájlok közé.

Instrukcióként megadtam, hogy egy kalkulátort szeretnék fejleszteni, majd megadtam neki a specifikáció elvárt terjedelmét. Hangsúlyoztam, hogy vegye figyelembe a házi feladat elvárásokat és olyan specifikációt írjon, melyből hatékonyan lehet több pontot szerezni.

A specifikációt átnéztem, helyenként pontosítást, bővítést kértem, illetve ha túl sok követelményt szabott meg, azt kitöröltem. Fontos volt a specifikáció pontossága, ugyanis a későbbiek folyamán ebből a specifikációból kiindulva promptoltam az ágenst.

## Felhasznált Promptok a kódolás során

```text
This is the specification of the sofware you need to write. You need to use FastAPI with Python to code the server logic in the /backend folder. Be precise about the expectations. Start by first writing the server code in the /backend folder.
```

Ezután létrehozott egy alapvető backend kódot, mely több helyen is szintaktikai hibás volt.

```text
Now based on the specification.md write tests that test all the requirements that the backend should met, including possible errors. use pytest. Fix any errors you find.
```

Az eredmény ezután az volt, hogy létrehozta a teszteket, ide beleértve a szélső eseteket, majd az eredményekre alapozva iteratívan megjavította a szerveroldali logikát.

### Creating the frontend

```text
okay. now your next task is that using npx create-next-app@latest command in the /frontend folder. there you first scaffold the app, review the new folder structure, delete unnecessary starter page files, and you create the interface that fully complies with the specification attached. Also take the backend code you wrote earlier into consideration. Be precise and create a simple user interface using react bootstrap.
```

Ezután a prompt után, a Codex ágens felhasználta az a scaffold parancsot, melyet megsúgtam neki (ezzel azt biztosítottam, hogy ne elavult parancsot használjon), és egyedül, összedöbött egy egyszerű de teljesen funkcionális kalkulátort. A prompthoz csatoltam még egyszer a specifikációt, hogy biztosan hangsúlyt kapjon.

A frontendet leteszteltem és az összes használati esetnek megfelelt.

### A dokumentáció írása

```text

This is the scoring guideline based on which they will score your work:

DOKUMENTÁCIÓ
A dokumentáció tetszőleges formátumban készülhet, lehet docx fájl, pdf, vagy egy, vagy több md fájl is
az alapja. Terjedelme kb 3-4 nyomtatott oldal.
• 0 – Nincs dokumentáció
• 5 – A dokumentáció túl rövid (1-2 oldal), hibákat tartalmaz, vagy fontos strukturális elemei
hiányoznak
• 10 – Megfelelő dokumentáció

based on this sofware, in a new file called documentation.md, you need to write 3-4 pages worth, which is around 8000 characters. You should confirm your progress by counting the amount of characters you wrote from time to time, use built-in powershell tool to count the amount of characters you have written so far.

Make sure to be precise: include reasoning, like if you were to read it one day later and you would immediately understand your own code better. Choose an ordered way in which you show in the documentation the software you just created. Make sure to review each file and explain its purpose. Use headers, and sparingly lists to structurize your documentation. Be very precise and consider readability. Be verbose.

```

Itt fontos volt, hogy megadjak neki egy támpontot, mely alapján magát ellenőrizheti, mely ez esetben a karakterszám volt (egy egyszerű powershell paranccsal). Enélkül nem tudta volna felmérni nyelvi modellként, hogy pontosan hol is tart az elvárt karakterszámot tekinthetően: így tudott iterálni mindaddig, míg az elvárt karakterszámot el nem érte. A végeredmény egy szakmailag pontos dokumentáció lett.


