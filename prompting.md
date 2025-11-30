# Az MI ágenssel való fejlesztés lépései

Az alábbi dokumentáció azt írja le, hogyan használtam MI eszközöket a feladat lépésenkénti megoldásához. Mindegyik lépésnél leírom, hogy milyen eszközöket használtam pontosan, valamint a promptot ill. a promptolási heurisztikát.

## Specifikáció írása

Fontos, hogy a prompt tartalmazza a pontos elvárásokat. A specifikáció megírásához használtam a ChatGPT 5 nevű modellt, az alábbiak szerint:

Létrehoztam egy új projektet az online felhasználói felületen, majd a moodle-ben található házi feladat elvárások pdf-et feltöltöttem a fájlok közé.

Instrukcióként megadtam, hogy egy kalkulátort szeretnék fejleszteni, majd megadtam neki a specifikáció elvárt terjedelmét. Hangsúlyoztam, hogy vegye figyelembe a házi feladat elvárásokat és olyan specifikációt írjon, melyből hatékonyan lehet több pontot szerezni.

A specifikációt átnéztem, helyenként pontosítást, bővítést kértem, illetve ha túl sok követelményt szabott meg, azt kitöröltem. Fontos volt a specifikáció pontossága, ugyanis a későbbiek folyamán ebből a specifikációból kiindulva promptoltam az ágenseket.