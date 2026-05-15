"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CartografoSession } from "@/components/esercizi/families/cartografo/CartografoSession";
import { MAX_LIVELLO } from "@/components/esercizi/families/cartografo/levels";

function CartografoInner() {
  const params = useSearchParams();
  const livelloParam = params.get("livello");
  const livello = livelloParam
    ? Math.max(1, Math.min(MAX_LIVELLO, parseInt(livelloParam, 10) || 1))
    : null;

  if (!livello) {
    return (
      <div className="min-h-screen bg-amber-100/40 flex items-center justify-center p-6">
        <div className="bg-amber-50 border-4 border-amber-200 rounded-3xl p-8 shadow-xl max-w-2xl w-full">
          <h1 className="text-4xl font-bold text-stone-800 text-center">
            Il Cartografo
          </h1>
          <p className="text-stone-700 text-center mt-2 text-lg">
            Scegli un livello per iniziare
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6">
            {Array.from({ length: MAX_LIVELLO }).map((_, i) => {
              const lv = i + 1;
              return (
                <a
                  key={lv}
                  href={`?livello=${lv}`}
                  className="bg-amber-500 hover:bg-amber-600 text-white text-xl font-bold py-5 rounded-2xl shadow-md text-center transition"
                >
                  {lv}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-100/40 py-4">
      <CartografoSession livello={livello} />
    </div>
  );
}

export default function CartografoDevPage() {
  return (
    <Suspense fallback={<div className="p-8 text-stone-600">Caricamento…</div>}>
      <CartografoInner />
    </Suspense>
  );
}
