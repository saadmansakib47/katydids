import { Sidebar } from "@/components/dashboard/Sidebar";
import { CostCalculator } from "@/components/metrics/CostCalculator";

export default function CostPage() {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 md:ml-72 p-6 md:p-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight uppercase">Cost Metrics</h1>
            <p className="text-gray-500 font-mono text-sm max-w-2xl">
              Financial analysis and budgetary forecasting. Calculate total investment and unit-of-work costs (Function Points/LOC) to measure economic efficiency.
            </p>
          </div>
          
          <CostCalculator />
        </div>
      </main>
    </div>
  );
}
