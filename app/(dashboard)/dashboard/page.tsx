import { PageHeader } from "@/components/common/PageHeader";

const stats = [["Employees", "248"], ["Present today", "231"], ["Pending leave", "12"], ["Departments", "8"]];

export default function DashboardPage() {
  return <><PageHeader title="Dashboard" description="A quick view of your people operations." /><div className="stat-grid">{stats.map(([label, value]) => <article className="stat" key={label}><span>{label}</span><strong>{value}</strong></article>)}</div></>;
}
