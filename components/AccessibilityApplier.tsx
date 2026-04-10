"use client";

import { useEffect } from "react";
import { useUserStore } from "@/lib/store";

export default function AccessibilityApplier() {
  const dimensione_testo = useUserStore((s) => s.dimensione_testo);
  const alto_contrasto   = useUserStore((s) => s.alto_contrasto);

  useEffect(() => {
    document.documentElement.setAttribute("data-font", dimensione_testo);
  }, [dimensione_testo]);

  useEffect(() => {
    document.documentElement.classList.toggle("alto-contrasto", alto_contrasto);
  }, [alto_contrasto]);

  return null;
}
