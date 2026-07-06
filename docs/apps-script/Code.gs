/**
 * Goodness for All, buurthuizen bestelformulier.
 *
 * Deze Web App ontvangt een bestelling van de website (via de Next.js route
 * /api/orders) en zet die als nieuwe rij in de eerste sheet van dit
 * spreadsheet. Deploy dit als Web App (zie README.md in deze map).
 *
 * Er staat NIETS hardcoded in dit bestand: het spreadsheet is het spreadsheet
 * waar je dit script in opent (Extensies, Apps Script), en het geheim staat in
 * de Script Properties, niet in de code.
 */

function doPost(e) {
  try {
    var payload = JSON.parse((e && e.postData && e.postData.contents) || "{}");

    // Optioneel gedeeld geheim. Staat er een WEBHOOK_SECRET in de Script
    // Properties, dan moet de inzending dat geheim meesturen. Staat er niets,
    // dan is er geen extra controle.
    var expectedSecret = PropertiesService.getScriptProperties().getProperty("WEBHOOK_SECRET");
    if (expectedSecret && payload.secret !== expectedSecret) {
      return jsonResponse({ ok: false, error: "Unauthorized" });
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    var headers = Array.isArray(payload.headers) ? payload.headers : [];
    var values = Array.isArray(payload.values) ? payload.values : [];

    if (values.length === 0) {
      return jsonResponse({ ok: false, error: "Geen waarden ontvangen" });
    }

    // Eerste rij nog leeg? Zet dan eenmalig de kopregels neer.
    if (sheet.getLastRow() === 0 && headers.length) {
      sheet.appendRow(headers);
    }

    sheet.appendRow(values);

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error) });
  }
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
