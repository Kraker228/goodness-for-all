# Opdracht: abonnementspagina /nlmtd in de Goodness for All-site

Bouw in de bestaande Goodness for All-site (Next.js op Vercel) een nieuwe, niet-geïndexeerde pagina op `/nlmtd`. Het is een abonnementspagina voor de consultants van NLMTD.

**Het werk gaat in twee fases.** Bouw nu alleen **fase 1**: de volledige pagina, inclusief echte foto's, met een placeholder voor het afrekenen. Sectie 6 (Mollie, Google Sheet, bevestigingsmail) en sectie 7 (script voor abonnementen) zijn **fase 2** en bouw je NU NIET. Ik vraag fase 2 later apart aan.

Er is een werkend visueel prototype met alle Nederlandse teksten, smaakdata en voorwaarden. Dat bestand staat in de repo op `docs/prototype/nlmtd-abonnement.html`. Gebruik het als bron voor **structuur, gedrag en teksten**, maar NIET voor de styling: de pagina moet er volledig uitzien als onderdeel van goodnessforall.nl.

## 0. Eerst doen, voordat je code schrijft

1. Werk in de repo `Kraker228/goodness-for-all` (niet `sirprikkel/goodness-for-all`). De default branch is `master`, niet `main`. Maak een feature branch `feature/nlmtd-abonnement`, push niet rechtstreeks naar `master`.
2. Lees de bestaande conventies: eventuele `CLAUDE.md`, de layout, bestaande pagina's (zoals `/voor-buurthuizen`), de gedeelde componenten (knoppen, kaarten, dialogen, formuliervelden, footer/header) en de bestaande bestelformulieren met Google Sheets-koppeling. Bepaal of de repo de App Router of Pages Router gebruikt en volg dat.
3. Hergebruik bestaande componenten, helpers (ook de Google Sheets-helper en de Resend-mailhelper) en design tokens. Maak alleen nieuwe componenten als er echt niets passends is.
4. Geef me een kort plan (bestanden die je aanmaakt of wijzigt, en eventuele vragen) en ga daarna bouwen.

## 1. Huisstijl en harde regels

- Huisstijl van goodnessforall.nl: Evergreen `#2D4A3E`, Harvest Orange `#E8732A`, Sandstone Beige `#F2EAD8`; Baloo voor koppen, Red Hat Display voor lopende tekst. Gebruik de bestaande tokens, klassen of Tailwind-config, geen losse hexcodes in componenten.
- **Nooit em dashes** (en geen en dashes) in teksten of code. Gebruik komma's, dubbele punten of aparte zinnen.
- Typografische apostrof (’) en aanhalingstekens (“ ”) in alle zichtbare tekst.
- Alle teksten in het Nederlands, jij-vorm. Bedragen opgemaakt als `€ 18,00` via `Intl.NumberFormat("nl-NL")`.
- Gebruik het echte Goodness for All-logo uit de repo, niet het tekstlogo uit het prototype.
- Toegankelijk: zichtbare focus, labels bij alle velden, `aria-pressed` op togglers, `prefers-reduced-motion` respecteren, goed bruikbaar op 390 px breed.
- Pagina niet indexeren: `robots: { index: false, follow: false }` in de metadata, en niet opnemen in sitemap of navigatie.

## 2. Co-branding

De pagina is duidelijk gedeeld met NLMTD:
- Header: Goodness for All-logo, een "×", en het NLMTD-logo.
- Hero: "Een samenwerking met" plus het witte NLMTD-logo op de donkergroene achtergrond.
- Footer: NLMTD-logo (wit).
- De logo's staan in `public/nlmtd/`: `Logo_groen___tekst.png` (voor lichte achtergrond), `Logo_wit___tekst.png` (voor donkere achtergrond), plus `Logo_groen.png` en `Logo_wit.png` (alleen de oneindigheidslus). Gebruik `next/image` met een zinnige `alt`: "NLMTD, create the future".

## 3. Foto's van de maaltijden

De foto's komen van de LAZY-productpagina's. Gebruik het script `scripts/fetch-lazy-images.mjs` (staat in de repo): het downloadt per maaltijd een bordfoto (`<id>-bord.*`, kleine kaart) en een sfeerfoto (`<id>-sfeer.*`, uitleg onderaan) naar `public/meals/` en schrijft `public/meals/meals-images.json`.

1. Draai het script en commit de gedownloade bestanden. Gebruik daarna `next/image` met vaste `width`/`height`, `sizes` en `alt` (naam van de maaltijd bij de uitgebreide foto, lege alt bij de kleine kaartfoto omdat de naam ernaast staat).
2. Controleer visueel dat elke foto klopt bij de juiste maaltijd. Mislukt een download, of is een foto niet bruikbaar (bijvoorbeeld geen bordfoto), haal dan de `og:image` en de galerij van de productpagina zelf op en kies een bruikbare foto.
3. Productpagina's (bron van waarheid voor foto's en voedingsinformatie):

