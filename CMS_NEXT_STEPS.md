# CMS afronding en resterende acties

## Afgerond in code

- Sveltia CMS staat op `/admin` en gebruikt `public/admin/config.yml`.
- Sveltia CMS gebruikt nu een eigen GitHub OAuth-client via Vercel/Next routes onder `/api/cms`, zodat de login niet meer via Netlify loopt.
- Content staat centraal in `content/site.json`.
- Algemene settings, SEO defaults, navigatie, footer, logo, contactknop en CMS-titel zijn bewerkbaar.
- Homepage, partners, impact, contact, werken-bij, buurthuizen, ANBI en ons-verhaal lezen hun zichtbare tekst/beelden grotendeels uit CMS-data.
- Partnerlogo's zijn uploadbare CMS-afbeeldingen met alt-tekst.
- Partner pricing CTA's hebben bewerkbare labels en URLs.
- ANBI download/contactknoppen hebben bewerkbare labels en URLs.
- De scrollende solidariteitsvisual op `/ons-verhaal` is nu CMS-gestuurd.
- De oude hardcoded fallback-navigatie en statische `public/admin/index.html` zijn verwijderd.

## Laatste validatie in deze sessie

Nog opnieuw uitvoeren na de laatste opruimcommit:

```bash
node -e "JSON.parse(require('fs').readFileSync('content/site.json','utf8'))"
node -e "const fs=require('fs'); const yaml=require('js-yaml'); yaml.load(fs.readFileSync('public/admin/config.yml','utf8'))"
npm run lint
npm run build
```

## Externe acties die nog nodig zijn

1. Maak of controleer de GitHub OAuth App voor de CMS-login.
   - GitHub callback URL: `https://goodness-mu.vercel.app/api/cms/callback`.
   - Zet in Vercel environment variables: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` en `CMS_ALLOWED_DOMAINS=goodness-mu.vercel.app`.
   - Deploy daarna opnieuw naar productie.
   - Test met `npm run cms:auth:check` dat "Sign in with GitHub" naar `github.com/login/oauth/authorize` gaat en niet naar `api.netlify.com`.

2. Geef de Vercel GitHub App toegang tot de repo `sirprikkel/goodness-for-all`.
   - GitHub: Settings -> Applications -> Installed GitHub Apps -> Vercel -> Configure.
   - Voeg `sirprikkel/goodness-for-all` toe.
   - Let op: als GitHub al "All repositories" toont maar `vercel git connect --scope pimmetjes-projects` blijft falen, zit de mismatch waarschijnlijk in de Vercel-account/team-installatie. Controleer in Vercel project settings -> Git of de GitHub account/organisatie `sirprikkel` daar gekoppeld is, of login in Vercel CLI met de Vercel account die dezelfde GitHub App-installatie beheert.
   - Daarna opnieuw:

```bash
vercel git connect --scope pimmetjes-projects
```

3. Test Sveltia met het echte klantaccount.
   - Klant moet schrijfrechten op de GitHub-repo hebben.
   - Login op `https://goodness-mu.vercel.app/admin`.
   - Pas een veilige testwaarde aan, bijvoorbeeld partnerstrip titel of een test-alt-tekst.
   - Publiceer en controleer of er een commit op `master` ontstaat.
   - Na Vercel GitHub-koppeling: controleer of die commit automatisch een Vercel deployment triggert.

4. Formulieren zijn nog stubbed.
   - Contactformulier, partnerformulier en buurthuizen-bestelflow tonen feedback, maar sturen nog niet naar e-mail/CRM/Sheets.
   - Kies later een backend of formulierdienst en maak de endpoints ook configureerbaar waar nodig.

## Handmatige deploy zolang GitHub-koppeling ontbreekt

Tot automatische Vercel deploys werken:

```bash
vercel deploy --prod --yes --scope pimmetjes-projects
```
