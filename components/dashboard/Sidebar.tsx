"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Ruler, Link as LinkIcon, Briefcase, DollarSign, Award, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, active: true },
  { name: "Product Size Metrics", href: "/dashboard/product-size", icon: Ruler, active: true },
  { name: "Coupling Metrics", href: "/dashboard/coupling", icon: LinkIcon, active: true },
  { name: "Effort Metrics", href: "#", icon: Briefcase, active: false },
  { name: "Cost Metrics", href: "#", icon: DollarSign, active: false },
  { name: "Quality Metrics", href: "#", icon: Award, active: false },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-white border border-black text-black shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-black flex flex-col transform transition-transform duration-300 md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 border-b border-black">
          <Link href="/" className="text-2xl font-black tracking-tight" onClick={() => setIsOpen(false)}>
            Katydids.
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <div key={item.name}>
              {item.active ? (
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 transition-colors border ${
                    isActive 
                      ? "bg-black text-white border-black" 
                      : "bg-white text-black border-transparent hover:border-black hover:bg-gray-100"
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              ) : (
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 text-gray-400 border border-transparent cursor-not-allowed">
                  <div className="flex items-center gap-3">
                    <item.icon size={20} />
                    <span className="font-medium text-sm">{item.name}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold bg-white text-gray-500 px-2 py-1 border border-gray-300">
                    Sprint 2
                  </span>
                </div>
              )}
              </div>
            );
          })}
        </nav>
      </aside>

      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/5 z-30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
