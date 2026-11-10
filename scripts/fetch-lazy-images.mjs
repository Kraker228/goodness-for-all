// Haalt per maaltijd 2 foto's op van lazy-meals.com:
//  - "bord": foto van alleen het bord, voor de kleine kaart in de samensteller
//  - "sfeer": grotere sfeerfoto, voor de uitleg onderaan de pagina
//
// Gebruik (Node 18 of hoger), vanuit de root van de Next.js-repo:
//   node fetch-lazy-images.mjs
// De bestanden komen in public/meals/. Verwijs ernaar met /meals/<id>-bord.png enzovoort.
//
// Let op: vraag Roderick (LAZY) even om akkoord voor het gebruik van de foto's.

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = "https://www.lazy-meals.com/cdn/shop/files/";
const WIDTH = 900;
const OUT = "public/meals";

const MEALS = [
  { id: "gnocchi",  bord: "LV_Gnocchi_only_plate_Low_Res.png?v=1733935898", sfeer: "LV_Gnocchi_082.jpg?v=1762853076" },
  { id: "korean",   bord: "noodles-bord.png?v=1731657945", sfeer: "LV_Korean_Plate_9837.jpg?v=1762852827" },
  { id: "risotto",  bord: "LV_Risotto_only_plate_Low_Res.png?v=1733936085", sfeer: "LV_Risotto_19.jpg?v=1734013407" },
  { id: "tikka",    bord: "LV_Tikka_Masala_Only_plate_Low_Res.png?v=1733936330", sfeer: "LV_Tikka_masala_plate_94d50e52-3848-47b9-bd4c-13667f094a4a.jpg?v=1762852874" },
  { id: "thai",     bord: "LV_Thai_only_plate_Low_Res.png?v=1733935688", sfeer: "LV_Thai_Plate_Bas_2.jpg?v=1762852907" },
  { id: "ramen",    bord: "LAZY_Curry_Ramen_plate.png?v=1770813640", sfeer: "LAZY_Social_8.jpg?v=1770814263" },
  { id: "mexican",  bord: "250220_DOS_LAZY_VEGAN_Mexican_fusion_topshot_TC_ZONDER_SCHADUW_klein.png?v=1770815252", sfeer: "Lazy_Vegan_-_Falafel_Bowl_Mexican_Fusion_sfeer.png?v=1762852488" },
  { id: "lebanese", bord: "Lazy_Vegan_-_Falafel_Bowl_Lebanese_Bulgur.png?v=1745487377", sfeer: "Lazy_Vegan_-_Falafel_Bowl_Lebanese_Bulgur_sfeer_7f75d3b4-94b9-4929-be5d-833bd8c9132e.png?v=1762868961" },
];

async function download(file, name) {
  const url = `${BASE}${file}&width=${WIDTH}`;
  const ext = path.extname(file.split("?")[0]) || ".jpg";
  const target = path.join(OUT, `${name}${ext}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} voor ${url}`);
  await writeFile(target, Buffer.from(await res.arrayBuffer()));
  return `${name}${ext}`;
}

await mkdir(OUT, { recursive: true });
const result = {};
for (const m of MEALS) {
  result[m.id] = {
    img: "/meals/" + (await download(m.bord, `${m.id}-bord`)),
    imgLarge: "/meals/" + (await download(m.sfeer, `${m.id}-sfeer`)),
  };
  console.log("ok", m.id);
}
await writeFile(path.join(OUT, "meals-images.json"), JSON.stringify(result, null, 2));
console.log("Klaar. Paden staan in public/meals/meals-images.json");
