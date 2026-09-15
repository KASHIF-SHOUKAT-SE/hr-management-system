export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-8 py-4">
        <div className="flex items-center gap-2">
          <span className="text-[#1DA97A] font-bold text-xl">H</span>
          <span className="font-semibold text-gray-900">HRDashboard</span>
        </div>
      </header>
      {children}
    </div>
  );
}