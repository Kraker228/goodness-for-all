# Goodness for All CMS

De CMS staat op `/admin` van de actieve Vercel deployment.

- Lokale dev server: `http://localhost:3000/admin` wanneer `npm run dev` draait
- Productie: gebruik het domein dat `vercel deploy --prod` teruggeeft

De content staat in `content/site.json`. Sveltia CMS schrijft wijzigingen als commits naar:

- Repository: `Kraker228/goodness-for-all`
- Branch: `master`
- OAuth: via de eigen Vercel/Next routes `/api/cms/auth` en `/api/cms/callback`, niet via Netlify

Afbeeldingen die via de CMS worden geupload komen in `public/images/uploads` en zijn op de site bereikbaar als `/images/uploads/...`.

## GitHub login zonder Netlify

Sveltia CMS heeft voor de knop "Sign in with GitHub" een OAuth-client nodig. De CMS-config gebruikt een relatieve OAuth-URL (`/api/cms`), zodat dezelfde configuratie op elk Vercel-domein werkt.

Maak na de eerste productie-deploy in GitHub een OAuth App aan met het productie-domein:

- Homepage URL: `https://<jouw-vercel-domein>`
- Authorization callback URL: `https://<jouw-vercel-domein>/api/cms/callback`

Zet daarna in Vercel bij het nieuwe project de Environment Variables:

- `GITHUB_CLIENT_ID`: Client ID van de GitHub OAuth App
- `GITHUB_CLIENT_SECRET`: Client Secret van de GitHub OAuth App
- `CMS_ALLOWED_DOMAINS`: `<jouw-vercel-domein>` zonder `https://`

Na aanpassen van environment variables moet Vercel opnieuw deployen. De login-URL mag daarna niet naar `api.netlify.com` verwijzen.

Controleer na de redeploy:

```bash
npm run cms:auth:check -- https://<jouw-vercel-domein>
```

Een goede configuratie geeft een `github.com/login/oauth/authorize` URL terug. Als de command meldt dat `GITHUB_CLIENT_ID` of `GITHUB_CLIENT_SECRET` mist, staan de Vercel secrets nog niet goed.

## Toegang voor klant

Geef de klant een GitHub-account met schrijfrechten op `Kraker228/goodness-for-all`. Daarna kan de klant via `/admin` inloggen en wijzigingen publiceren. Elke publicatie maakt een commit naar `master`; Vercel bouwt daarna opnieuw als de GitHub-koppeling actief is.

## Buurthuisbestellingen in Google Sheets

Het formulier op `/voor-buurthuizen` schrijft bestellingen naar Google Sheets via een Apps Script webhook wanneer deze Vercel environment variables zijn ingesteld:

- `GOOGLE_SHEETS_WEBHOOK_URL`
- `GOOGLE_SHEETS_WEBHOOK_SECRET`

De oudere directe Google Sheets API route kan ook, maar vereist een service-account key:

- `GOOGLE_SHEETS_SPREADSHEET_ID`
- `GOOGLE_SHEETS_SHEET_NAME`
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`

De spreadsheet moet gedeeld zijn met `GOOGLE_SERVICE_ACCOUNT_EMAIL` als editor. Het tabblad wordt automatisch aangemaakt als het ontbreekt. Als de header rij leeg is, schrijft de API automatisch de kolomnamen.

De klant hoeft voor bestellingen dus alleen toegang te krijgen tot deze Google Sheet. De CMS-login is alleen voor websitecontent.

## Nieuw Vercel-project aanmaken

Gebruik de terminal waarin `vercel whoami` jouw eigen Vercel-account toont:

```bash
cd C:\Users\pimme\Agents\goodness-for-all
Remove-Item -Recurse -Force .vercel
vercel link
vercel deploy --prod
```

Kies bij `vercel link` je eigen account/team en maak een nieuw project aan voor deze repo.

## Vercel GitHub-koppeling

Voor automatische deployments moet de Vercel GitHub App toegang hebben tot `Kraker228/goodness-for-all`.

- GitHub: Settings -> Applications -> Installed GitHub Apps -> Vercel -> Configure
- Voeg `Kraker228/goodness-for-all` toe of kies "All repositories"
- Koppel daarna in Vercel project settings -> Git de repository

Tot die koppeling werkt, kun je productie handmatig deployen met:

```bash
vercel deploy --prod
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
