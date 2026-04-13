"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";

const Input = ({ label, value, onChange, min = "0", max, step = "1", tooltip }: any) => (
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

export function ProductSizeCalculator() {
  const [activeTab, setActiveTab] = useState<string>("basic");

  // Basic Metrics
  const [loc, setLoc] = useState<number>(1000);
  const [cloc, setCloc] = useState<number>(200);
  const [locL1, setLocL1] = useState<number>(0);
  const [locL2, setLocL2] = useState<number>(0);
  const [showQsm, setShowQsm] = useState(false);

  const commentDensity = loc > 0 ? (cloc / loc) : 0;
  const ncloc = Math.max(0, loc - cloc);
  const lgf = locL2 > 0 ? (locL1 / locL2) : 0;

  // Halstead
  const [n1, setN1] = useState<number>(12);
  const [n2, setN2] = useState<number>(20);
  const [N1, setCapN1] = useState<number>(45);
  const [N2, setCapN2] = useState<number>(30);

  const halstead_n = n1 + n2;
  const halstead_N = N1 + N2;
  const halstead_V = halstead_n > 0 ? halstead_N * Math.log2(halstead_n) : 0;
  const halstead_D = n2 > 0 ? (n1 / 2) * (N2 / n2) : 0;
  const halstead_E = halstead_D * halstead_V;

  // FPA
  const [fpa, setFpa] = useState({
    ilf: { count: 0, comp: 'avg' },
    elf: { count: 0, comp: 'avg' },
    ei: { count: 0, comp: 'avg' },
    eo: { count: 0, comp: 'avg' },
    eq: { count: 0, comp: 'avg' }
  });
  const [tdi, setTdi] = useState<number>(35);
  const [showFpaTable, setShowFpaTable] = useState(false);

  const fpaWeights = {
    ilf: { low: 7, avg: 10, high: 15 },
    elf: { low: 5, avg: 7, high: 10 },
    ei: { low: 3, avg: 4, high: 6 },
    eo: { low: 4, avg: 5, high: 7 },
    eq: { low: 3, avg: 4, high: 6 }
  };

  const getUfp = () => {
    let sum = 0;
    (Object.keys(fpa) as Array<keyof typeof fpa>).forEach(key => {
      sum += fpa[key].count * fpaWeights[key][fpa[key].comp as keyof typeof fpaWeights[typeof key]];
    });
    return sum;
  };
  const ufp = getUfp();
  const vaf = (tdi * 0.01) + 0.65;
  const afp = ufp * vaf;

  // CC
  const [ccMode, setCcMode] = useState<"edges" | "decision">("edges");
  const [e, setE] = useState<number>(10);
  const [n, setN] = useState<number>(8);
  const [P, setP] = useState<number>(1);
  const [d, setD] = useState<number>(3);
  const [showCcTable, setShowCcTable] = useState(false);

  const cc = ccMode === "edges" ? (e - n + 2 * P) : (d + P);
  const ccd = loc > 0 ? Math.max(0, cc / loc) : 0;

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem("productSizeState");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.loc !== undefined) setLoc(parsed.loc);
        if (parsed.cloc !== undefined) setCloc(parsed.cloc);
        if (parsed.locL1 !== undefined) setLocL1(parsed.locL1);
        if (parsed.locL2 !== undefined) setLocL2(parsed.locL2);
        if (parsed.n1 !== undefined) setN1(parsed.n1);
        if (parsed.n2 !== undefined) setN2(parsed.n2);
        if (parsed.N1 !== undefined) setCapN1(parsed.N1);
        if (parsed.N2 !== undefined) setCapN2(parsed.N2);
        if (parsed.fpa !== undefined) setFpa(parsed.fpa);
        if (parsed.tdi !== undefined) setTdi(parsed.tdi);
        if (parsed.e !== undefined) setE(parsed.e);
        if (parsed.n !== undefined) setN(parsed.n);
        if (parsed.P !== undefined) setP(parsed.P);
        if (parsed.d !== undefined) setD(parsed.d);
        if (parsed.ccMode !== undefined) setCcMode(parsed.ccMode);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const stateToSave = { loc, cloc, locL1, locL2, n1, n2, N1, N2, fpa, tdi, e, n, P, d, ccMode };
    localStorage.setItem("productSizeState", JSON.stringify(stateToSave));
  }, [loc, cloc, locL1, locL2, n1, n2, N1, N2, fpa, tdi, e, n, P, d, ccMode]);

  const exportData = (format: 'json' | 'md') => {
    const data = {
      basic: { loc, cloc, locL1, locL2, commentDensity, ncloc, lgf },
      halstead: { n1, n2, N1, N2, Vocabulary: halstead_n, Length: halstead_N, Volume: halstead_V, Difficulty: halstead_D, Effort: halstead_E },
      fpa: { inputs: fpa, tdi, ufp, vaf, afp },
      complexity: { mode: ccMode, e, n, P, d, CyclomaticComplexity: cc, Density: ccd }
    };

    let content = "";
    if (format === 'json') {
      content = JSON.stringify(data, null, 2);
    } else {
      content = `# Product Size Metrics Export\n\n## Basic\n- Comment Density: ${(commentDensity*100).toFixed(1)}%\n- NCLOC: ${ncloc}\n- LGF: ${lgf.toFixed(2)}\n\n## Halstead\n- Vocabulary: ${halstead_n}\n- Volume: ${halstead_V.toFixed(2)}\n- Difficulty: ${halstead_D.toFixed(2)}\n- Effort: ${halstead_E.toFixed(2)}\n\n## FPA\n- UFP: ${ufp}\n- VAF: ${vaf.toFixed(2)}\n- AFP: ${afp.toFixed(2)}\n\n## Complexity\n- Cyclomatic Complexity: ${cc}\n- Density: ${ccd.toFixed(4)}\n`;
    }

    const blob = new Blob([content], { type: format === 'json' ? "application/json" : "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `product-size-metrics.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: "basic", label: "Basic Metrics" },
    { id: "halstead", label: "Halstead Metrics" },
    { id: "fpa", label: "FPA" },
    { id: "cc", label: "Cyclomatic Complexity" },
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
            className={`px-6 py-4 font-bold text-sm tracking-widest whitespace-nowrap uppercase border-b-4 transition-colors ${
              activeTab === tab.id ? "border-black bg-white text-black" : "border-transparent text-gray-500 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6 md:p-8">
        {activeTab === "basic" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-black bg-gray-50">
              <Input label="Total LOC" value={loc} onChange={setLoc} tooltip="Total lines of code indicates raw size but can include dead code and comments." />
              <Input label="Comment LOC (CLOC)" value={cloc} onChange={setCloc} tooltip="Lines containing only comments. Helps measure code documentation." />
              <Input label="LOC (Lang 1)" value={locL1} onChange={setLocL1} tooltip="LOC in primary language." />
              <Input label="LOC (Lang 2)" value={locL2} onChange={setLocL2} tooltip="LOC in secondary language." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ResultCard 
                title="Comment Density" 
                value={(commentDensity * 100).toFixed(1) + "%"} 
                comment={commentDensity > 0.2 ? "Good maintainability 🎯" : "More comments needed ⚠️"} 
                good={commentDensity > 0.2}
                tooltip="High comment density corresponds to better maintainability and testability."
              />
              <ResultCard 
                title="NCLOC" 
                value={ncloc} 
                comment="Non-comment source code defining active logic." 
                tooltip="NCLOC tracks only executable logic, providing a more accurate reflection of complexity than raw LOC."
              />
              <ResultCard 
                title="Language Growth Factor" 
                value={lgf.toFixed(2)} 
                comment="LGF ratio between Lang 1 and Lang 2." 
                tooltip="Identifies the expansion factor when porting logic across programming languages."
              />
            </div>

            <div className="pt-4">
              <button 
                onClick={() => setShowQsm(!showQsm)}
                className="flex items-center gap-2 bg-white text-black px-4 py-2 border border-black hover:bg-gray-100 font-bold uppercase tracking-wider text-xs"
              >
                {showQsm ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                QSM SLOC/FP Data Table
              </button>
              {showQsm && (
                <div className="mt-4 border border-black p-4 bg-gray-50 font-mono text-sm max-w-md animate-in fade-in slide-in-from-top-2">
                  <div className="grid grid-cols-2 font-bold mb-2 pb-2 border-b border-black">
                    <div>Language</div><div>Avg SLOC / UFP</div>
                  </div>
                  <div className="grid grid-cols-2 py-1"><div>C</div><div>128</div></div>
                  <div className="grid grid-cols-2 py-1"><div>C++</div><div>53</div></div>
                  <div className="grid grid-cols-2 py-1"><div>Java</div><div>53</div></div>
                  <div className="grid grid-cols-2 py-1"><div>JavaScript</div><div>47</div></div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "halstead" && (
          <div className="space-y-8 animate-in fade-in duration-300">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-black bg-gray-50">
              <Input label="Unique Operators (n1)" value={n1} onChange={setN1} tooltip="Number of distinct operators (+, -, if, while) in the code." />
              <Input label="Unique Operands (n2)" value={n2} onChange={setN2} tooltip="Number of distinct operands (variables, constants) in the code." />
              <Input label="Total Operators (N1)" value={N1} onChange={setCapN1} tooltip="Total occurrences of operators." />
              <Input label="Total Operands (N2)" value={N2} onChange={setCapN2} tooltip="Total occurrences of operands." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ResultCard title="Vocabulary (n)" value={halstead_n} comment="Total unique symbols used." tooltip="Measures the number of unique elements the developer needs to understand." />
              <ResultCard title="Program Length (N)" value={halstead_N} comment="Total symbols used." tooltip="Measures total size of operations." />
              <ResultCard title="Volume (V)" value={halstead_V.toFixed(2)} comment="Size of the implementation." tooltip="Represents the size of the implementation (information content)." />
              <ResultCard title="Difficulty (D)" value={halstead_D.toFixed(2)} comment={halstead_D > 15 ? "High complexity/difficulty ⚠️" : "Manageable difficulty ✅"} good={halstead_D <= 15} tooltip="Higher difficulty makes code harder to write and understand." />
              <ResultCard title="Effort (E)" value={halstead_E.toFixed(2)} comment="Proportional to mental effort to recreate." tooltip="Measures the cognitive load and mental effort required to develop the program." />
            </div>
          </div>
        )}

        {activeTab === "fpa" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="border border-black bg-gray-50 p-6">
              <h3 className="font-bold text-lg mb-4 uppercase tracking-widest border-b border-black pb-2 flex justify-between items-center">
                Function Count & Weights
                <Tooltip text="FPA measures functionality requested by and provided to the user, irrespective of the underlying technology.">
                  <HelpCircle size={18} className="text-gray-400 cursor-help" />
                </Tooltip>
              </h3>
              <div className="grid gap-6">
                {(Object.keys(fpa) as Array<keyof typeof fpa>).map(k => (
                  <div key={k} className="flex flex-col sm:flex-row gap-4 items-center sm:items-end">
                    <Input label={k.toUpperCase()} value={fpa[k].count} onChange={(val: number) => setFpa(p => ({...p, [k]: { ...p[k], count: val }}))} />
                    <div className="flex flex-col space-y-2 font-mono">
                      <label className="text-xs font-bold uppercase tracking-wider flex justify-between">
                        Weight
                      </label>
                      <select 
                        value={fpa[k].comp} 
                        onChange={(e) => setFpa(p => ({...p, [k]: { ...p[k], comp: e.target.value }}))}
                        className="border border-black p-2 bg-white text-lg h-[46px] outline-none"
                      >
                        <option value="low">Low</option>
                        <option value="avg">Average</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border border-black bg-gray-50 flex items-center gap-6">
              <Input label="Total Degree of Influence (TDI 0-70)" value={tdi} onChange={setTdi} min="0" max="70" tooltip="Sum of 14 general system characteristics, each rated 0 to 5." />
              <div className="text-sm font-mono text-gray-600 max-w-sm border-l border-black pl-4">Calculates Value Adjustment Factor (VAF) from system characteristics (TDI * 0.01 + 0.65).</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ResultCard title="Unadjusted FP (UFP)" value={ufp} comment="Base function points." tooltip="UFP represents the functional size independent of non-functional requirements." />
              <ResultCard title="Value Adjustment (VAF)" value={vaf.toFixed(2)} comment="Derived from TDI." tooltip="Factor indicating general system characteristic complexity." />
              <ResultCard title="Adjusted FP (AFP)" value={afp.toFixed(2)} comment="Final FPA evaluation 🚀" good={true} tooltip="Final functional size metric incorporating technical influence." />
            </div>

            <div className="pt-4">
              <button 
                onClick={() => setShowFpaTable(!showFpaTable)}
                className="flex items-center gap-2 bg-white text-black px-4 py-2 border border-black hover:bg-gray-100 font-bold uppercase tracking-wider text-xs"
              >
                {showFpaTable ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                Weighing Factor Table
              </button>
              {showFpaTable && (
                <div className="mt-4 border border-black p-4 bg-gray-50 font-mono text-sm max-w-lg animate-in fade-in slide-in-from-top-2">
                  <div className="grid grid-cols-4 font-bold mb-2 pb-2 border-b border-black">
                    <div>Type</div><div>Low</div><div>Avg</div><div>High</div>
                  </div>
                  <div className="grid grid-cols-4 py-1"><div>ILF</div><div>7</div><div>10</div><div>15</div></div>
                  <div className="grid grid-cols-4 py-1"><div>ELF</div><div>5</div><div>7</div><div>10</div></div>
                  <div className="grid grid-cols-4 py-1"><div>EI</div><div>3</div><div>4</div><div>6</div></div>
                  <div className="grid grid-cols-4 py-1"><div>EO</div><div>4</div><div>5</div><div>7</div></div>
                  <div className="grid grid-cols-4 py-1"><div>EQ</div><div>3</div><div>4</div><div>6</div></div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "cc" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex gap-4 mb-4">
              <button onClick={() => setCcMode("edges")} className={`px-4 py-2 border border-black font-bold uppercase text-xs tracking-wider ${ccMode === "edges" ? "bg-black text-white" : "bg-white text-black"}`}>Mode: e, n, P</button>
              <button onClick={() => setCcMode("decision")} className={`px-4 py-2 border border-black font-bold uppercase text-xs tracking-wider ${ccMode === "decision" ? "bg-black text-white" : "bg-white text-black"}`}>Mode: d, P</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-black bg-gray-50">
              <Input label="LOC (for density)" value={loc} onChange={setLoc} tooltip="Used strictly for calculating Cyclomatic Complexity Density (CCD)." />
              {ccMode === "edges" ? (
                <>
                  <Input label="Edges (e)" value={e} onChange={setE} tooltip="Number of branches/edges in the control flow graph." />
                  <Input label="Vertices (n)" value={n} onChange={setN} tooltip="Number of nodes/statements in the control flow graph." />
                  <Input label="Connected Components (P)" value={P} onChange={setP} tooltip="Number of connected programs/functions." />
                </>
              ) : (
                <>
                  <Input label="Decision Nodes (d)" value={d} onChange={setD} tooltip="Number of predicates (if, while, case)." />
                  <Input label="Connected Components (P)" value={P} onChange={setP} tooltip="Number of connected programs." />
                </>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResultCard 
                title="Cyclomatic Complexity V(G)" 
                value={cc} 
                comment={cc <= 10 ? "Simple, high testability 🚀" : cc <= 20 ? "Moderate risk ⚠️" : "Complex, high cost & effort ❌"} 
                good={cc <= 10 ? true : cc <= 20 ? undefined : false}
                tooltip="Identifies the number of independent paths through the code. Higher CC means harder to test and maintain."
              />
              <ResultCard 
                title="Complexity Density (CCD)" 
                value={ccd.toFixed(4)} 
                comment={ccd < 0.14 ? "Lower CCD, higher maintenance productivity ✅" : "High CCD, difficult maintenance ⚠️"} 
                good={ccd < 0.14}
                tooltip="CC / LOC. Helps normalize complexity across heavily disjoint program lengths."
              />
            </div>

             <div className="pt-4 flex gap-4">
              <button 
                onClick={() => setShowCcTable(!showCcTable)}
                className="flex items-center gap-2 bg-white text-black px-4 py-2 border border-black hover:bg-gray-100 font-bold uppercase tracking-wider text-xs"
              >
                {showCcTable ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                Complexity Classification & Impact Tables
              </button>
            </div>
            
            {showCcTable && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 animate-in fade-in slide-in-from-top-2">
                <div className="border border-black p-4 bg-gray-50 font-mono text-sm flex-1">
                  <div className="font-black text-xs uppercase tracking-widest mb-4 flex gap-2"><Info size={16}/> Classification & Impact</div>
                  <div className="grid grid-cols-2 font-bold mb-2 pb-2 border-b border-black">
                    <div>Complexity</div><div>Evaluation</div>
                  </div>
                  <div className="grid grid-cols-2 py-1"><div>1-10</div><div>Simple, Low Risk</div></div>
                  <div className="grid grid-cols-2 py-1"><div>11-20</div><div>More Complex, Moderate Risk</div></div>
                  <div className="grid grid-cols-2 py-1"><div>21-50</div><div>Complex, High Risk</div></div>
                  <div className="grid grid-cols-2 py-1"><div>&gt;50</div><div>Untestable, Very High Risk</div></div>
                </div>

                <div className="border border-black p-4 bg-gray-50 font-mono text-sm flex-1">
                  <div className="font-black text-xs uppercase tracking-widest mb-4 flex gap-2"><Info size={16}/> CC vs Bad Fix Probability</div>
                  <div className="grid grid-cols-2 font-bold mb-2 pb-2 border-b border-black">
                    <div>Complexity</div><div>Probability</div>
                  </div>
                  <div className="grid grid-cols-2 py-1"><div>1-10</div><div>5%</div></div>
                  <div className="grid grid-cols-2 py-1"><div>11-20</div><div>10%</div></div>
                  <div className="grid grid-cols-2 py-1"><div>21-30</div><div>20%</div></div>
                  <div className="grid grid-cols-2 py-1"><div>&gt;30</div><div>40%</div></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
