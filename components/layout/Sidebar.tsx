import Link from "next/link";

const navigation = [
  ["Dashboard", "/dashboard"],
  ["Employees", "/employees"],
  ["Departments", "/departments"],
  ["Attendance", "/attendance"],
  ["Leaves", "/leaves"],
  ["Payroll", "/payroll"],
  ["Settings", "/settings"],
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">People / Ops</div>
      <nav className="nav" aria-label="Main navigation">
        {navigation.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
      </nav>
    </aside>
  );
}
