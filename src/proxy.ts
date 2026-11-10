import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * De NLMTD-pagina staat op /NLMTD (hoofdletters). Redirects in next.config
 * matchen hoofdletterongevoelig en zouden dus eindeloos doorverwijzen; daarom
 * hier: elke andere schrijfwijze (/nlmtd, /Nlmtd, ...) gaat naar /NLMTD.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname !== "/NLMTD" && pathname.toLowerCase().replace(/\/$/, "") === "/nlmtd") {
    const url = request.nextUrl.clone();
    url.pathname = "/NLMTD";
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/nlmtd", "/nlmtd/"],
};
