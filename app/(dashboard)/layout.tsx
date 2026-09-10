import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return <div className="dashboard-shell"><Sidebar /><section className="dashboard-content"><Navbar />{children}</section></div>;
}
