import { Sidebar } from "@/components/dashboard/Sidebar";
import { EffortCalculator } from "@/components/metrics/EffortCalculator";

export default function EffortPage() {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 md:ml-72 p-6 md:p-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight uppercase">Effort Metrics</h1>
            <p className="text-gray-500 font-mono text-sm max-w-2xl">
              Project resource estimation utilizing the Constructive Cost Model (COCOMO II). 
              Forecast labor requirements, duration, and ideal team size.
            </p>
          </div>
          
          <EffortCalculator />
        </div>
      </main>
    </div>
  );
}
