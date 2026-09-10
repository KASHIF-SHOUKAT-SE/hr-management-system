import Link from "next/link";

export default function Home() {
  return (
    <main className="landing-page">
      <p className="eyebrow">HRMS starter</p>
      <h1>Build your people operations workspace.</h1>
      <p className="lede">A shared Next.js foundation for teams building employee, attendance, leave, payroll, and department workflows.</p>
      <Link className="button" href="/dashboard">Open dashboard</Link>
    </main>
  );
}
