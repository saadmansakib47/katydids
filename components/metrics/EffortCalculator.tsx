"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Info, HelpCircle, ChevronDown } from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";

const Input = ({ label, value, onChange, min = "0", step = "0.01", tooltip }: any) => (
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
      className="border border-black p-2 focus:ring-2 focus:ring-black outline-none transition-all rounded-none text-lg"
    />
  </div>
);

const ResultCard = ({ title, value, comment, tooltip }: { title: string, value: string | number, comment: string, tooltip?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
    className="p-4 border border-gray-400 border-l-4 !border-l-black bg-gray-50"
  >
    <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1 flex items-center justify-between">
      {title}
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

export function EffortCalculator() {
  const [state, setState] = useState({
    kloc: 50,
    mode: 'organic' as 'organic' | 'semidetached' | 'embedded',
    eaf: 1.0,
    showDrivers: false,
    drivers: {
      rely: 1.0, data: 1.0, cplx: 1.0, // Product attributes
      time: 1.0, stor: 1.0, virt: 1.0, turn: 1.0, // Platform attributes
      acap: 1.0, aexp: 1.0, pcap: 1.0, vexp: 1.0, lexp: 1.0, // Personnel attributes
      modp: 1.0, tool: 1.0, sced: 1.0 // Project attributes
    }
  });

  const { kloc, mode, drivers, showDrivers } = state;

  // Calculate product of drivers for EAF
  const calculatedEaf = Object.values(drivers).reduce((acc, val) => acc * val, 1);

  // COCOMO Coefficients
  const coefficients = {
    organic: { a: 3.2, b: 1.05, c: 2.5, d: 0.38 },
    semidetached: { a: 3.0, b: 1.12, c: 2.5, d: 0.35 },
    embedded: { a: 2.8, b: 1.20, c: 2.5, d: 0.32 },
  };

  const { a, b, c, d } = coefficients[mode];
  const effort = a * Math.pow(kloc, b) * calculatedEaf;
  const duration = c * Math.pow(effort, d);
  const staffing = duration > 0 ? effort / duration : 0;

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem("effortState");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTimeout(() => setState(p => ({ ...p, ...parsed })), 0);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("effortState", JSON.stringify(state));
  }, [state]);

  const setDriver = (name: keyof typeof drivers, val: number) => {
    setState(p => ({ ...p, drivers: { ...p.drivers, [name]: val } }));
  };

  return (
    <div className="bg-white border-2 border-black">
      <div className="p-4 bg-gray-50 border-b border-black text-xs font-mono font-bold uppercase tracking-widest text-gray-500">
        Constructive Cost Model (COCOMO II)
      </div>

      <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border border-black p-6 bg-gray-50">
          <Input 
            label="Software Size (KLOC)" 
            value={kloc} 
            onChange={(val: number) => setState(p => ({ ...p, kloc: val }))} 
            tooltip="Thousands of Lines of Code (KLOC). Base unit for COCOMO estimations."
          />
          <div className="flex flex-col space-y-2 font-mono">
            <label className="text-xs font-bold uppercase tracking-wider">Project Mode</label>
            <select 
              value={mode} 
              onChange={(e) => setState(p => ({ ...p, mode: e.target.value as any }))}
              className="border border-black p-2 bg-white text-lg h-[46px] outline-none"
            >
              <option value="organic">Organic (Simple, small teams)</option>
              <option value="semidetached">Semi-detached (Medium, mixed experience)</option>
              <option value="embedded">Embedded (Complex, rigid constraints)</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => setState(p => ({ ...p, showDrivers: !p.showDrivers }))}
            className="flex items-center gap-2 bg-white text-black px-4 py-2 border border-black hover:bg-gray-100 font-bold uppercase tracking-wider text-xs"
          >
            <motion.div animate={{ rotate: showDrivers ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown size={16} />
            </motion.div>
            Effort Adjustment Factors (Cost Drivers)
          </button>

          {showDrivers && (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 border border-black bg-white animate-in fade-in slide-in-from-top-2">
               <div className="space-y-4">
                  <h4 className="font-bold text-[10px] uppercase border-b border-black pb-1">Product Attributes</h4>
                  <DriverSelect label="Required Reliability" value={drivers.rely} onChange={(val) => setDriver('rely', val)} />
                  <DriverSelect label="Database Size" value={drivers.data} onChange={(val) => setDriver('data', val)} />
                  <DriverSelect label="Product Complexity" value={drivers.cplx} onChange={(val) => setDriver('cplx', val)} />
               </div>
               <div className="space-y-4">
                  <h4 className="font-bold text-[10px] uppercase border-b border-black pb-1">Personnel Attributes</h4>
                  <DriverSelect label="Analyst Capability" value={drivers.acap} onChange={(val) => setDriver('acap', val)} />
                  <DriverSelect label="Programmer Capability" value={drivers.pcap} onChange={(val) => setDriver('pcap', val)} />
                  <DriverSelect label="Language Experience" value={drivers.lexp} onChange={(val) => setDriver('lexp', val)} />
               </div>
               <div className="space-y-4">
                  <h4 className="font-bold text-[10px] uppercase border-b border-black pb-1">Project Attributes</h4>
                  <DriverSelect label="Modern Practices" value={drivers.modp} onChange={(val) => setDriver('modp', val)} />
                  <DriverSelect label="Software Tools" value={drivers.tool} onChange={(val) => setDriver('tool', val)} />
                  <DriverSelect label="Schedule Pressure" value={drivers.sced} onChange={(val) => setDriver('sced', val)} />
               </div>
             </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ResultCard 
            title="Effort (Person-Months)" 
            value={effort.toFixed(2)} 
            comment="Total labor months required." 
            tooltip="Calculated as a * (KLOC ^ b) * EAF. Represents total human effort."
          />
          <ResultCard 
            title="Duration (Months)" 
            value={duration.toFixed(2)} 
            comment="Estimated project timeline." 
            tooltip="Calculated as c * (Effort ^ d). Represents the calendar time to completion."
          />
          <ResultCard 
            title="Staffing (Average)" 
            value={Math.ceil(staffing)} 
            comment="Approximate people required." 
            tooltip="Effort / Duration. Gives a rough estimate of team size."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 p-6 border border-black border-dashed bg-gray-50 font-mono text-sm leading-relaxed">
          <div>
            <span className="font-bold block mb-2 underline">COCOMO II Parameters used:</span>
            <ul className="list-disc list-inside space-y-1">
              <li>Mode Constant (a): {a}</li>
              <li>Scaling Factor (b): {b}</li>
              <li>Duration Coeff (c): {c}</li>
              <li>Duration Power (d): {d}</li>
            </ul>
          </div>
          <div>
             <span className="font-bold block mb-2 underline">System EAF:</span>
             <div className="text-2xl font-black">{calculatedEaf.toFixed(3)}</div>
             <p className="text-[10px] mt-2 italic text-gray-500">The Effort Adjustment Factor is the total product of the 15 cost drivers selected above.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DriverSelect({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) {
  const options = [
    { label: 'Very Low', val: 0.75 },
    { label: 'Low', val: 0.88 },
    { label: 'Nominal', val: 1.00 },
    { label: 'High', val: 1.15 },
    { label: 'Very High', val: 1.40 },
    { label: 'Extra High', val: 1.66 }
  ];

  return (
    <div className="flex flex-col space-y-1 font-mono">
      <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500">{label}</label>
      <select 
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))}
        className="border border-black p-1 text-xs bg-white outline-none"
      >
        {options.map(opt => <option key={opt.label} value={opt.val}>{opt.label} ({opt.val})</option>)}
      </select>
    </div>
  );
}
