"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { COLORS } from "@/lib/design-tokens";
import { mockMessaggiFamiliari } from "@/lib/mock-data";
import { useUserStore } from "@/lib/store";
import { ArrowLeft } from "iconoir-react";

const RELAZIONE_STYLE: Record<string, { bg: string; text: string }> = {
  Figlio:  { bg: "#E8F0FE", text: "#3B5998" },
  Figlia:  { bg: "#FCE4EC", text: "#C2185B" },
  Nipote:  { bg: "#E0F7FA", text: "#00838F" },
};

export default function MessaggiPage() {
  const router = useRouter();
  const isGuest = useUserStore((s) => s.isGuest);
  const messaggi = mockMessaggiFamiliari;

  useEffect(() => {
    if (isGuest) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isGuest]);

  return (
    <div
      className="flex flex-col px-4 pt-6 gap-6"
      style={isGuest ? { overflow: "hidden", height: "100dvh" } : undefined}
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <button
          onClick={() => router.push("/home")}
          className="flex items-center gap-2 text-sm font-semibold"
          style={{ color: COLORS.primary }}
        >
          <ArrowLeft width={20} height={20} strokeWidth={1.5} color={COLORS.primary} />
          Torna alla home
        </button>
      </div>

      <h1 className="text-2xl font-extrabold text-ink -mt-2 flex-shrink-0">I tuoi messaggi</h1>

      {/* Lista messaggi + overlay */}
      <div className="relative flex-1 rounded-2xl overflow-hidden" style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
        {messaggi.map((msg, i) => {
          const relStyle = RELAZIONE_STYLE[msg.relazione] ?? { bg: COLORS.primaryLight, text: COLORS.primary };
          return (
            <div key={msg.id}>
              <div className="px-4 py-4 flex flex-col gap-1.5" style={!msg.letto ? { backgroundColor: "#C8E9F2" } : undefined}>
                <div className="flex items-center gap-2">
                  {!msg.letto && (
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: "#16A34A" }} />
                  )}
                  <span className="font-bold text-ink text-sm">{msg.mittente}</span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: relStyle.bg, color: relStyle.text }}
                  >
                    {msg.relazione}
                  </span>
                  <span className="ml-auto text-xs" style={{ color: COLORS.inkMuted }}>{msg.data}</span>
                </div>
                <p className="text-sm truncate" style={{ color: COLORS.inkSecondary }}>
                  {msg.testo}
                </p>
              </div>
              {i < messaggi.length - 1 && (
                <div style={{ height: 1, backgroundColor: COLORS.border }} />
              )}
            </div>
          );
        })}

        {/* Overlay upsell — solo ospite */}
        {isGuest && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6"
            style={{ backdropFilter: "blur(10px)", background: "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.1))" }}
          >
            <div
              className="w-32 h-32 rounded-full"
              style={{ backgroundColor: COLORS.primary }}
            />
            <p className="text-lg font-bold text-ink text-center">
              Sblocca la tua esperienza completa
            </p>
            <Link href="/onboarding/registrati" className="w-full">
              <button
                className="w-full py-3 rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: COLORS.primary }}
              >
                Registrati gratuitamente
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
