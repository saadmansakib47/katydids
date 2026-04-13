"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info, ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";

const Input = ({ label, value, onChange, min = "0", max, step = "1", className = "" }: any) => (
  <div className={`flex flex-col space-y-2 font-mono ${className}`}>
    <label className="text-xs font-bold uppercase tracking-wider">{label}</label>
    <input
      type="number"
      min={min}
      max={max}
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

const ResultCard = ({ title, value, comment, good }: { title: string, value: string | number, comment: string, good?: boolean }) => (
  <motion.div 
    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
    className={`p-4 border ${good === undefined ? 'border-gray-400' : good ? 'border-black bg-gray-50' : 'border-black bg-gray-100'} border-l-4 ${good === undefined ? '!border-l-gray-600' : good ? '!border-l-black' : '!border-l-black'}`}
  >
    <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">{title}</div>
    <div className="text-3xl font-black mb-3">{value}</div>
    <div className="text-sm flex items-start gap-2 font-mono">
      {good === undefined ? <Info size={16} className="mt-0.5 shrink-0" /> : good ? <CheckCircle2 size={16} className="mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="mt-0.5 shrink-0" />}
      <span>{comment}</span>
    </div>
  </motion.div>
);

export function CouplingCalculator() {
  const [activeTab, setActiveTab] = useState<string>("class");

  // Class Cohesion
  const [direct, setDirect] = useState<number>(3);
  const [indirect, setIndirect] = useState<number>(2);
  const [maxPossible, setMaxPossible] = useState<number>(10);

  const tcc = maxPossible > 0 ? direct / maxPossible : 0;
  const lcc = maxPossible > 0 ? (direct + indirect) / maxPossible : 0;

  // Data Cohesion (RCI)
  const [variables, setVariables] = useState<{ id: number, n: number }[]>([{ id: 1, n: 3 }]);
  
  const addVariable = () => setVariables([...variables, { id: Date.now(), n: 0 }]);
  const removeVariable = (id: number) => setVariables(variables.filter(v => v.id !== id));
  const updateVariable = (id: number, n: number) => setVariables(variables.map(v => v.id === id ? { ...v, n } : v));

  const totalRci = variables.reduce((sum, v) => sum + (v.n * (v.n - 1)) / 2, 0);

  // DIT
  const [dit, setDit] = useState<number>(2);
  const [showDitTable, setShowDitTable] = useState(false);

  // OO Reuse
  const [directClient, setDirectClient] = useState<number>(2);
  const [indirectClient, setIndirectClient] = useState<number>(1);
  const [serverClients, setServerClients] = useState<number>(4);

  const clientReuse = directClient + indirectClient;

  const tabs = [
    { id: "class", label: "Class Cohesion (TCC/LCC)" },
    { id: "rci", label: "Data Cohesion (RCI)" },
    { id: "dit", label: "Depth of Inheritance (DIT)" },
    { id: "reuse", label: "OO Reuse" },
  ];

  return (
    <div className="bg-white border-2 border-black">
      <div className="flex flex-col sm:flex-row overflow-x-auto border-b-2 border-black bg-gray-50">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 font-bold text-sm tracking-widest whitespace-nowrap uppercase border-b-4 transition-colors ${
              activeTab === tab.id ? "border-black bg-white text-black" : "border-transparent text-gray-500 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6 md:p-8">
        {activeTab === "class" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 border border-black bg-gray-50">
              <Input label="Direct Pairs (NDC)" value={direct} onChange={setDirect} />
              <Input label="Indirect Pairs (NIC)" value={indirect} onChange={setIndirect} />
              <Input label="Max Possible Pairs (NP)" value={maxPossible} onChange={setMaxPossible} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResultCard 
                title="Tight Class Cohesion (TCC)" 
                value={tcc.toFixed(2)} 
                comment={tcc >= 0.5 ? "Good tight class cohesion 🎯" : "Low cohesion, consider refactoring ⚠️"} 
                good={tcc >= 0.5}
              />
              <ResultCard 
                title="Loose Class Cohesion (LCC)" 
                value={lcc.toFixed(2)} 
                comment={lcc >= 0.5 ? "Good loose architecture ✅" : "Class is poorly connected internally ⚠️"}
                good={lcc >= 0.5} 
              />
            </div>
            <div className="text-sm font-mono bg-gray-100 p-4 border border-black border-dashed">
              <span className="font-bold">Sprint 02 Preview:</span> In Sprint 02, we plan to extract NDC, NIC, NP from uploaded files automatically.
            </div>
          </div>
        )}

        {activeTab === "rci" && (
          <div className="space-y-8 animate-in fade-in duration-300">
             <div className="p-6 border border-black bg-gray-50">
              <div className="flex items-center justify-between mb-4 border-b border-black pb-4">
                <h3 className="font-bold uppercase tracking-widest text-sm">Variables Usage</h3>
                <button 
                  onClick={addVariable}
                  className="flex items-center gap-1 bg-black text-white px-3 py-1 text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors"
                >
                  <Plus size={14} /> Add Variable
                </button>
              </div>
              
              <div className="space-y-4">
                {variables.map((v, i) => (
                  <div key={v.id} className="flex items-center gap-4">
                    <div className="text-lg font-bold font-mono w-12 shrink-0">V{i + 1}</div>
                    <Input 
                      className="flex-1"
                      label={`Methods using this variable (n)`} 
                      value={v.n} 
                      onChange={(val: number) => updateVariable(v.id, val)} 
                    />
                    <div className="w-24 text-right font-mono text-sm border-r border-black pr-4">
                      p = {(v.n * (v.n - 1)) / 2}
                    </div>
                    {variables.length > 1 && (
                      <button onClick={() => removeVariable(v.id)} className="p-2 text-gray-500 hover:text-black">
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResultCard 
                title="Total RCI" 
                value={totalRci} 
                comment="Sum of 'p' for all variables evaluated." 
              />
            </div>
            <div className="text-sm font-mono bg-gray-100 p-4 border border-black border-dashed">
              <span className="font-bold">Sprint 02 Preview:</span> In Sprint 02, we plan to extract RCI inputs from uploaded file.
            </div>
          </div>
        )}

        {activeTab === "dit" && (
          <div className="space-y-8 animate-in fade-in duration-300">
             <div className="max-w-md p-6 border border-black bg-gray-50">
               <Input label="Depth Level (DIT)" value={dit} onChange={setDit} />
             </div>

             <div className="grid grid-cols-1 gap-6">
               <ResultCard 
                 title="Depth of Inheritance Tree Evaluation" 
                 value={`DIT = ${dit}`}
                 good={dit <= 5}
                 comment={
                   dit === 0 ? "No inheritance. Class is self-contained." :
                   dit <= 5 ? "Acceptable inheritance depth, manageable complexity." :
                   "High DIT! Increased complexity, difficult to predict behavior and high error proneness."
                 }
               />
             </div>

             <div className="pt-4">
              <button 
                onClick={() => setShowDitTable(!showDitTable)}
                className="flex items-center gap-2 bg-white text-black px-4 py-2 border border-black hover:bg-gray-100 font-bold uppercase tracking-wider text-xs"
              >
                {showDitTable ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                DIT Assessment Table
              </button>
              {showDitTable && (
                <div className="mt-4 border border-black p-4 bg-gray-50 font-mono text-sm max-w-lg">
                  <div className="grid grid-cols-3 font-bold mb-2 pb-2 border-b border-black">
                    <div>Depth</div><div>Complexity</div><div>Recommendation</div>
                  </div>
                  <div className="grid grid-cols-3 py-1 text-gray-600"><div>0-2</div><div>Low</div><div>Ideal for most scenarios</div></div>
                  <div className="grid grid-cols-3 py-1 text-gray-600"><div>3-5</div><div>Moderate</div><div>Acceptable but monitor</div></div>
                  <div className="grid grid-cols-3 py-1 text-gray-600"><div>&gt;5</div><div>High</div><div>Refactor, favor composition</div></div>
                </div>
              )}
            </div>

            <div className="text-sm font-mono bg-gray-100 p-4 border border-black border-dashed">
              <span className="font-bold">Sprint 02 & 03:</span> Automated extraction from uploaded files or UML diagrams via AI.
            </div>
          </div>
        )}

        {activeTab === "reuse" && (
          <div className="space-y-8 animate-in fade-in duration-300">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               
               {/* Client Perspective */}
               <div className="space-y-4">
                 <h3 className="font-bold uppercase tracking-widest border-b border-black pb-2">Client Perspective</h3>
                 <div className="p-6 border border-black bg-gray-50 space-y-4">
                   <Input label="Direct Server Classes" value={directClient} onChange={setDirectClient} />
                   <Input label="Indirect Server Classes" value={indirectClient} onChange={setIndirectClient} />
                 </div>
                 <ResultCard 
                   title="# Reuse (Client)" 
                   value={clientReuse} 
                   comment={clientReuse > 5 ? "High reuse rate from client perspective." : "Low reuse from client perspective."}
                   good={clientReuse > 5}
                 />
               </div>

               {/* Server Perspective */}
               <div className="space-y-4">
                 <h3 className="font-bold uppercase tracking-widest border-b border-black pb-2">Server Perspective</h3>
                 <div className="p-6 border border-black bg-gray-50">
                    <Input label="Clients using this library class" value={serverClients} onChange={setServerClients} />
                 </div>
                 <ResultCard 
                   title="# Reuse (Library Class)" 
                   value={serverClients} 
                   comment={serverClients > 3 ? "Highly reused class, good abstraction." : "Limited reuse across clients."}
                   good={serverClients > 3}
                 />
               </div>

             </div>
          </div>
        )}

      </div>
    </div>
  );
}