| id | Naam op de pagina | Productpagina | Smaak van de week (week van) |
|---|---|---|---|
| gnocchi | Gnocchi Al Pesto | https://www.lazy-meals.com/products/gnocchi-al-pesto | 11 jan |
| korean | Korean Noodles | https://www.lazy-meals.com/products/korean-noodles | 18 jan |
| risotto | Italian Risotto | https://www.lazy-meals.com/products/italian-risotto | 25 jan |
| tikka | Tikka Masala | https://www.lazy-meals.com/products/tikka-masala | 1 feb |
| thai | Thai Green Curry | https://www.lazy-meals.com/products/thai-green-curry | 8 feb |
| ramen | Curry Ramen | https://www.lazy-meals.com/products/curry-ramen | 15 feb |
| mexican | Falafel Mexican Fusion | https://www.lazy-meals.com/products/mexican-fusion | 22 feb |
| lebanese | Falafel Lebanese Bulgur | https://www.lazy-meals.com/products/falafel-bowl-lebanse-bulgur | 1 mrt |

Neem de maaltijddata (ondertitel, beschrijving, kcal, groenten, eiwit, gewicht, ingrediënten, allergenen) letterlijk over uit de `MEALS`-array in het prototype en zet die in een typed databestand, bijvoorbeeld `data/nlmtd-meals.ts`. Controleer kcal, ingrediënten en allergenen steekproefsgewijs tegen de productpagina's.

## 4. Pagina-opbouw (volgorde)

1. Conceptstrip NIET overnemen (alleen voor het prototype).
2. Header met co-branding.
3. Hero (donkergroen): kop "Jij eet lekker. Iemand anders eet mee.", introtekst, drie feitenpillen (€6 per maaltijd, normaal €8 / Eerste levering maandag 11 januari / Aanmelden kan tot en met 15 december), knop "Stel je abonnement samen" (anker naar `#samenstellen`), NLMTD-logo, en rechts twee borden ("voor jou" en "voor iemand anders"). Gebruik hier twee echte bordfoto's.
4. "Waarom deze maaltijden?": korte punten (lekker, makkelijk, gezond / geen gedoe) en de impactstelling: elke maaltijd die jij koopt, wordt ook gegeven aan iemand die nu geen toegang heeft tot gezond eten.
5. "Zo werkt het": 4 genummerde stappen (stel samen, betaal je eerste bestelling, haal op bij NLMTD, doorgaan als er genoeg animo is).
6. "Stel je abonnement samen" (`id="samenstellen"`): zie sectie 5.
7. "De smaken": per smaak een uitgebreid blok (`id="smaak-<id>"`) met sfeerfoto, naam, beschrijving, kcal/groenten/eiwit/gewicht, allergenen, uitklapbare ingrediënten en een link "Terug naar je abonnement". Wissel de foto links/rechts af op desktop.
8. Veelgestelde vragen (details/summary).
9. Footer met Stichting-gegevens (KvK 73004521, Van der Duijn van Maasdamweg 480, Rotterdam, info@goodnessforall.nl), link naar algemene voorwaarden, NLMTD-logo.

Alle teksten, de FAQ en de algemene voorwaarden staan in het prototype. Neem ze over, tenzij hieronder anders staat. Houd de gemarkeerde "nog te bepalen"-blokken in de algemene voorwaarden (herroepingsrecht, niet opgehaalde maaltijden) zichtbaar als conceptmarkering, zodat ik ze kan invullen.

## 5. De samensteller (gedrag)

Constanten in één bestand (`lib/nlmtd/config.ts`), zodat ze op één plek te wijzigen zijn:
```
PRICE_CENTS = 600            // €6, na 25% korting
NORMAL_PRICE_CENTS = 800     // €8
MEALS_MIN = 2, MEALS_MAX = 12
FREQUENCIES = [1, 2, 3, 4]   // leveringen per maand
SIGNUP_DEADLINE = 2026-12-15 23:59 Europe/Amsterdam
FIRST_DELIVERY = 2027-01-11
FIRST_DEBIT = 2027-02-01
NOTICE_DAYS = 14
```

