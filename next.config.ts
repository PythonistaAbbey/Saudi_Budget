import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
  // Robots: this is a concept demo and must not be indexed as if it were an official site.
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
];

// STATIC_EXPORT=1 builds a plain HTML/JS site in out/ that any static host can serve (no Node server).
// Static hosts can't send headers or redirects, so those are omitted; public/index.html handles "/".
const isExport = process.env.STATIC_EXPORT === "1";

const config: NextConfig = {
  reactStrictMode: true,
  ...(isExport ? { output: "export" as const, trailingSlash: true, images: { unoptimized: true } } : {}),
  poweredByHeader: false,
  ...(isExport ? {} : { redirects, headers }),
};

async function redirects() {
  return [{ source: "/", destination: "/en", permanent: false }];
}

async function headers() {
  return [{ source: "/:path*", headers: securityHeaders }];
}

export default config;
