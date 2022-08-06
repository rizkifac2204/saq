import { NextResponse } from "next/server";

export default function middleware(req, res) {
  const { origin } = req.nextUrl;
  const saqBawaslu = req.cookies.get("saqBawaslu");

  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!saqBawaslu) return NextResponse.redirect(`${origin}/`);
  }
  if (req.nextUrl.pathname === "/") {
    if (saqBawaslu) return NextResponse.redirect(`${origin}/admin`);
  }

  // prepare untuk settimg whatsapp disini
}

export const config = {
  matcher: ["/", "/admin/:path*"],
};
