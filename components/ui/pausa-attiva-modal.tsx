"use client";

import Link from "next/link";
import Btn from "@/components/ui/btn";
import { COLORS } from "@/lib/design-tokens";
import { Running } from "iconoir-react";

const LIMITE_ESERCIZI_GIORNO = 5;

export function CheckCircles() {
  return (
    <div className="flex gap-3">
      {Array.from({ length: LIMITE_ESERCIZI_GIORNO }).map((_, i) => (
        <div key={i} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.primary }}>
          <svg className="w-4 h-4" fill="white" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      ))}
    </div>
  );
}

interface PausaAttivaModalProps {
  nome: string;
  isGuest: boolean;
  onVaiPausa: () => void;
  onContinua: () => void;
  onClose: () => void;
}

export function PausaAttivaModal({ nome, isGuest, onVaiPausa, onContinua, onClose }: PausaAttivaModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-6"
      style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl px-6 pt-4 pb-6 flex flex-col items-center gap-4"
        style={{ backgroundColor: "#FFFFFF" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full" style={{ backgroundColor: "#D1D5DB" }} />

        <>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: COLORS.primary }}>
            <Running width={28} height={28} strokeWidth={1.5} color="#FFFFFF" />
          </div>
          <h2 className="text-xl font-extrabold text-ink text-center">
            {isGuest ? "Ottimo! 5 esercizi fatti" : `Ottimo lavoro, ${nome}!`}
          </h2>
          <p className="text-sm text-center" style={{ color: COLORS.inkSecondary }}>
            {isGuest ? (
              <>Stai allenando bene la mente.<br />Non perdere questi progressi.</>
            ) : (
              <>Hai completato {LIMITE_ESERCIZI_GIORNO} esercizi oggi.<br />La mente ora ha bisogno di consolidare.<br />Prenditi una pausa!</>
            )}
          </p>
          <CheckCircles />
          {isGuest ? (
            <Link href="/onboarding/registrati" className="w-full">
              <button className="w-full py-3 rounded-full text-sm font-bold text-white" style={{ backgroundColor: COLORS.primary }}>
                Registrati e salva i tuoi progressi
              </button>
            </Link>
          ) : (
            <Btn size="lg" className="w-full" onClick={onVaiPausa}>Vai alla pausa attiva</Btn>
          )}
          <button className="text-sm font-semibold" style={{ color: COLORS.primary }} onClick={onContinua}>
            Continua comunque
          </button>
        </>
      </div>
    </div>
  );
}
