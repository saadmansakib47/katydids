"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useTypewriter } from "@/hooks/useTypewriter";

export default function LandingPage() {
  const subtitle = useTypewriter("Measure your software's temperature", 50);

  return (
    <main className="flex-1 flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      <div className="max-w-3xl w-full text-center space-y-8">
        <motion.div 
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Image src="/assets/katydids-logo.png" alt="Katydids Logo" width={112} height={112} priority className="object-contain drop-shadow-md" />
          <h1 className="text-6xl sm:text-8xl font-black tracking-tight">Katydids</h1>
        </motion.div>
        
        <div className="h-12 flex items-center justify-center">
          <motion.h2 
            className="text-xl sm:text-3xl font-medium text-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {subtitle}
            <motion.span 
              animate={{ opacity: [1, 0] }} 
              transition={{ repeat: Infinity, duration: 0.8 }} 
              className="inline-block w-[3px] h-[1em] bg-black ml-1 align-middle"
            />
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.5 }}
          className="pt-8"
        >
          <Link 
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-800 px-8 py-4 text-lg font-medium transition-colors border border-black"
          >
            Enter Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
