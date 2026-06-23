# Goodness for All CMS

De CMS staat op:

- Productie: https://goodness-mu.vercel.app/admin
- Lokale dev server: http://localhost:3002/admin wanneer `next dev` daar draait

De content staat in `content/site.json`. Sveltia CMS schrijft wijzigingen als commits naar:

- Repository: `Pimmetjeoss/goodness-for-all`
- Branch: `master`

Afbeeldingen die via de CMS worden geupload komen in `public/images/uploads` en zijn op de site bereikbaar als `/images/uploads/...`.

## Toegang voor klant

Geef de klant een GitHub-account met schrijfrechten op `Pimmetjeoss/goodness-for-all`. Daarna kan de klant via `/admin` inloggen en wijzigingen publiceren. Elke publicatie maakt een commit naar `master`; Vercel bouwt daarna opnieuw.

## Wat is bewerkbaar

Via `content/site.json` zijn onder andere bewerkbaar:

- algemene instellingen, logo, navigatie en footer
- homepage hero, kaarten, teller, quote en partnerstrip
- partnerpagina hero, pakketten, vrieskastblok, logo's en formuliercopy
- impact teller, locaties, quote, galerij en onderzoeksblok
- contactpagina, nieuwsbriefblok en contactformulier
- werken-bij pagina, vacatures, cultuurblokken en quote
- buurthuizenpagina en volledige bestelflow-copy
- ANBI-kaarten en CTA
- ons-verhaal teksten, beelden, carousel en teamleden
