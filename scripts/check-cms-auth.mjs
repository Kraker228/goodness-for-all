const siteUrl = process.argv[2] ?? process.env.CMS_SITE_URL ?? "http://localhost:3000";
const url = new URL("/api/cms/auth", siteUrl);

url.searchParams.set("provider", "github");
url.searchParams.set("site_id", new URL(siteUrl).hostname);

const response = await fetch(url, { redirect: "manual" });
const location = response.headers.get("location");
const body = await response.text();

if (response.status === 302 && location?.startsWith("https://github.com/login/oauth/authorize")) {
  console.log(`CMS GitHub auth is configured: ${location}`);
} else if (body.includes("MISCONFIGURED_CLIENT")) {
  console.error("CMS GitHub auth reaches Vercel, but GITHUB_CLIENT_ID/GITHUB_CLIENT_SECRET are missing.");
  process.exitCode = 1;
} else if (location?.includes("api.netlify.com") || body.includes("api.netlify.com")) {
  console.error("CMS GitHub auth still points to Netlify.");
  process.exitCode = 1;
} else {
  console.error(`Unexpected CMS auth response: HTTP ${response.status}`);
  if (location) console.error(`Location: ${location}`);
  process.exitCode = 1;
}
