# Bestellingen buurthuizen koppelen aan Google Sheets

Deze map bevat het Google Apps Script (`Code.gs`) dat bestellingen van het
buurthuizen-formulier op de website in een Google Sheet zet. Je hoeft niet te
kunnen programmeren, volg gewoon de stappen hieronder.

## Hoe het werkt (kort)

Iemand vult op de website het bestelformulier in. De website stuurt die
bestelling naar een kleine Web App (dit script) die in jouw Google Sheet draait.
Het script zet elke bestelling als nieuwe regel onderaan de sheet.

## Stap voor stap

1. **Log in bij Google** met het account `info@goodnessforall.nl`.

2. **Maak een nieuwe Google Sheet** aan, bijvoorbeeld met de naam
   "Bestellingen buurthuizen". Je hoeft zelf geen kolomkoppen te typen, die
   worden bij de eerste bestelling automatisch aangemaakt.

3. **Open de scripteditor.** Klik in de sheet bovenin op **Extensies** en dan op
   **Apps Script**. Er opent een nieuw tabblad.

4. **Plak het script.** Verwijder in de scripteditor alles wat er staat, open het
   bestand `Code.gs` uit deze map, kopieer de volledige inhoud en plak die in de
   editor. Klik daarna op het opslaan-icoon (de diskette) of druk op Ctrl+S.

5. **Deploy als Web App.**
   - Klik rechtsboven op **Implementeren** en dan op **Nieuwe implementatie**.
   - Kies bij het type (het tandwieltje) voor **Web-app**.
   - Zet **Uitvoeren als** op **Ikzelf** (`info@goodnessforall.nl`).
   - Zet **Wie heeft toegang** op **Iedereen**. Dit is nodig zodat de website de
     bestelling kan doorsturen.
   - Klik op **Implementeren**. De eerste keer vraagt Google om toestemming, klik
     die door (je moet mogelijk op "Geavanceerd" en dan op "Ga naar ... (onveilig)"
     klikken, dat hoort erbij voor je eigen script).

6. **Kopieer de Web App URL.** Na het implementeren toont Google een URL die
   eindigt op `/exec`. Kopieer die volledige URL.

7. **Zet de URL in Vercel.** Ga naar het project in Vercel, naar
   **Settings, Environment Variables**, en voeg toe:
   - Naam: `GOOGLE_SHEETS_WEBHOOK_URL`
   - Waarde: de gekopieerde Web App URL
   - Selecteer alle omgevingen (Production, Preview, Development).

   Klik op opslaan en start de site opnieuw op (redeploy) zodat de waarde actief
   wordt.

Klaar. Vul op de website een testbestelling in en controleer of er een nieuwe
regel in de sheet verschijnt.

## Optioneel: een gedeeld geheim instellen

Wil je extra zeker weten dat alleen jouw website naar de sheet kan schrijven,
dan kun je een geheim woord instellen. Dat is optioneel.

1. In de scripteditor: klik links op het tandwiel (**Projectinstellingen**),
   scroll naar **Scripteigenschappen** en voeg een eigenschap toe met naam
   `WEBHOOK_SECRET` en als waarde een lang, willekeurig woord.
2. Zet in Vercel eenzelfde variabele `GOOGLE_SHEETS_WEBHOOK_SECRET` met exact
   dezelfde waarde, ook voor alle omgevingen.

Staat er geen `WEBHOOK_SECRET` in het script, dan wordt er geen geheim gevraagd.

## Welke kolommen komen er in de sheet

De website bepaalt de volgorde van de kolommen. Deze worden bij de eerste
bestelling automatisch als kopregel neergezet:

| Kolom | Betekenis |
| --- | --- |
| `ingediend_op` | Tijdstip van de bestelling (tijdzone Europe/Amsterdam) |
| `vraag_1_organisatie` | Gekozen organisatie of locatie |
| `vraag_2_aantal_doosjes` | Aantal bestelde doosjes |
| `vraag_2_totaal_maaltijden` | Totaal aantal maaltijden |
| `vraag_3_4_bevestiging_type` | `levering` of `ophaal` |
| `vraag_3_4_bevestiging_antwoord` | `ja` of `nee` |
| `vraag_5_keuze_type` | `zelf` (zelf smaken kiezen) of `mix` |
| `vraag_6_smaken` | Gekozen smaken, komma-gescheiden in een cel |
| `vraag_7_opmerkingen` | Opmerking of vraag |
| `vraag_8_voornaam` | Voornaam contactpersoon |
| `vraag_8_achternaam` | Achternaam contactpersoon |
| `vraag_8_telefoon` | Telefoonnummer contactpersoon |
| `bron` | Waar de bestelling vandaan kwam (`voor-buurthuizen`) |
