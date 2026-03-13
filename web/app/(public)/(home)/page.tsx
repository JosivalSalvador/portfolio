"use client";

import { GridBackground } from "@/components/ui/grid-background";

export default function PublicHomePage() {
  return (
    <div className="selection:bg-primary/30 relative flex min-h-screen flex-col">
      <div className="pointer-events-none absolute inset-0 z-0">
        <GridBackground />
      </div>

      <main className="relative z-10 container mx-auto flex-1 px-4 py-8 sm:px-6 md:py-12 lg:px-8 lg:py-16"></main>
    </div>
  );
}
