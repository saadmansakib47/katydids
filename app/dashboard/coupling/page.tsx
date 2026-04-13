"use client";

import { useTypewriter } from "@/hooks/useTypewriter";
import { CouplingCalculator } from "@/components/metrics/CouplingCalculator";
import { motion } from "framer-motion";

export default function CouplingPage() {
  const subtitle = useTypewriter("Calculate TCC, LCC, RCI, DIT and OO Reuse metrics.", 40);

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black tracking-tight border-b border-black pb-4">
        Coupling Metrics
      </h1>
      <motion.p 
        className="text-lg text-gray-600 font-mono mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {subtitle}<span className="inline-block w-[2px] h-[1em] bg-black ml-1 align-middle animate-pulse"></span>
      </motion.p>

      <CouplingCalculator />
    </div>
  );
}
