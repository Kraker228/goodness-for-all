import { logOrderSubmission, parseOrderSubmission } from "@/lib/order-log";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Ongeldige JSON ontvangen." }, { status: 400 });
  }

  try {
    const order = parseOrderSubmission(payload);
    const result = await logOrderSubmission(order);

    return Response.json({ ok: true, location: result.location, row: result.row });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Bestelling kon niet worden gelogd.";
    const status =
      message.startsWith("ORDER_LOG_") ||
      message.startsWith("GitHub") ||
      message.startsWith("Google") ||
      message.includes("logbestand")
        ? 500
        : message.includes("ontbreekt") || message.includes("ongeldig")
          ? 400
          : 500;

    return Response.json({ error: message }, { status });
  }
}
