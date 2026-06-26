# CMS afronding en resterende acties

## Afgerond in code

- Sveltia CMS staat op `/admin` en gebruikt `public/admin/config.yml`.
- De CMS gebruikt een eigen GitHub OAuth-client via Vercel/Next routes onder `/api/cms`, zodat de login niet via Netlify loopt.
- De CMS OAuth `base_url` is relatief (`/api/cms`), zodat het nieuwe Vercel-domein geen codewijziging nodig heeft.
- Content staat centraal in `content/site.json`.
- Algemene settings, SEO defaults, navigatie, footer, logo, contactknop en CMS-titel zijn bewerkbaar.
- Homepage, partners, impact, contact, werken-bij, buurthuizen, ANBI en ons-verhaal lezen hun zichtbare tekst/beelden grotendeels uit CMS-data.
- Partnerlogo's zijn uploadbare CMS-afbeeldingen met alt-tekst.
- Partner pricing CTA's hebben bewerkbare labels en URLs.
- ANBI download/contactknoppen hebben bewerkbare labels en URLs.
- De scrollende solidariteitsvisual op `/ons-verhaal` is CMS-gestuurd.

## Laatste validatie

Voer lokaal uit:

```bash
node -e "JSON.parse(require('fs').readFileSync('content/site.json','utf8'))"
node -e "const fs=require('fs'); const yaml=require('js-yaml'); yaml.load(fs.readFileSync('public/admin/config.yml','utf8'))"
npm run cms:check
npm run lint
npm run build
```

## Externe acties die nog nodig zijn

1. Maak een nieuw Vercel-project onder het Sirprikkel-account.

```bash
cd C:\Users\pimme\Agents\goodness-for-all
Remove-Item -Recurse -Force .vercel
vercel link
vercel deploy --prod
```

2. Maak daarna de GitHub OAuth App voor de CMS-login.

- Homepage URL: `https://<jouw-vercel-domein>`
- Authorization callback URL: `https://<jouw-vercel-domein>/api/cms/callback`
- Zet in Vercel environment variables: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` en `CMS_ALLOWED_DOMAINS=<jouw-vercel-domein>`
- Deploy daarna opnieuw naar productie
- Test met `npm run cms:auth:check -- https://<jouw-vercel-domein>`

3. Geef de Vercel GitHub App toegang tot `sirprikkel/goodness-for-all`.

- GitHub: Settings -> Applications -> Installed GitHub Apps -> Vercel -> Configure
- Voeg `sirprikkel/goodness-for-all` toe
- Koppel in Vercel project settings -> Git de repo voor automatische deploys

4. Test Sveltia met het echte klantaccount.

- Klant moet schrijfrechten op de GitHub-repo hebben
- Login op `https://<jouw-vercel-domein>/admin`
- Pas een veilige testwaarde aan, bijvoorbeeld partnerstrip titel of een test-alt-tekst
- Publiceer en controleer of er een commit op `master` ontstaat
- Controleer of die commit automatisch een Vercel deployment triggert

## Formulieren

Het contactformulier en partnerformulier posten naar `/api/contact` en sturen via Resend naar `info@goodnessforall.nl`. Zet in Vercel:

- `CONTACT_TO=info@goodnessforall.nl`
- `RESEND_API_KEY`
- `RESEND_FROM`

`RESEND_FROM` moet een afzender zijn op een domein dat in Resend geverifieerd is.

Het buurthuizen-bestelformulier post naar `/api/orders`. In productie schrijft dit bij voorkeur naar Google Sheets via een Apps Script webhook zodra deze Vercel environment variables zijn ingesteld:

- `GOOGLE_SHEETS_WEBHOOK_URL`
- `GOOGLE_SHEETS_WEBHOOK_SECRET`

Als alternatief ondersteunt de code directe Google Sheets API toegang via service-account key:

- `GOOGLE_SHEETS_SPREADSHEET_ID`
- `GOOGLE_SHEETS_SHEET_NAME`
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`

Bij de service-account route moet de spreadsheet gedeeld zijn met `GOOGLE_SERVICE_ACCOUNT_EMAIL` als editor. Het tabblad wordt automatisch aangemaakt als het ontbreekt. Als Google Sheets niet is ingesteld, gebruikt de code de bestaande GitHub CSV fallback.

Zie `.env.example` voor de benodigde variabelen.
