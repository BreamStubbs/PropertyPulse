import { redirect } from "next/navigation";

// Auth state lives client-side, so the server can't know if you're signed in.
// Send everyone to /login first — it immediately forwards to /dashboard if a
// session already exists (see app/login/page.tsx). This avoids a "Loading…"
// flash for first-time (logged-out) visitors, the common case.
export default function Home() {
  redirect("/login");
}
