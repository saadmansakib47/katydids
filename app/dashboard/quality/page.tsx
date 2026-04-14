import { Sidebar } from "@/components/dashboard/Sidebar";
import { QualityCalculator } from "@/components/metrics/QualityCalculator";

export default function QualityPage() {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 md:ml-72 p-6 md:p-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight uppercase">Quality Metrics</h1>
            <p className="text-gray-500 font-mono text-sm max-w-2xl">
              Assessing software reliability and long-term health. Monitor bug density and project the &quot;Maintainability Index&quot; to identify technical debt early.
            </p>
          </div>
          
          <QualityCalculator />
        </div>
      </main>
    </div>
  );
}
