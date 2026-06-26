# Goodness for All CMS

De CMS staat op:

- Productie: https://goodness-mu.vercel.app/admin
- Lokale dev server: http://localhost:3002/admin wanneer `next dev` daar draait

De content staat in `content/site.json`. Sveltia CMS schrijft wijzigingen als commits naar:

- Repository: `sirprikkel/goodness-for-all`
- Branch: `master`
- OAuth: via de eigen Vercel/Next routes `/api/cms/auth` en `/api/cms/callback`, niet via Netlify

Afbeeldingen die via de CMS worden geupload komen in `public/images/uploads` en zijn op de site bereikbaar als `/images/uploads/...`.

## GitHub login zonder Netlify

Sveltia CMS heeft voor de knop "Sign in with GitHub" een OAuth-client nodig. Deze site gebruikt daarvoor de eigen Vercel deployment:

- CMS config: `public/admin/config.yml`
- OAuth start: `https://goodness-mu.vercel.app/api/cms/auth`
- OAuth callback: `https://goodness-mu.vercel.app/api/cms/callback`

Maak in GitHub een OAuth App aan met:

- Homepage URL: `https://goodness-mu.vercel.app`
- Authorization callback URL: `https://goodness-mu.vercel.app/api/cms/callback`

Zet daarna in Vercel bij het project de Environment Variables:

- `GITHUB_CLIENT_ID`: Client ID van de GitHub OAuth App
- `GITHUB_CLIENT_SECRET`: Client Secret van de GitHub OAuth App
- `CMS_ALLOWED_DOMAINS`: `goodness-mu.vercel.app`

Na aanpassen van environment variables moet Vercel opnieuw deployen. De login-URL mag daarna niet meer naar `api.netlify.com` verwijzen.

Controleer na de redeploy:

```bash
npm run cms:auth:check
```

Een goede configuratie geeft een `github.com/login/oauth/authorize` URL terug. Als de command meldt dat `GITHUB_CLIENT_ID` of `GITHUB_CLIENT_SECRET` mist, staan de Vercel secrets nog niet goed.

## Toegang voor klant

Geef de klant een GitHub-account met schrijfrechten op `sirprikkel/goodness-for-all`. Daarna kan de klant via `/admin` inloggen en wijzigingen publiceren. Elke publicatie maakt een commit naar `master`; Vercel bouwt daarna opnieuw.

## Vercel GitHub-koppeling

De site is als Vercel-project gekoppeld aan `pimmetjes-projects/goodness`, maar als `vercel git connect --scope pimmetjes-projects` meldt dat de repo niet gekoppeld kan worden, mist de Vercel GitHub App toegang tot de repository. Los dit op in GitHub/Vercel door de Vercel GitHub App toegang te geven tot `sirprikkel/goodness-for-all` voor de account/organisatie die bij `pimmetjes-projects` hoort. Tot die koppeling werkt, kun je productie nog steeds handmatig deployen met:

```bash
vercel deploy --prod --scope pimmetjes-projects
```

## Wat is bewerkbaar

Via `content/site.json` zijn onder andere bewerkbaar:

- algemene instellingen, logo, navigatie en footer
- homepage hero, kaarten, teller, quote en partnerstrip
- partnerpagina hero, pakketten, vrieskastblok, uploadbare logo's en formuliercopy
- impact teller, locaties, quote, galerij en onderzoeksblok
- contactpagina, nieuwsbriefblok en contactformulier
- werken-bij pagina, vacatures, cultuurblokken en quote
- buurthuizenpagina en volledige bestelflow-copy
- ANBI-kaarten, CTA en download/contactlinks
- ons-verhaal teksten, beelden, carousel en teamleden
