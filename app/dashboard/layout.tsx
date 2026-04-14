import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 md:ml-72 bg-white text-black">
        <div className="p-6 md:p-12 lg:pl-20 max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  );
}
