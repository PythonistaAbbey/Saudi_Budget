import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui", padding: 40 }}>
        <h1>Page not found</h1>
        <p>This is an independent concept prototype, not the official Budget Saudi website.</p>
        <Link href="/en">Go to the concept home page</Link>
      </body>
    </html>
  );
}
