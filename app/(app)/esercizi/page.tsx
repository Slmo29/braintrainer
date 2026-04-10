"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/card";
import { mockEsercizi, mockCategorie, mockScoreCategorie } from "@/lib/mock-data";
import { CATEGORIA_COLORS, COLORS } from "@/lib/design-tokens";
import { AppIcon } from "@/lib/icons";
import { Timer, Lock } from "iconoir-react";
import { useUserStore } from "@/lib/store";
import { PausaAttivaModal } from "@/components/ui/pausa-attiva-modal";

const LIMITE_ESERCIZI_GIORNO = 5;

const TABS = [
  { id: "memoria",    label: "Memoria" },
  { id: "attenzione", label: "Attenzione" },
  { id: "linguaggio", label: "Linguaggio" },
];

export default function EserciziPage() {
  const router = useRouter();
  const { nome, isGuest, eserciziFattiOggi, setPausaAttivaRichiesta } = useUserStore();
  const [tab, setTab] = useState("memoria");
  const [mostraPausa, setMostraPausa] = useState(false);
  const [esercizioTarget, setEsercizioTarget] = useState<string | null>(null);

  // TODO: sostituire con query Supabase — SELECT livello FROM progressi_utente WHERE categoria = tab AND user_id = ...
  const livelloUtente = mockScoreCategorie.find((c) => c.categoria.toLowerCase() === tab)?.livello ?? 1;

  const eserciziFiltrati = mockEsercizi
    .filter((e) => e.categoria_id === tab)
    .filter((e) => isGuest || e.livello <= livelloUtente);

  function isLocked(livello: number): boolean {
    if (isGuest) return livello > 1;
    return false; // registrato vede solo esercizi già sbloccati, tutti accessibili
  }

  function handleClickEsercizio(id: string, locked: boolean) {
    if (locked) return;
    if (eserciziFattiOggi >= LIMITE_ESERCIZI_GIORNO) {
      setEsercizioTarget(id);
      setMostraPausa(true);
    } else {
      router.push(`/esercizi/${id}`);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Header + Tabs ────────────────────────────────────────────── */}
      <div className="bg-surface px-4 pt-6 pb-0 sticky top-0 z-10 shadow-card">
        <h1 className="text-2xl font-extrabold text-ink">Libreria esercizi</h1>

        {/* Tab bar */}
        <div className="flex mt-4 overflow-x-auto scrollbar-none -mx-4 px-4">
          {TABS.map((t) => {
            const active = tab === t.id;
            const cc = CATEGORIA_COLORS[t.id];
            const cat = mockCategorie.find((c) => c.id === t.id);
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-3 text-base font-semibold border-b-2 transition-all mr-1"
                style={{
                  borderColor: active ? COLORS.primary : "transparent",
                  color: active ? COLORS.primary : COLORS.inkMuted,
                }}
              >
                {cat && (
                  <AppIcon
                    name={cat.icona}
                    size={18}
                    color={active ? COLORS.primary : COLORS.inkMuted}
                  />
                )}
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Lista esercizi ───────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 px-4 pt-4">
        {eserciziFiltrati.map((esercizio) => {
          const cat = mockCategorie.find((c) => c.id === esercizio.categoria_id);
          const cc = cat ? CATEGORIA_COLORS[cat.id] : null;
          const locked = isLocked(esercizio.livello);

          return (
            <button
              key={esercizio.id}
              className="text-left w-full"
              onClick={() => handleClickEsercizio(esercizio.id, locked)}
            >
              <Card padding="md" className={locked ? "opacity-70" : "active:scale-[0.98] transition-transform"}>
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: locked ? COLORS.background : (cc?.bg ?? COLORS.surfaceAlt) }}
                  >
                    {locked ? (
                      <Lock width={28} height={28} strokeWidth={1.5} color={COLORS.inkMuted} />
                    ) : (
                      <AppIcon name={cat?.icona ?? "brain"} size={32} color={cc?.text ?? COLORS.primary} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold leading-snug" style={{ color: locked ? COLORS.inkMuted : COLORS.inkPrimary }}>{esercizio.titolo}</h3>
                    <div className="flex items-center gap-1 text-xs" style={{ color: COLORS.inkMuted }}>
                      <Timer width={14} height={14} strokeWidth={1.5} color={COLORS.inkMuted} />
                      <span>{Math.ceil((esercizio.durata_stimata ?? 60) / 60)} minuti</span>
                      <span>·</span>
                      <span>Livello {esercizio.livello}/6</span>
                    </div>
                    {locked && (
                      <p className="text-xs font-semibold mt-1" style={{ color: COLORS.primary }}>
                        Registrati per sbloccare
                      </p>
                    )}
                  </div>
                  {locked
                    ? <Lock width={18} height={18} strokeWidth={1.5} color={COLORS.inkMuted} className="flex-shrink-0" />
                    : <span className="text-ink-muted text-xl flex-shrink-0">›</span>
                  }
                </div>
              </Card>
            </button>
          );
        })}
      </div>

      {/* Modal pausa attiva */}
      {mostraPausa && (
        <PausaAttivaModal
          nome={nome ?? ""}
          isGuest={isGuest}
          onVaiPausa={() => {
            setMostraPausa(false);
            setPausaAttivaRichiesta(true);
            router.push("/home");
          }}
          onContinua={() => {
            setMostraPausa(false);
            if (esercizioTarget) router.push(`/esercizi/${esercizioTarget}`);
          }}
          onClose={() => setMostraPausa(false)}
        />
      )}
    </div>
  );
}
