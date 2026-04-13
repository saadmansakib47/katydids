"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Tooltip = ({ text, children }: { text: string; children: React.ReactNode }) => {
  const [show, setShow] = useState(false);

  return (
    <div 
      className="relative flex items-center" 
      onMouseEnter={() => setShow(true)} 
      onMouseLeave={() => setShow(false)}
      onClick={() => setShow(!show)}
    >
      <div className="cursor-help">{children}</div>
      <AnimatePresence>
        {show && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 5 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 5 }} 
            transition={{ duration: 0.15 }}
            className="absolute z-50 p-3 text-xs leading-relaxed font-mono bg-black text-white w-64 bottom-full mb-2 left-1/2 -translate-x-1/2 shadow-xl border border-black"
          >
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
