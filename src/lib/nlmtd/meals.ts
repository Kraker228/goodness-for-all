/**
 * Maaltijden voor de NLMTD-pagina. Teksten en voedingswaarden letterlijk uit
 * het prototype (docs/prototype/nlmtd-abonnement.html); kcal, groenten, eiwit,
 * gewicht en allergenen gecontroleerd tegen de LAZY-productpagina's.
 * Foto's: public/meals/, opgehaald met scripts/fetch-lazy-images.mjs.
 */

export type MealImage = {
  src: string;
  width: number;
  height: number;
};

export type Meal = {
  id: string;
  name: string;
  /** Korte ondertitel voor de kaart in de samensteller. */
  sub: string;
  /** Week waarin deze smaak gegarandeerd in de vriezer ligt. */
  week: string;
  desc: string;
  kcal: number;
  /** Gram groenten per maaltijd. */
  veg: number;
  /** Gram eiwit per maaltijd. */
  protein: number;
  weight: string;
  allergens: string;
  ingredients: string;
  productUrl: string;
  /** Foto van alleen het bord, transparante achtergrond. */
  plate: MealImage;
  /** Sfeerfoto voor de uitgebreide uitleg. */
  mood: MealImage;
};

export const MEALS: Meal[] = [
  {
    id: "gnocchi",
    name: "Gnocchi Al Pesto",
    sub: "Spinaziegnocchi met gegrilde groenten en rode pesto",
    week: "11 jan",
    desc: "Mediterraanse spinazie gnocchi met gegrilde groenten, olijven en een smaakvolle rode pesto.",
    kcal: 444,
    veg: 292,
    protein: 14,
    weight: "400 g",
    allergens: "Gluten (durumtarwegriesmeel). Bevat kokos.",
    ingredients:
      "Gnocchi 29% (spinazie, durumtarwegriesmeel, water, zout), spinazie, rode ui, gegrilde aubergine, gegrilde courgette, gegrilde rode paprika, zwarte olijven, tomaten, kokosmelk, halfgedroogde tomaten, tomatenpuree, zonnebloempitten, knoflook, aardappelzetmeel, kokosolie, kikkererwtenmeel, erwtenvezel, edelgist, natuurlijke aroma’s, olijfolie, basilicum, zout, zwarte peper.",
    productUrl: "https://www.lazy-meals.com/products/gnocchi-al-pesto",
    plate: { src: "/meals/gnocchi-bord.png", width: 900, height: 900 },
    mood: { src: "/meals/gnocchi-sfeer.jpg", width: 749, height: 996 },
  },
  {
    id: "korean",
    name: "Korean Noodles",
    sub: "Knapperige groenten, edamame en een Aziatische saus",
    week: "18 jan",
    desc: "Koreaanse noedels boordevol knapperige trendy groenten zoals romanesco, kale, shiitakes en edamame bonen.",
    kcal: 464,
    veg: 270,
    protein: 17,
    weight: "450 g",
    allergens: "Gluten (tarwe), soja.",
    ingredients:
      "Gekookte tarwenoedels 33% (tarwebloem, water, zonnebloemolie, zout), romanesco, shiitake, edamame sojabonen, paprika, boerenkool, ui, bloemkool, knoflook, sojasaus (water, sojabonen, tarwe, zout), gember, zonnebloempitten, rijstazijn, ahornsiroop, champignonextract, rode chilipeper, karamel, natuurlijk aroma, zout.",
    productUrl: "https://www.lazy-meals.com/products/korean-noodles",
    plate: { src: "/meals/korean-bord.png", width: 900, height: 899 },
    mood: { src: "/meals/korean-sfeer.jpg", width: 900, height: 600 },
  },
  {
    id: "risotto",
    name: "Italian Risotto",
    sub: "Romig en plantaardig, met asperges en champignons",
    week: "25 jan",
    desc: "Zo’n lekkere romige risotto met authentieke Arborio-rijst, maar dan plant-based. Onze versie heeft lekker veel vers ingevroren groenten zoals asperges, champignons en cherrytomaat en een vegan roomsaus.",
    kcal: 400,
    veg: 200,
    protein: 12,
    weight: "400 g",
    allergens: "Bevat kokos.",
    ingredients:
      "Gekookte Arborio rijst 37% (water, rijst), champignons, cherrytomaten, doperwten, groene asperges, lente-ui, kokosmelk, eekhoorntjesbrood, bloemkool, aardappelzetmeel, peterselie, knoflook, kokosolie, kikkererwtenmeel, erwtenvezel, edelgist, raapzaadolie, ui, tomaat, wortel, zout, suiker, natuurlijke aroma’s, zwarte peper.",
    productUrl: "https://www.lazy-meals.com/products/italian-risotto",
    plate: { src: "/meals/risotto-bord.png", width: 900, height: 900 },
    mood: { src: "/meals/risotto-sfeer.jpg", width: 900, height: 720 },
  },
  {
    id: "tikka",
    name: "Tikka Masala",
    sub: "Indian-style curry met veel groenten",
    week: "1 feb",
    desc: "Onze Indian-style curry bomvol vers ingevroren groenten. Denk aan bloemkool, spinazie, rode paprika en wortel. En wat is een curry zonder rijst en een flinke mix van chili, knoflook en koriander? Dachten wij ook.",
    kcal: 491,
    veg: 252,
    protein: 24,
    weight: "450 g",
    allergens: "Mosterd (mosterdzaad). Bevat kokos.",
    ingredients:
      "Gekookte witte rijst 25% (water, rijst), tomaten, plantaardige stukjes (water, erwteneiwit, raapzaadolie, erwtenvezel, zetmeel, zonnebloemolie, zout), bloemkool, kikkererwten, wortel, spinazie, rode ui, kokosmelk, kokosolie, knoflook, gember, rode chilipeper, koriander, raapzaadolie, kokosrasp, korianderzaadpoeder, kurkuma, mosterdzaad, fenegriek, komijn, zout, kaneel, zwarte peper, kardemom, cayennepeper, venkel.",
    productUrl: "https://www.lazy-meals.com/products/tikka-masala",
    plate: { src: "/meals/tikka-bord.png", width: 900, height: 900 },
    mood: { src: "/meals/tikka-sfeer.jpg", width: 900, height: 567 },
  },
  {
    id: "thai",
    name: "Thai Green Curry",
    sub: "Thaise curry met sugar snaps en babymaïs",
    week: "8 feb",
    desc: "Onze Thai-style curry maken we met sugar snaps, babymais, groene paprika, wortel en rijst. En natuurlijk onze Chicken Style Pieces, gemaakt van erwtenproteine. In een onweerstaanbare saus van gember, knoflook en koriander, naar authentiek Thais recept.",
    kcal: 450,
    veg: 230,
    protein: 22,
    weight: "450 g",
    allergens: "Bevat kokos.",
    ingredients:
      "Gekookte rijst 25% (water, rijst), plantaardige stukjes (water, erwteneiwit, raapzaadolie, erwtenvezel, zetmeel, zonnebloemolie, zout), broccoli, spitskool, wortelen, kokosmelk, ui, sugarsnaps, paprika, koriander, knoflook, gember, groene chilipeper, spinazie, limoensap, laos, kaffir limoenblad, citroengras, rode chilipeper, agavesiroop, zout, witte peper, komijn, kardemom.",
    productUrl: "https://www.lazy-meals.com/products/thai-green-curry",
    plate: { src: "/meals/thai-bord.png", width: 900, height: 901 },
    mood: { src: "/meals/thai-sfeer.jpg", width: 900, height: 600 },
  },
  {
    id: "ramen",
    name: "Curry Ramen",
    sub: "Comfort bowl in een zijdezachte kokos-currysoep",
    week: "15 feb",
    desc: "Laat je verrassen door deze Aziatische comfort bowl met knapperige groenten, noedels en edamame, verrijkt met black fungus en geserveerd in een zijdezachte, geurige kokos-currysoep met een subtiele spicy touch.",
    kcal: 492,
    veg: 288,
    protein: 17,
    weight: "450 g",
    allergens: "Gluten (tarwe), soja. Bevat kokos.",
    ingredients:
      "Gekookte tarwenoedels 23% (tarwebloem, water, zonnebloemolie, zout), wortel, suikersnaps, edamame sojabonen, gegrilde aubergine, judasoor paddenstoelen, kokosmelk, ui, paprika, knoflook, citroengras, groentebouillon (zout, natuurlijke aroma’s, suiker, ui, tomaat, wortel, raapzaadolie), limoensap, rode chilipeper, sjalot, champignonextract, komijn, laos, cayennepeper, korianderzaadpoeder, paprikaextract, zout, raapzaadolie.",
    productUrl: "https://www.lazy-meals.com/products/curry-ramen",
    plate: { src: "/meals/ramen-bord.png", width: 900, height: 899 },
    mood: { src: "/meals/ramen-sfeer.jpg", width: 900, height: 1125 },
  },
  {
    id: "mexican",
    name: "Falafel Mexican Fusion",
    sub: "Falafelbowl met quinoa en koriander-limoendressing",
    week: "22 feb",
    desc: "Een heerlijke Falafel Bowl met een Mexicaanse twist! De bowl bevat bruine rijst, quinoa, mini falafel en veel kleurrijke groenten en peulvruchten zoals zoete aardappel, paprika, broccoli, maïs en kidneybonen. Dit alles is gemixt met een verfrissende koriander-limoendressing.",
    kcal: 499,
    veg: 238,
    protein: 16,
    weight: "375 g",
    allergens: "Gluten (tarwe in de falafel).",
    ingredients:
      "Groenten en peulvruchten 52% (rode kidneybonen, broccoli, zoete aardappel, maïs, paprika, rode ui), gemengde bruine rijst en quinoa 26%, koriander-limoendressing (knoflook, zonnebloemolie, limoensap, ui, koriander, groene chilipeper, agavesiroop, zout), falafel 10% (kikkererwten, water, tarwebloem, ui, wortel, courgette, zonnebloemolie, raapzaadolie, peterselie, koriander, specerijen, zout, verdikkingsmiddel: methylcellulose, azijn, zuurteregelaar: kaliumacetaten, natuurlijk aroma (tarwe), laurierblad).",
    productUrl: "https://www.lazy-meals.com/products/mexican-fusion",
    plate: { src: "/meals/mexican-bord.png", width: 900, height: 868 },
    mood: { src: "/meals/mexican-sfeer.png", width: 900, height: 1214 },
  },
  {
    id: "lebanese",
    name: "Falafel Lebanese Bulgur",
    sub: "Falafelbowl met bulgur en citroen-kruidendressing",
    week: "1 mrt",
    desc: "Een Libanese stijl Falafel Bowl boordevol verse groenten, kikkererwten, linzen, bulgur en natuurlijk mini-falafel, allemaal gecombineerd met een verfrissende citroen-kruidendressing.",
    kcal: 431,
    veg: 233,
    protein: 16,
    weight: "375 g",
    allergens: "Gluten (tarwe in de bulgur en de falafel).",
    ingredients:
      "Groenten en peulvruchten 55% (gegrilde pompoen, bloemkool, boerenkool, kikkererwten, linzen, cherrytomaten, rode ui), gekookte bulgur 24% (water, durumtarwegriesmeel), citroen-kruidendressing (olijfolie, citroensap, citroengras, munt, peterselie, citroenschil, knoflook, zout, zwarte peper), falafel 10% (kikkererwten, water, tarwebloem, ui, wortel, courgette, zonnebloemolie, raapzaadolie, peterselie, koriander, specerijen, zout, verdikkingsmiddel: methylcellulose, azijn, zuurteregelaar: kaliumacetaten, natuurlijk aroma (tarwe), laurierblad).",
    productUrl: "https://www.lazy-meals.com/products/falafel-bowl-lebanse-bulgur",
    plate: { src: "/meals/lebanese-bord.png", width: 900, height: 900 },
    mood: { src: "/meals/lebanese-sfeer.png", width: 900, height: 1183 },
  },
];

export function getMeal(id: string): Meal | undefined {
  return MEALS.find((meal) => meal.id === id);
}

/** Ronde, strak bijgesneden bordfoto's (640 px webp) voor de draaiende munt. */
export const COIN_IMAGES = MEALS.map((meal) => ({
  src: `/meals/coin/${meal.id}.webp`,
  alt: meal.name,
}));
