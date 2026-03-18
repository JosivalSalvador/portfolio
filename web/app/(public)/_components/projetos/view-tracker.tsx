"use client";

import { useEffect, useRef } from "react";
import { useProjectsMutations } from "@/hooks/use-projects";

interface ViewTrackerProps {
  slug: string;
}

export function ViewTracker({ slug }: ViewTrackerProps) {
  const { incrementViews } = useProjectsMutations();
  const hasTracked = useRef(false);

  useEffect(() => {
    // Garante disparo único por montagem do componente (previne o dobro do React Strict Mode)
    if (!hasTracked.current) {
      hasTracked.current = true;

      // Fire and forget: dispara a mutação em background
      incrementViews.mutate(slug);
    }
  }, [slug, incrementViews]);

  // Componente headless absoluto (Não renderiza nada na DOM)
  return null;
}