**Stap A, aantal per levering:** stepper met min/plus (2 tot 12, standaard 3) en snelkeuzeknoppen 2, 3, 4, 6, 8, 12.
**Stap B, frequentie per maand:** radiokaarten "1x per maand" (1 keer ophalen), "2x per maand" (ongeveer elke 2 weken), "3x per maand" (3 keer ophalen), "4x per maand" (elke week). Standaard 2x.
**Stap C, smaken:** 8 kaarten (bordfoto, naam, korte ondertitel, label "Week van <datum>", favoriet-knop en link "Meer over deze smaak" naar het uitgebreide blok). Smaken worden NIET gekozen voor het abonnement: mensen pakken wat ze willen uit de vriezer en vinken af. De favoriet-knop (toggle, `aria-pressed`) verzamelt alleen voorkeuren, zodat we populaire smaken sneller aanvullen. Leg dit uit in de hint boven de kaarten, zoals in het prototype.
**Stap D, gegevens:** naam, e-mail, telefoon (verplicht), allergieën (optioneel, tekstvak), "Wat spreekt je aan in Goodness for All?" (optioneel, meer keuzes: Gemak en tijd besparen / Gezond eten / Anderen helpen / Anders, namelijk + tekstveld dat verschijnt bij aanvinken).
**Stap E, akkoord:** twee verplichte checkboxes: algemene voorwaarden (opent dialoog), en toestemming voor automatische incasso (tekst uit prototype).

**Berekening** (één pure functie in `lib/nlmtd/pricing.ts`, gebruikt door client en server, met unit tests):
```
maaltijdenPerMaand = m * f
maandbedrag        = m * f * PRICE_CENTS
normaalPerMaand    = m * f * NORMAL_PRICE_CENTS
besparing          = normaal - maandbedrag
eerstebetaling     = m * PRICE_CENTS          // alleen de eerste levering
```
Voorbeelden om te testen: m=3, f=2 geeft 6 maaltijden, € 36,00 per maand, € 18,00 nu. m=5, f=4 geeft 20 maaltijden, € 120,00 per maand, € 30,00 nu.

**Samenvattingskaart** (rechts, sticky op desktop, onder het formulier op mobiel): per levering, leveringen per maand, maaltijden per maand, normale prijs (doorgestreept), jouw prijs, besparing, een regel "Jouw abonnement betekent N maaltijden per maand voor iemand die nu geen toegang heeft tot gezond eten", dan "Nu betalen, eerste levering op 11 januari: € X", "Daarna, als het abonnement doorgaat: € Y per maand, vanaf 1 februari", de knop "Betaal met iDEAL" en de kleine letters over gegarandeerde eerste levering en doorgaan bij voldoende animo.

**Validatie** (client en server): naam min. 2 tekens, geldig e-mailadres, telefoon met min. 8 cijfers, beide checkboxes aan. Foutmeldingen staan onder het veld, zeggen wat er misgaat, en de focus gaat naar het eerste foute veld.

**Na de deadline:** is het later dan `SIGNUP_DEADLINE` (Europe/Amsterdam), toon dan in plaats van de samensteller een melding dat aanmelden gesloten is en mail naar info@goodnessforall.nl. Controleer dit ook server-side.

## 6. Betalen en administratie

### Fase 1 (nu bouwen): placeholder

- De knop "Betaal met iDEAL" valideert het formulier (zie sectie 5) en opent daarna een dialoog zoals in het prototype: een duidelijke placeholder voor Mollie, met het bedrag dat nu betaald wordt, de samenvatting van de bestelling en de bestelgegevens als JSON.
- Er wordt in fase 1 **niets opgeslagen of verstuurd**: geen Sheet-rij, geen mail, geen API-route, geen Mollie-pakket. Zo ontstaan er geen nepbestellingen.
- Houd de code zo opgezet dat fase 2 eenvoudig aansluit: bouw het bestelobject (`buildOrderPayload()` met alle velden uit het prototype) in een aparte functie, en laat de knop één functie `submitOrder(payload)` aanroepen die nu de placeholder toont.
- Voeg de aanmeldafsluiting (15 december) en alle validatie wel gewoon toe.

### Fase 2 (later, NIET nu bouwen)

De rest van deze sectie en sectie 7 beschrijven fase 2, zodat je er in fase 1 al rekening mee houdt. Het wordt gebouwd met de Mollie API (de officiële `@mollie/api-client`).

**Principe:** de klant betaalt de eerste levering via iDEAL. Die eerste betaling krijgt `sequenceType: "first"` en maakt daarmee een SEPA-incassomachtiging aan. Er worden nu GEEN Mollie-abonnementen aangemaakt, want of het abonnement doorgaat hangt af van genoeg animo.

**`POST /api/nlmtd/order`**
1. Valideer alle invoer met een schema (bijvoorbeeld zod). Reken bedragen **altijd opnieuw server-side uit**; vertrouw nooit bedragen uit de client.
2. Controleer deadline, en een lichte bescherming tegen misbruik (honeypotveld, simpele rate limit per IP).
3. Maak een `order_id` (bijvoorbeeld `NLMTD-<korte random id>`).
4. Maak een Mollie-klant aan (naam, e-mail).
5. Maak de eerste betaling: bedrag `m * 6,00` EUR, `method: "ideal"`, `sequenceType: "first"`, `customerId`, omschrijving "Goodness for All x NLMTD, eerste levering", `redirectUrl: /nlmtd/bedankt?order=<order_id>`, `webhookUrl: /api/nlmtd/mollie-webhook`, en `metadata: { orderId }`.
6. Schrijf een rij in de Google Sheet met status `nieuw` (zie kolommen hieronder).
7. Geef de `checkoutUrl` terug; de client stuurt de klant erheen. Voorkom dubbel klikken (knop disabled en "Een moment geduld...").

