"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info, ChevronDown, Plus, Trash2, HelpCircle } from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";

const Input = ({ label, value, onChange, min = "0", max, step = "1", className = "", tooltip }: any) => (
  <div className={`flex flex-col space-y-2 font-mono ${className}`}>
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

const ResultCard = ({ title, value, comment, good, tooltip }: { title: string, value: string | number, comment: string, good?: boolean, tooltip?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
    className={`p-4 border ${good === undefined ? 'border-gray-400' : good ? 'border-black bg-gray-50' : 'border-black bg-gray-100'} border-l-4 ${good === undefined ? '!border-l-gray-600' : good ? '!border-l-black' : '!border-l-black'}`}
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
      {good === undefined ? <Info size={16} className="mt-0.5 shrink-0" /> : good ? <CheckCircle2 size={16} className="mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="mt-0.5 shrink-0" />}
      <span>{comment}</span>
    </div>
  </motion.div>
);

export function CouplingCalculator() {
  const [activeTab, setActiveTab] = useState<string>("class");

  const defaultState = {
    direct: 3, indirect: 2, maxPossible: 10,
    variables: [{ id: 1, n: 3 }],
    dit: 2, showDitTable: false,
    directClient: 2, indirectClient: 1, serverClients: 4
  };

  const [state, setState] = useState(defaultState);
  const { direct, indirect, maxPossible, variables, dit, showDitTable, directClient, indirectClient, serverClients } = state;

  const setDirect = (direct: number) => setState(p => ({ ...p, direct }));
  const setIndirect = (indirect: number) => setState(p => ({ ...p, indirect }));
  const setMaxPossible = (maxPossible: number) => setState(p => ({ ...p, maxPossible }));
  
  const setVariables = (update: any) => setState(p => ({ ...p, variables: typeof update === 'function' ? update(p.variables) : update }));
  const addVariable = () => setVariables((v: any) => [...v, { id: Date.now(), n: 0 }]);
  const removeVariable = (id: number) => setVariables((v: any) => v.filter((item: any) => item.id !== id));
  const updateVariable = (id: number, n: number) => setVariables((v: any) => v.map((item: any) => item.id === id ? { ...item, n } : item));

  const setDit = (dit: number) => setState(p => ({ ...p, dit }));
  const setShowDitTable = (showDitTable: boolean) => setState(p => ({ ...p, showDitTable }));
  
  const setDirectClient = (directClient: number) => setState(p => ({ ...p, directClient }));
  const setIndirectClient = (indirectClient: number) => setState(p => ({ ...p, indirectClient }));
  const setServerClients = (serverClients: number) => setState(p => ({ ...p, serverClients }));

  const tcc = maxPossible > 0 ? direct / maxPossible : 0;
  const lcc = maxPossible > 0 ? (direct + indirect) / maxPossible : 0;
  const totalRci = variables.reduce((sum: number, v: any) => sum + (v.n * (v.n - 1)) / 2, 0);
  const clientReuse = directClient + indirectClient;

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem("couplingState");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTimeout(() => setState(p => ({ ...p, ...parsed })), 0);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("couplingState", JSON.stringify(state));
  }, [state]);

  const exportData = (format: 'json' | 'md') => {
    const data = {
      classCohesion: { direct, indirect, maxPossible, tcc, lcc },
      dataCohesion: { variables, totalRci },
      dit: { dit },
      ooReuse: { directClient, indirectClient, serverClients, clientReuse }
    };

    let content = "";
    if (format === 'json') {
      content = JSON.stringify(data, null, 2);
    } else {
      content = `# Coupling Metrics Export\n\n## Class Cohesion\n- Tight Class Cohesion (TCC): ${tcc.toFixed(2)}\n- Loose Class Cohesion (LCC): ${lcc.toFixed(2)}\n\n## Data Cohesion\n- Total RCI: ${totalRci}\n\n## Depth of Inheritance\n- DIT: ${dit}\n\n## OO Reuse\n- Client Reuse: ${clientReuse}\n- Server Reuse: ${serverClients}\n`;
    }

    const blob = new Blob([content], { type: format === 'json' ? "application/json" : "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coupling-metrics.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: "class", label: "Class Cohesion (TCC/LCC)" },
    { id: "rci", label: "Data Cohesion (RCI)" },
    { id: "dit", label: "Depth of Inheritance (DIT)" },
    { id: "reuse", label: "OO Reuse" },
  ];

  return (
    <div className="bg-white border-2 border-black">
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-50 border-b border-black gap-4 text-sm font-mono leading-none">
        <div className="text-gray-500 font-bold tracking-widest text-xs uppercase">Auto-saved Locally</div>
        <div className="flex gap-2">
          <button onClick={() => exportData('json')} className="bg-black text-white px-4 py-2 uppercase tracking-wider font-bold hover:bg-gray-800 transition-colors">Export JSON</button>
          <button onClick={() => exportData('md')} className="bg-white text-black border border-black px-4 py-2 uppercase tracking-wider font-bold hover:bg-gray-100 transition-colors">Export MD</button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row overflow-x-auto border-b-2 border-black bg-gray-50">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-6 py-4 font-bold text-sm tracking-widest whitespace-nowrap uppercase border-b-[4px] border-transparent transition-colors ${
              activeTab === tab.id ? "bg-white text-black" : "text-gray-500 hover:bg-gray-200"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                className="absolute left-0 -bottom-[4px] h-[4px] bg-black"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="p-6 md:p-8">
        {activeTab === "class" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 border border-black bg-gray-50">
              <Input label="Direct Pairs (NDC)" value={direct} onChange={setDirect} tooltip="Number of connection pairs formed directly by method invocations." />
              <Input label="Indirect Pairs (NIC)" value={indirect} onChange={setIndirect} tooltip="Number of connection pairs formed indirectly across multiple edges." />
              <Input label="Max Possible Pairs (NP)" value={maxPossible} onChange={setMaxPossible} tooltip="Total theoretical pairs that could connect methods." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResultCard 
                title="Tight Class Cohesion (TCC)" 
                value={tcc.toFixed(2)} 
                comment={tcc >= 0.5 ? "Good tight class cohesion." : "Low cohesion, consider refactoring."} 
                good={tcc >= 0.5}
                tooltip="TCC targets strictly direct interaction. High TCC means methods share instance variables inherently."
              />
              <ResultCard 
                title="Loose Class Cohesion (LCC)" 
                value={lcc.toFixed(2)} 
                comment={lcc >= 0.5 ? "Good loose architecture. " : "Class is poorly connected internally."}
                good={lcc >= 0.5} 
                tooltip="LCC includes indirect invocations and variable usage, indicating broad cohesive nature."
              />
            </div>
            <div className="text-sm font-mono bg-gray-100 p-4 border border-black border-dashed">
              <span className="font-bold">Upcoming : </span> Extract NDC, NIC, NP from uploaded files automatically.
            </div>
          </div>
        )}

        {activeTab === "rci" && (
          <div className="space-y-8 animate-in fade-in duration-300">
             <div className="p-6 border border-black bg-gray-50">
              <div className="flex items-center justify-between mb-4 border-b border-black pb-4">
                <h3 className="font-bold uppercase tracking-widest text-sm flex gap-2 items-center">
                  Variables Usage
                  <Tooltip text="RCI aggregates pairs 'p' based on variables used across multiple methods. Higher reuse indicates better data cohesion.">
                    <HelpCircle size={14} className="text-gray-400 cursor-help" />
                  </Tooltip>
                </h3>
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
                tooltip="Data Cohesion via RCI reflects the degree variables participate across member methods. Correlated heavily with maintainable code!"
              />
            </div>
            <div className="text-sm font-mono bg-gray-100 p-4 border border-black border-dashed">
              <span className="font-bold">Upcoming : </span> Extract RCI inputs from uploaded file.
            </div>
          </div>
        )}

        {activeTab === "dit" && (
          <div className="space-y-8 animate-in fade-in duration-300">
             <div className="max-w-md p-6 border border-black bg-gray-50">
               <Input label="Depth Level (DIT)" value={dit} onChange={setDit} tooltip="The maximum inheritance path from the class to the root class." />
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
                 tooltip="DIT measures how many parent layers exist above a class. > 5 layers tends to obfuscate control flow."
               />
             </div>

             <div className="pt-4">
              <button 
                onClick={() => setShowDitTable(!showDitTable)}
                className="flex items-center gap-2 bg-white text-black px-4 py-2 border border-black hover:bg-gray-100 font-bold uppercase tracking-wider text-xs"
              >
                <motion.div animate={{ rotate: showDitTable ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown size={16} />
                </motion.div>
                DIT Assessment Table
              </button>
              {showDitTable && (
                <div className="mt-4 border border-black p-4 bg-gray-50 font-mono text-sm max-w-lg animate-in fade-in slide-in-from-top-2">
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
              <span className="font-bold">Upcoming:</span> Automated extraction from uploaded files or UML diagrams via AI.
            </div>
          </div>
        )}

        {activeTab === "reuse" && (
          <div className="space-y-8 animate-in fade-in duration-300">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               
               {/* Client Perspective */}
               <div className="space-y-4">
                 <h3 className="font-bold uppercase tracking-widest border-b border-black pb-2 flex justify-between">
                    Client Perspective
                    <Tooltip text="Measures how effectively this client module reuses server (provider) classes.">
                      <HelpCircle size={16} className="text-gray-400 cursor-help" />
                    </Tooltip>
                 </h3>
                 <div className="p-6 border border-black bg-gray-50 space-y-4">
                   <Input label="Direct Server Classes" value={directClient} onChange={setDirectClient} tooltip="Classes communicating adjacently to this client." />
                   <Input label="Indirect Server Classes" value={indirectClient} onChange={setIndirectClient} tooltip="Classes acting down the sub-chain of server paths." />
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
                 <h3 className="font-bold uppercase tracking-widest border-b border-black pb-2 flex justify-between">
                   Server Perspective
                   <Tooltip text="Assesses the effectiveness of a library component by tracking dependency distribution.">
                     <HelpCircle size={16} className="text-gray-400 cursor-help" />
                   </Tooltip>
                 </h3>
                 <div className="p-6 border border-black bg-gray-50">
                    <Input label="Clients using this library class" value={serverClients} onChange={setServerClients} tooltip="Amount of separate components relying on this library implementation." />
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
