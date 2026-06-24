const PROVIDER = "github";
const CSRF_COOKIE = "cms-github-csrf";

type AuthResult =
  | { token: string; error?: never }
  | { token?: never; error: string; errorCode: string };

function htmlResponse(result: AuthResult): Response {
  const state = result.error ? "error" : "success";
  const content = result.error
    ? { provider: PROVIDER, error: result.error, errorCode: result.errorCode }
    : { provider: PROVIDER, token: result.token };
  const message = `authorization:${PROVIDER}:${state}:${JSON.stringify(content)}`;
  const title = result.error ? "CMS login niet voltooid" : "CMS login voltooid";
  const text = result.error
    ? result.error
    : "Je bent ingelogd. Dit venster kan automatisch sluiten.";

  return new Response(
    `<!doctype html><html lang="nl"><head><meta charset="utf-8"><title>${title}</title></head><body>
<p>${text}</p>
<script>
(() => {
  window.addEventListener("message", ({ data, origin }) => {
    if (data === "authorizing:${PROVIDER}") {
      window.opener?.postMessage(
        ${JSON.stringify(message)},
        origin
      );
    }
  });
  window.opener?.postMessage("authorizing:${PROVIDER}", "*");
})();
</script></body></html>`,
    {
      headers: {
        "Content-Type": "text/html;charset=UTF-8",
        "Set-Cookie": `${CSRF_COOKIE}=deleted; HttpOnly; Max-Age=0; Path=/; SameSite=Lax; Secure`,
      },
    },
  );
}

function getEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isAllowedDomain(domain: string | null): boolean {
  const allowedDomains = getEnv("CMS_ALLOWED_DOMAINS");

  if (!allowedDomains) return true;

  return allowedDomains.split(",").some((entry) => {
    const pattern = escapeRegExp(entry.trim()).replace("\\*", ".+");
    return Boolean(domain?.match(new RegExp(`^${pattern}$`)));
  });
}

function csrfCookie(token: string, secure: boolean): string {
  return [
    `${CSRF_COOKIE}=${PROVIDER}_${token}`,
    "HttpOnly",
    "Path=/",
    "Max-Age=600",
    "SameSite=Lax",
    secure ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
}

export function startGitHubAuth(request: Request): Response {
  const url = new URL(request.url);
  const provider = url.searchParams.get("provider");
  const domain = url.searchParams.get("site_id");
  const clientId = getEnv("GITHUB_CLIENT_ID");
  const clientSecret = getEnv("GITHUB_CLIENT_SECRET");
  const hostname = getEnv("GITHUB_HOSTNAME") ?? "github.com";

  if (provider !== PROVIDER) {
    return htmlResponse({
      error: "Deze CMS backend wordt niet ondersteund.",
      errorCode: "UNSUPPORTED_BACKEND",
    });
  }

  if (!isAllowedDomain(domain)) {
    return htmlResponse({
      error: "Dit domein mag deze CMS-login niet gebruiken.",
      errorCode: "UNSUPPORTED_DOMAIN",
    });
  }

  if (!clientId || !clientSecret) {
    return htmlResponse({
      error: "GitHub OAuth is nog niet geconfigureerd.",
      errorCode: "MISCONFIGURED_CLIENT",
    });
  }

  const token = crypto.randomUUID().replaceAll("-", "");
  const params = new URLSearchParams({
    client_id: clientId,
    scope: "repo,user",
    state: token,
  });

  return new Response("", {
    status: 302,
    headers: {
      Location: `https://${hostname}/login/oauth/authorize?${params.toString()}`,
      "Set-Cookie": csrfCookie(token, url.protocol === "https:"),
    },
  });
}

export async function finishGitHubAuth(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookie = request.headers.get("Cookie");
  const [, provider, csrfToken] =
    cookie?.match(new RegExp(`\\b${CSRF_COOKIE}=([a-z-]+?)_([0-9a-f]{32})\\b`)) ?? [];

  if (!code && !state && !cookie) {
    return htmlResponse({
      error: "Dit is de technische GitHub callback voor de CMS-login. Gebruik /admin om in te loggen.",
      errorCode: "CALLBACK_DIRECT_OPEN",
    });
  }

  if (provider !== PROVIDER) {
    return htmlResponse({
      error: "Deze CMS backend wordt niet ondersteund.",
      errorCode: "UNSUPPORTED_BACKEND",
    });
  }

  if (!code || !state) {
    return htmlResponse({
      error: "GitHub gaf geen geldige autorisatiecode terug.",
      errorCode: "AUTH_CODE_REQUEST_FAILED",
    });
  }

  if (!csrfToken || state !== csrfToken) {
    return htmlResponse({
      error: "CMS-login is afgebroken door een ongeldige beveiligingscode.",
      errorCode: "CSRF_DETECTED",
    });
  }

  const clientId = getEnv("GITHUB_CLIENT_ID");
  const clientSecret = getEnv("GITHUB_CLIENT_SECRET");
  const hostname = getEnv("GITHUB_HOSTNAME") ?? "github.com";

  if (!clientId || !clientSecret) {
    return htmlResponse({
      error: "GitHub OAuth is nog niet geconfigureerd.",
      errorCode: "MISCONFIGURED_CLIENT",
    });
  }

  let response: Response;

  try {
    response = await fetch(`https://${hostname}/login/oauth/access_token`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });
  } catch {
    return htmlResponse({
      error: "GitHub token-aanvraag is mislukt.",
      errorCode: "TOKEN_REQUEST_FAILED",
    });
  }

  let payload: { access_token?: string; error?: string };

  try {
    payload = (await response.json()) as typeof payload;
  } catch {
    return htmlResponse({
      error: "GitHub gaf een ongeldig antwoord terug.",
      errorCode: "MALFORMED_RESPONSE",
    });
  }

  if (!payload.access_token) {
    return htmlResponse({
      error: payload.error ?? "GitHub gaf geen access token terug.",
      errorCode: "TOKEN_REQUEST_FAILED",
    });
  }

  return htmlResponse({ token: payload.access_token });
}
