"use client";

import { useTypewriter } from "@/hooks/useTypewriter";
import { motion } from "framer-motion";
import { EffortCalculator } from "@/components/metrics/EffortCalculator";

export default function EffortPage() {
  const subtitle = useTypewriter("Estimate labor, duration, and ideal team size via COCOMO II.", 40);

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black tracking-tight border-b border-black pb-4">
        Effort metrics
      </h1>
      <motion.p 
        className="text-lg text-gray-600 font-mono mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {subtitle}<span className="inline-block w-[2px] h-[1em] bg-black ml-1 align-middle animate-pulse"></span>
      </motion.p>
      
      <EffortCalculator />
    </div>
  );
}
