import Link from "next/link";

export default function LoginPage() {
  return <main className="landing-page"><p className="eyebrow">People / Ops</p><h1>Welcome back.</h1><p className="lede">Authentication form placeholder. Connect this route to the auth service when ready.</p><Link className="button" href="/dashboard">Continue to dashboard</Link><Link href="/forgot-password">Forgot password?</Link></main>;
}
