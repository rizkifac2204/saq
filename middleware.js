import { NextResponse } from "next/server";

export default async function middleware(req, event) {
  const { origin } = req.nextUrl;
  const saqBawaslu = req.cookies.get("saqBawaslu");

  // jika ada akses langusng redirect to admin
  if (req.nextUrl.pathname === "/") {
    if (saqBawaslu) return NextResponse.redirect(`${origin}/admin`);
  }

  // pengaturan admin
  if (req.nextUrl.pathname.startsWith("/admin")) {
    try {
      // jika tidak ada akses langusng redirect to login
      if (!saqBawaslu) return NextResponse.redirect(`${origin}/`);

      // get data
      const data = await fetch(`${origin}/api/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: saqBawaslu }),
      });
      const access = await data.json();
      if (!data.ok) return NextResponse.redirect(`${origin}/`);

      // blokir akses kuseioner (super admin /  admin)
      if (req.nextUrl.pathname === "/admin/kuesioner") {
        if (access.level < 3) return NextResponse.redirect(`${origin}/admin`);
      }

      // blokir akses data pertanyaan (user provinsi tanpa pengelola / user kabupaten/kota)
      if (req.nextUrl.pathname === "/admin/quest") {
        // jika user kabupate/kota langsung redirect
        if (access.level === 4) return NextResponse.redirect(`${origin}/admin`);
        // jika user provinsi tanpa akses lagsung redirect
        if (access.level === 3 && access.pengelola === null)
          return NextResponse.redirect(`${origin}/admin`);
      }
    } catch (err) {
      if (saqBawaslu) return NextResponse.redirect(`${origin}/`);
    }
  }
}

export const config = {
  matcher: ["/", "/admin/:path*"],
};
