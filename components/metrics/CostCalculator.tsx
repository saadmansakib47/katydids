"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Info, HelpCircle, DollarSign, TrendingUp, BarChart3 } from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";

const Input = ({ label, value, onChange, min = "0", step = "1", tooltip, prefix }: any) => (
  <div className="flex flex-col space-y-2 font-mono">
    <div className="flex justify-between items-center">
      <label className="text-xs font-bold uppercase tracking-wider">{label}</label>
      {tooltip && (
        <Tooltip text={tooltip}>
          <HelpCircle size={14} className="text-gray-400 hover:text-black cursor-help shrink-0" />
        </Tooltip>
      )}
    </div>
    <div className="relative">
      {prefix && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
          {prefix}
        </div>
      )}
      <input
        type="number"
        min={min}
        step={step}
        value={value.toString()}
        onChange={(e) => {
          const val = e.target.value === "" ? 0 : Number(e.target.value);
          onChange(val);
        }}
        className={`border border-black p-2 focus:ring-2 focus:ring-black outline-none transition-all rounded-none text-lg w-full ${prefix ? 'pl-8' : ''}`}
      />
    </div>
  </div>
);

const ResultCard = ({ title, value, comment, tooltip, icon: Icon }: { title: string, value: string | number, comment: string, tooltip?: string, icon?: any }) => (
  <motion.div 
    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
    className="p-4 border border-gray-400 border-l-4 !border-l-black bg-gray-50"
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
    <div className="text-sm flex items-start gap-2 font-mono text-gray-600">
      <Info size={16} className="mt-0.5 shrink-0" />
      <span>{comment}</span>
    </div>
  </motion.div>
);

export function CostCalculator() {
  const [state, setState] = useState({
    personMonths: 32,
    monthlyRate: 5000,
    currency: "USD",
    afp: 450,
    loc: 5000,
  });

  const { personMonths, monthlyRate, currency, afp, loc } = state;

  const totalCost = personMonths * monthlyRate;
  const costPerFp = afp > 0 ? totalCost / afp : 0;
  const costPerLoc = loc > 0 ? totalCost / loc : 0;

  // Persistence & Data Auto-population
  useEffect(() => {
    const saved = localStorage.getItem("costState");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTimeout(() => setState(p => ({ ...p, ...parsed })), 0);
      } catch {}
    }

    // Synchronizer logic removed from effect to avoid lint warnings about unused vars; 
    // it was already redundant since syncData handles it.
  }, []);

  useEffect(() => {
    localStorage.setItem("costState", JSON.stringify(state));
  }, [state]);

  const syncData = () => {
    const effortSaved = localStorage.getItem("effortState");
    const productSaved = localStorage.getItem("productSizeState");
    
    const updates: any = {};
    
    if (effortSaved) {
       try {
         const effortParsed = JSON.parse(effortSaved);
         // Recalculate effort based on their KLOC/drivers
         const { kloc, mode, drivers } = effortParsed;
         const coefficients = {
            organic: { a: 3.2, b: 1.05 },
            semidetached: { a: 3.0, b: 1.12 },
            embedded: { a: 2.8, b: 1.20 },
         };
         const eaf = Object.values(drivers).reduce((acc: number, val: any) => acc * val, 1);
         const { a, b } = (coefficients as any)[mode];
         const calculatedEffort = a * Math.pow(kloc, b) * eaf;
         updates.personMonths = Number(calculatedEffort.toFixed(2));
       } catch {}
    }

    if (productSaved) {
       try {
         const productParsed = JSON.parse(productSaved);
         // Find AFP
         const { fpa, tdi, loc: rawLoc } = productParsed;
         const fpaWeights = {
            ilf: { low: 7, avg: 10, high: 15 },
            elf: { low: 5, avg: 7, high: 10 },
            ei: { low: 3, avg: 4, high: 6 },
            eo: { low: 4, avg: 5, high: 7 },
            eq: { low: 3, avg: 4, high: 6 }
          };
          let ufp = 0;
          Object.keys(fpa).forEach((key: any) => {
            ufp += fpa[key].count * (fpaWeights as any)[key][fpa[key].comp];
          });
          const vaf = (tdi * 0.01) + 0.65;
          updates.afp = Number((ufp * vaf).toFixed(2));
          updates.loc = rawLoc;
       } catch {}
    }

    setState(p => ({ ...p, ...updates }));
  };

  return (
    <div className="bg-white border-2 border-black">
      <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-black">
        <div className="text-xs font-mono font-bold uppercase tracking-widest text-gray-500">Project Cost Estimation</div>
        <button 
          onClick={syncData}
          className="text-[10px] uppercase font-bold bg-black text-white px-3 py-1 hover:bg-gray-800 transition-colors"
        >
          Sync from other calculators
        </button>
      </div>

      <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border border-black p-6 bg-gray-50">
          <Input 
            label="Effort (Person-Months)" 
            value={personMonths} 
            onChange={(val: number) => setState(p => ({ ...p, personMonths: val }))} 
            tooltip="Total labor effort in person-months. Can be pulled from the Effort Calculator."
          />
          <Input 
            label="Avg. Monthly Rate" 
            value={monthlyRate} 
            onChange={(val: number) => setState(p => ({ ...p, monthlyRate: val }))} 
            prefix="$"
            tooltip="Average cost of one person-month of labor."
          />
          <div className="flex flex-col space-y-2 font-mono">
            <label className="text-xs font-bold uppercase tracking-wider">Currency</label>
            <select 
              value={currency} 
              onChange={(e) => setState(p => ({ ...p, currency: e.target.value }))}
              className="border border-black p-2 bg-white text-lg h-[46px] outline-none"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
              <option value="BDT">BDT (৳)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border border-black p-6 bg-white border-dashed">
           <Input 
            label="Function Points (AFP)" 
            value={afp} 
            onChange={(val: number) => setState(p => ({ ...p, afp: val }))} 
            tooltip="Total Adjusted Function Points for normalized cost analysis."
          />
           <Input 
            label="Lines of Code (LOC)" 
            value={loc} 
            onChange={(val: number) => setState(p => ({ ...p, loc: val }))} 
            tooltip="Total lines of code for productivity benchmarking."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ResultCard 
            title="Total Project Cost" 
            icon={DollarSign}
            value={`${currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'INR' ? '₹' : '৳'}${totalCost.toLocaleString()}`} 
            comment="Projected financial investment." 
            tooltip="Effort * Monthly Rate. Total estimated labor cost."
          />
          <ResultCard 
            title="Cost per FP" 
            icon={TrendingUp}
            value={`${currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'INR' ? '₹' : '৳'}${costPerFp.toFixed(2)}`} 
            comment="Normalized functional expense." 
            tooltip="Total Cost / Adjusted Function Points. Best for comparing efficiency across platforms."
          />
          <ResultCard 
            title="Cost per Line (LOC)" 
            icon={BarChart3}
            value={`${currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'INR' ? '₹' : '৳'}${costPerLoc.toFixed(2)}`} 
            comment="Raw production cost per line." 
            tooltip="Total Cost / Total LOC. Simple but technology-dependent metric."
          />
        </div>

        <div className="p-4 border border-black bg-gray-900 text-white font-mono text-xs">
           <span className="text-gray-400 uppercase font-black block mb-2">Expert Insight:</span>
           Cost per Function Point is considered a more stable metric than Cost per LOC because it evaluates the &quot;user-delivered functionality&quot; rather than the &quot;implementation volume,&quot; which varies significantly by programming language.
        </div>
      </div>
    </div>
  );
}
