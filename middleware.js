import { NextResponse } from "next/server";

export default async function middleware(request) {
  const { origin } = request.nextUrl;
  const saqBawaslu = request.cookies.get("saqBawaslu");

  // jika ada akses langusng redirect to admin
  if (request.nextUrl.pathname === "/") {
    if (saqBawaslu)
      return NextResponse.redirect(new URL("/admin", request.url));
  }

  // pengaturan admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    try {
      // jika tidak ada akses langusng redirect to login
      if (!saqBawaslu) return NextResponse.redirect(new URL("/", request.url));
      // // get data
      const data = await fetch(`${origin}/api/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: saqBawaslu }),
      });
      const access = await data.json();
      if (!data.ok) return NextResponse.redirect(new URL("/", request.url));
      // blokir akses kuseioner (super admin /  admin)
      if (request.nextUrl.pathname === "/admin/kuesioner") {
        if (access.level < 3)
          return NextResponse.redirect(new URL("/admin", request.url));
      }
      // blokir akses data pertanyaan (user provinsi tanpa pengelola / user kabupaten/kota)
      if (request.nextUrl.pathname === "/admin/quest") {
        // jika user kabupate/kota langsung redirect
        if (access.level === 4)
          return NextResponse.redirect(new URL("/admin", request.url));
        // jika user provinsi tanpa akses lagsung redirect
        if (access.level === 3 && access.pengelola === null)
          return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    } catch (err) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// export const config = {
//   matcher: ["/", "/admin/:path*"],
// };
