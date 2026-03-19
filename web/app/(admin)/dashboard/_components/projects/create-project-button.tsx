"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectFormModal } from "./project-form-modal";

export function CreateProjectButton() {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsCreating(true)}
        className="glow-border text-background h-11 rounded-lg bg-emerald-500 px-6 font-mono text-xs font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:bg-emerald-600 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
      >
        <Plus className="mr-2 h-4 w-4" />
        Novo Módulo
      </Button>

      <ProjectFormModal
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        project={null}
      />
    </>
  );
}
