"use client";

import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export function TopNav() {
  const pathname = usePathname();
  const currentPath = pathname.split("/").pop() || "dashboard";
  const title = currentPath.charAt(0).toUpperCase() + currentPath.slice(1);

  return (
    <header className="border-border/40 glass-panel sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-[#050505]/70 px-6 shadow-xs backdrop-blur-xl md:px-10">
      {/* Breadcrumb Terminal Avançado */}
      <div className="bg-muted/10 border-border/30 flex items-center gap-2 rounded-md border px-3 py-1.5 font-mono text-[11px] tracking-widest uppercase">
        <span className="font-bold text-emerald-500">root@sys</span>
        <span className="text-muted-foreground/50">:</span>
        <span className="text-muted-foreground">~/admin</span>
        <ChevronRight className="text-muted-foreground/50 h-3 w-3" />
        <span className="text-foreground border-b border-emerald-500/50 pb-px font-bold">
          {title.toLowerCase()}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 shadow-inner">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span className="font-mono text-[10px] font-bold tracking-widest text-emerald-500 uppercase">
            Cluster Online
          </span>
        </div>
      </div>
    </header>
  );
}