**`POST /api/nlmtd/mollie-webhook`**
1. Haal de betaling op via Mollie op basis van het id uit de webhook (vertrouw alleen wat Mollie teruggeeft).
2. Zoek de rij in de Sheet op `order_id` (uit metadata) en werk status, `mollie_payment_id` en `mollie_mandate_id` bij: `betaald`, `mislukt`, `geannuleerd` of `verlopen`.
3. Bij `paid`: stuur precies één bevestigingsmail via de bestaande Resend-setup (idempotent: niet opnieuw sturen als de status al `betaald` was).
4. Geef altijd 200 terug bij een geldige webhook.

**`/nlmtd/bedankt?order=...`**: toont de status. Is de webhook nog niet binnen, poll dan rustig (bijvoorbeeld elke 2 seconden, max. 30 seconden). Bij `betaald`: bevestiging met samenvatting en praktische info (ophalen vanaf maandag 11 januari bij NLMTD, werkdagen; vink je maaltijden af op de lijst; abonnement start op 1 februari als er genoeg animo is). Bij mislukt of geannuleerd: duidelijke uitleg en een knop om opnieuw te proberen.

**Google Sheet** (nieuw tabblad "NLMTD", gebruik de bestaande Sheets-helper en service-account-aanpak). Kolommen:
`aangemaakt, order_id, status, naam, email, telefoon, allergieen, spreekt_aan, favoriete_smaken, maaltijden_per_levering, leveringen_per_maand, maaltijden_per_maand, eerste_betaling_eur, maandbedrag_eur, mollie_customer_id, mollie_payment_id, mollie_mandate_id, abonnement_status, eerste_levering, eerste_incasso, opzegdatum`
`abonnement_status` start als `wacht op besluit`. Voorkom formule-injectie: cellen die beginnen met `=`, `+`, `-` of `@` krijgen een voorloop-apostrof.

**Bevestigingsmail** (Resend, zelfde afzender en stijl als bestaande transactionele mail): onderwerp "Je bestelling bij Goodness for All is binnen", met samenvatting (aantal per levering, frequentie, bedrag nu, bedrag per maand vanaf 1 februari), eerste levering 11 januari, hoe ophalen werkt, dat het abonnement doorgaat bij voldoende animo (anders blijft het bij de eerste levering zonder verplichtingen), opzeggen met 2 weken opzegtermijn via info@goodnessforall.nl, en dat een factuur op aanvraag beschikbaar is.

**Omgevingsvariabelen** (documenteer in `.env.example`, ik zet ze zelf in Vercel): `MOLLIE_API_KEY`, `NLMTD_SHEET_ID`, plus de bestaande Google- en Resend-variabelen. Werk lokaal en op preview met een Mollie **test**-key.

## 7. Aanvullend script (fase 2, nu NIET bouwen)

Maak `scripts/nlmtd-start-subscriptions.mjs`: leest de rijen met status `betaald` en `abonnement_status = "doorgaan"` uit de Sheet en maakt per rij een Mollie-abonnement aan (`interval: "1 month"`, startdatum 2027-02-01, bedrag `m * f * 6,00`, `mandateId` uit de Sheet). Standaard een dry-run die alleen toont wat het zou doen; pas met `--execute` echt uitvoeren. Zo kan ik de abonnementen pas starten als de animo bekend is.

## 8. Afronding en controle

- Draai typecheck, lint en een productiebuild zonder fouten. Voeg unit tests toe voor `pricing.ts` en de validatie.
- Fase 1: test op een Vercel-preview dat formulier, berekening, validatie, dialogen en de placeholder-betaaldialoog werken. (De Mollie-flow met webhook, Sheet en mail testen we pas in fase 2.)
- Maak screenshots op 390 px en 1280 px breed en vergelijk ze met het prototype op structuur en inhoud (niet op styling). Controleer dat alle 8 foto's de juiste maaltijd tonen.
- Controleer: geen em dashes, `noindex` aanwezig, pagina niet in sitemap, deadline-gedrag werkt, bedragen kloppen met de voorbeelden hierboven.
- Geef aan het eind een lijst met wat ik zelf nog moet doen (onder andere juridische controle van de algemene voorwaarden en het invullen van de gemarkeerde open punten) en open punten of aannames die je hebt gemaakt. LAZY heeft akkoord gegeven voor het gebruik van de foto's.
