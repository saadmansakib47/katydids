"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Info, HelpCircle, ShieldAlert, Activity, Gauge } from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";

const Input = ({ label, value, onChange, min = "0", step = "1", tooltip }: any) => (
  <div className="flex flex-col space-y-2 font-mono">
    <div className="flex justify-between items-center">
      <label className="text-xs font-bold uppercase tracking-wider">{label}</label>
      {tooltip && (
        <Tooltip text={tooltip}>
          <HelpCircle size={14} className="text-gray-400 hover:text-black cursor-help shrink-0" />
        </Tooltip>
      )}
    </div>
    <input
      type="number"
      min={min}
      step={step}
      value={value.toString()}
      onChange={(e) => {
        const val = e.target.value === "" ? 0 : Number(e.target.value);
        onChange(val);
      }}
      className="border border-black p-2 focus:ring-2 focus:ring-black outline-none transition-all rounded-none text-lg w-full"
    />
  </div>
);

const ResultCard = ({ title, value, comment, good, tooltip, icon: Icon }: { title: string, value: string | number, comment: string, good?: boolean, tooltip?: string, icon?: any }) => (
  <motion.div 
    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
    className={`p-4 border ${good === undefined ? 'border-gray-400' : good ? 'border-black bg-gray-50' : 'border-black bg-gray-100'} border-l-4 ${good === undefined ? '!border-l-gray-600' : good ? '!border-l-black' : '!border-l-black'}`}
  >
    <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1 flex items-center justify-between">
      <div className="flex items-center gap-1">
        {Icon && <Icon size={14} />}
        {title}
      </div>
      {tooltip && (
        <Tooltip text={tooltip}>
          <HelpCircle size={14} className="text-gray-400 hover:text-black cursor-help shrink-0" />
        </Tooltip>
      )}
    </div>
    <div className="text-3xl font-black mb-3">{value}</div>
    <div className="text-sm flex items-start gap-2 font-mono">
      <Info size={16} className="mt-0.5 shrink-0" />
      <span>{comment}</span>
    </div>
  </motion.div>
);

export function QualityCalculator() {
  const [state, setState] = useState({
    halsteadVolume: 2500,
    cyclomaticComplexity: 12,
    loc: 1000,
    defects: 5,
  });

  const { halsteadVolume, cyclomaticComplexity, loc, defects } = state;

  // Calculate Maintainability Index
  const miRaw = loc > 0 && halsteadVolume > 0 
    ? 171 - 5.2 * Math.log(halsteadVolume) - 0.23 * cyclomaticComplexity - 16.2 * Math.log(loc)
    : 100;
  
  const mi = Math.min(100, Math.max(0, (miRaw * 100) / 171));
  const defectDensity = loc > 0 ? (defects / (loc / 1000)) : 0;

  // Persistence & Sync
  useEffect(() => {
    const saved = localStorage.getItem("qualityState");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTimeout(() => setState(p => ({ ...p, ...parsed })), 0);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("qualityState", JSON.stringify(state));
  }, [state]);

  const syncData = () => {
    const productSaved = localStorage.getItem("productSizeState");
    if (productSaved) {
      try {
        const productParsed = JSON.parse(productSaved);
        const { loc: rawLoc, n1, n2, N1, N2, ccMode, e, n, P, d } = productParsed;
        
        // Halstead Volume V = (n1+n2) * log2(n1+n2)
        const h_n = n1 + n2;
        const h_N = N1 + N2;
        const h_V = h_n > 0 ? h_N * Math.log2(h_n) : 0;
        
        const cc = ccMode === "edges" ? (e - n + 2 * P) : (d + P);

        setState(p => ({
          ...p,
          halsteadVolume: Number(h_V.toFixed(2)),
          cyclomaticComplexity: cc,
          loc: rawLoc
        }));
      } catch {}
    }
  };

  return (
    <div className="bg-white border-2 border-black">
      <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-black">
        <div className="text-xs font-mono font-bold uppercase tracking-widest text-gray-500">Software Quality Attributes</div>
        <button 
          onClick={syncData}
          className="text-[10px] uppercase font-bold bg-black text-white px-3 py-1 hover:bg-gray-800 transition-colors"
        >
          Sync from Product Size
        </button>
      </div>

      <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border border-black p-6 bg-gray-50">
          <div className="space-y-4">
             <h3 className="font-bold text-xs uppercase tracking-widest border-b border-black pb-2">Inputs for MI</h3>
             <Input label="Halstead Volume (V)" value={halsteadVolume} onChange={(val: number) => setState(p => ({ ...p, halsteadVolume: val }))} tooltip="The information content of the program." />
             <Input label="Cyclomatic Complexity (G)" value={cyclomaticComplexity} onChange={(val: number) => setState(p => ({ ...p, cyclomaticComplexity: val }))} tooltip="Control flow complexity." />
             <Input label="Lines of Code (LOC)" value={loc} onChange={(val: number) => setState(p => ({ ...p, loc: val }))} tooltip="Total source lines." />
          </div>
          <div className="space-y-4">
             <h3 className="font-bold text-xs uppercase tracking-widest border-b border-black pb-2">Defect Tracking</h3>
             <Input label="Known Defects" value={defects} onChange={(val: number) => setState(p => ({ ...p, defects: val }))} tooltip="Number of bugs/defects identified." />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResultCard 
            title="Maintainability Index (MI)" 
            icon={Gauge}
            value={mi.toFixed(2)} 
            good={mi > 40}
            comment={mi > 60 ? "Highly maintainable." : mi > 20 ? "Maintainable with care." : "Difficult to maintain."}
            tooltip="Proprietary metric measuring relative maintainability (SEI model)."
          />
          <ResultCard 
            title="Defect Density" 
            icon={ShieldAlert}
            value={`${defectDensity.toFixed(2)} / KLOC`} 
            good={defectDensity < 5}
            comment={defectDensity < 2 ? "High quality code." : defectDensity < 10 ? "Average quality" : "Critical defect rate."}
            tooltip="Number of defects per 1000 lines of code."
          />
        </div>

        <div className="p-6 border border-black bg-white">
           <div className="flex items-center gap-2 mb-4 font-bold uppercase text-xs">
              <Activity size={16} /> MI Scale (SEI-derived)
           </div>
           <div className="space-y-2 font-mono text-sm group">
              <div className={`p-2 border border-black flex justify-between ${mi > 60 ? 'bg-black text-white' : 'bg-gray-100'}`}>
                <span>60 - 100</span><span>High Maintainability</span>
              </div>
              <div className={`p-2 border border-black flex justify-between ${mi <= 60 && mi > 20 ? 'bg-black text-white' : 'bg-gray-100'}`}>
                <span>20 - 60</span><span>Medium Maintainability</span>
              </div>
              <div className={`p-2 border border-black flex justify-between ${mi <= 20 ? 'bg-black text-white' : 'bg-gray-100'}`}>
                <span>0 - 20</span><span>Low Maintainability</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
