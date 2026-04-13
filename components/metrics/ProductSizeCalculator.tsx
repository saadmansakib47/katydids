"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info, ChevronDown, ChevronUp } from "lucide-react";

const Input = ({ label, value, onChange, min = "0", max, step = "1" }: unknown) => (
  <div className="flex flex-col space-y-2 font-mono">
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
  const [tdi, setTdi] = useState<number>(35); // 0-70 max usually, simplified representing the sum
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

  const tabs = [
    { id: "basic", label: "Basic Metrics" },
    { id: "halstead", label: "Halstead Metrics" },
    { id: "fpa", label: "FPA" },
    { id: "cc", label: "Cyclomatic Complexity" },
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
        {activeTab === "basic" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-black bg-gray-50">
              <Input label="Total LOC" value={loc} onChange={setLoc} />
              <Input label="Comment LOC (CLOC)" value={cloc} onChange={setCloc} />
              <Input label="LOC (Lang 1)" value={locL1} onChange={setLocL1} />
              <Input label="LOC (Lang 2)" value={locL2} onChange={setLocL2} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ResultCard 
                title="Comment Density" 
                value={(commentDensity * 100).toFixed(1) + "%"} 
                comment={commentDensity > 0.2 ? "Good maintainability 🎯" : "More comments needed ⚠️"} 
                good={commentDensity > 0.2}
              />
              <ResultCard 
                title="NCLOC" 
                value={ncloc} 
                comment="Non-comment source code defining active logic." 
              />
              <ResultCard 
                title="Language Growth Factor" 
                value={lgf.toFixed(2)} 
                comment="LGF ratio between Lang 1 and Lang 2." 
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
                <div className="mt-4 border border-black p-4 bg-gray-50 font-mono text-sm max-w-md">
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
              <Input label="Unique Operators (n1)" value={n1} onChange={setN1} />
              <Input label="Unique Operands (n2)" value={n2} onChange={setN2} />
              <Input label="Total Operators (N1)" value={N1} onChange={setCapN1} />
              <Input label="Total Operands (N2)" value={N2} onChange={setCapN2} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ResultCard title="Vocabulary (n)" value={halstead_n} comment="Total unique symbols used." />
              <ResultCard title="Program Length (N)" value={halstead_N} comment="Total symbols used." />
              <ResultCard title="Volume (V)" value={halstead_V.toFixed(2)} comment="Size of the implementation." />
              <ResultCard title="Difficulty (D)" value={halstead_D.toFixed(2)} comment={halstead_D > 15 ? "High complexity/difficulty ⚠️" : "Manageable difficulty ✅"} good={halstead_D <= 15} />
              <ResultCard title="Effort (E)" value={halstead_E.toFixed(2)} comment="Proportional to mental effort to recreate." />
            </div>
          </div>
        )}

        {activeTab === "fpa" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="border border-black bg-gray-50 p-6">
              <h3 className="font-bold text-lg mb-4 uppercase tracking-widest border-b border-black pb-2">Function Count & Weights</h3>
              <div className="grid gap-6">
                {(Object.keys(fpa) as Array<keyof typeof fpa>).map(k => (
                  <div key={k} className="flex flex-col sm:flex-row gap-4 items-center sm:items-end">
                    <Input label={k.toUpperCase()} value={fpa[k].count} onChange={(val: number) => setFpa(p => ({...p, [k]: { ...p[k], count: val }}))} />
                    <div className="flex flex-col space-y-2 font-mono">
                      <label className="text-xs font-bold uppercase tracking-wider">Weight</label>
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
              <Input label="Total Degree of Influence (TDI 0-70)" value={tdi} onChange={setTdi} min="0" max="70" />
              <div className="text-sm font-mono text-gray-600 max-w-sm">Sum of 14 system characteristics (0-5 each). Calculate TDI.</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ResultCard title="Unadjusted Function Point (UFP)" value={ufp} comment="Base function points." />
              <ResultCard title="Value Adjustment Factor (VAF)" value={vaf.toFixed(2)} comment="Derived from TDI." />
              <ResultCard title="Adjusted Function Point (AFP)" value={afp.toFixed(2)} comment="Final FPA evaluation 🚀" good={true} />
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
                <div className="mt-4 border border-black p-4 bg-gray-50 font-mono text-sm max-w-lg">
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
              <Input label="LOC (for density)" value={loc} onChange={setLoc} />
              {ccMode === "edges" ? (
                <>
                  <Input label="Edges (e)" value={e} onChange={setE} />
                  <Input label="Vertices (n)" value={n} onChange={setN} />
                  <Input label="Connected Components (P)" value={P} onChange={setP} />
                </>
              ) : (
                <>
                  <Input label="Decision Nodes (d)" value={d} onChange={setD} />
                  <Input label="Connected Components (P)" value={P} onChange={setP} />
                </>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResultCard 
                title="Cyclomatic Complexity V(G)" 
                value={cc} 
                comment={cc <= 10 ? "Simple, high testability 🚀" : cc <= 20 ? "Moderate risk ⚠️" : "Complex, high cost & effort ❌"} 
                good={cc <= 10 ? true : cc <= 20 ? undefined : false}
              />
              <ResultCard 
                title="Complexity Density (CCD)" 
                value={ccd.toFixed(4)} 
                comment={ccd < 0.14 ? "Lower CCD, higher maintenance productivity ✅" : "High CCD, difficult maintenance ⚠️"} 
                good={ccd < 0.14}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="border border-black p-4 bg-gray-50 font-mono text-sm flex-1">
                  <div className="font-black text-xs uppercase tracking-widest mb-4">Classification & Impact</div>
                  <div className="grid grid-cols-2 font-bold mb-2 pb-2 border-b border-black">
                    <div>Complexity</div><div>Evaluation</div>
                  </div>
                  <div className="grid grid-cols-2 py-1"><div>1-10</div><div>Simple, Low Risk</div></div>
                  <div className="grid grid-cols-2 py-1"><div>11-20</div><div>More Complex, Moderate Risk</div></div>
                  <div className="grid grid-cols-2 py-1"><div>21-50</div><div>Complex, High Risk</div></div>
                  <div className="grid grid-cols-2 py-1"><div>&gt;50</div><div>Untestable, Very High Risk</div></div>
                </div>

                <div className="border border-black p-4 bg-gray-50 font-mono text-sm flex-1">
                  <div className="font-black text-xs uppercase tracking-widest mb-4">CC vs Bad Fix Probability</div>
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
