import { describe, it, expect } from "vitest";
import {
  calcolaProgressione,
  statoIniziale,
  LIVELLO_MIN,
  LIVELLO_MAX,
  type UserLevelStato,
} from "../progression";

// Helper: stato base a livello 5 con finestra vuota
function stato(
  livello_corrente: number,
  ultime_accuratezze: number[] = [],
  sessioni_sotto_60_consecutive = 0
): UserLevelStato {
  return { livello_corrente, ultime_accuratezze, sessioni_sotto_60_consecutive };
}

describe("calcolaProgressione", () => {
  // ── Caso 1 ────────────────────────────────────────────────────────────────────
  it("finestra vuota + sessione 90% → accumulo, finestra=[0.90], livello invariato", () => {
    const r = calcolaProgressione(stato(5), 0.90);
    expect(r.evento).toBe("accumulo");
    expect(r.ultime_accuratezze).toEqual([0.90]);
    expect(r.livello_corrente).toBe(5);
    expect(r.sessioni_sotto_60_consecutive).toBe(0);
  });

  // ── Caso 2 ────────────────────────────────────────────────────────────────────
  it("finestra=[0.90, 0.85] + sessione 95% → promozione, finestra azzerata, livello+1", () => {
    const r = calcolaProgressione(stato(5, [0.90, 0.85]), 0.95);
    expect(r.evento).toBe("promozione");
    expect(r.ultime_accuratezze).toEqual([]);
    expect(r.livello_corrente).toBe(6);
    expect(r.sessioni_sotto_60_consecutive).toBe(0);
  });

  // ── Caso 3 ────────────────────────────────────────────────────────────────────
  // Sessioni accumulate: 1.00 → 0.40 → (arrivo) 1.00
  // Lo 0.40 non triggera retrocessione perché è il primo sotto-60.
  // A finestra piena [1.00, 0.40, 1.00]: almeno uno < 80% → mantenimento.
  it("sequenza 1.00 → 0.40 → 1.00: finestra piena con 0.40 < 80% → mantenimento, finestra azzerata", () => {
    const s1 = calcolaProgressione(stato(5), 1.00);
    expect(s1.evento).toBe("accumulo");

    const s2 = calcolaProgressione(s1, 0.40);
    // 0.40 < 0.60 → sotto60 = 1, ma < 2 → no retrocessione
    expect(s2.evento).toBe("accumulo");
    expect(s2.sessioni_sotto_60_consecutive).toBe(1);

    const s3 = calcolaProgressione(s2, 1.00);
    // 1.00 >= 0.60 → sotto60 reset a 0; finestra=[1.00, 0.40, 1.00] → 0.40 < 0.80 → mantenimento
    expect(s3.evento).toBe("mantenimento");
    expect(s3.ultime_accuratezze).toEqual([]);
    expect(s3.livello_corrente).toBe(5);
    expect(s3.sessioni_sotto_60_consecutive).toBe(0);
  });

  // ── Caso 4 ────────────────────────────────────────────────────────────────────
  // Stato intermedio [0.90, 0.50] con sotto60=1: nessuna chiamata aggiuntiva.
  // Verifica che lo stato sia consistente (sessioni_sotto_60_consecutive=1 dopo 0.50).
  it("stato intermedio [0.90, 0.50]: sotto60=1, finestra=[0.90, 0.50], livello invariato (in attesa)", () => {
    const s1 = calcolaProgressione(stato(5), 0.90);
    const s2 = calcolaProgressione(s1, 0.50);
    // Nessuna nuova sessione — verifichiamo solo lo stato accumulato
    expect(s2.evento).toBe("accumulo");
    expect(s2.ultime_accuratezze).toEqual([0.90, 0.50]);
    expect(s2.sessioni_sotto_60_consecutive).toBe(1);
    expect(s2.livello_corrente).toBe(5);
  });

  // ── Caso 5 ────────────────────────────────────────────────────────────────────
  it("prima sessione 50%: sotto60=1, evento accumulo, livello invariato", () => {
    const r = calcolaProgressione(stato(5), 0.50);
    expect(r.evento).toBe("accumulo");
    expect(r.sessioni_sotto_60_consecutive).toBe(1);
    expect(r.livello_corrente).toBe(5);
    expect(r.ultime_accuratezze).toEqual([0.50]);
  });

  // ── Caso 6 ────────────────────────────────────────────────────────────────────
  it("sotto60=1 + nuova sessione 50% → retrocessione, livello−1, tutto azzerato", () => {
    const r = calcolaProgressione(stato(5, [], 1), 0.50);
    expect(r.evento).toBe("retrocessione");
    expect(r.livello_corrente).toBe(4);
    expect(r.ultime_accuratezze).toEqual([]);
    expect(r.sessioni_sotto_60_consecutive).toBe(0);
  });

  // ── Caso 7 (CRITICO) ─────────────────────────────────────────────────────────
  // sotto60=1 → sessione 70% (>=60%, RESET contatore) → sessione 50% (<60%)
  // Atteso: dopo la terza sessione sotto60=1, NON 2. Nessuna retrocessione.
  it("[CRITICO] sotto60=1 → 70% (reset) → 50%: sotto60 torna a 1, NO retrocessione", () => {
    const s_dopo_70 = calcolaProgressione(stato(5, [], 1), 0.70);
    expect(s_dopo_70.evento).toBe("accumulo");
    expect(s_dopo_70.sessioni_sotto_60_consecutive).toBe(0); // reset!
    expect(s_dopo_70.livello_corrente).toBe(5);

    const s_dopo_50 = calcolaProgressione(s_dopo_70, 0.50);
    expect(s_dopo_50.evento).toBe("accumulo");
    expect(s_dopo_50.sessioni_sotto_60_consecutive).toBe(1); // riparte da 1, non 2
    expect(s_dopo_50.livello_corrente).toBe(5);            // nessuna retrocessione
  });

  // ── Caso 8 ────────────────────────────────────────────────────────────────────
  it("livello 1 + retrocessione → resta a 1 (floor)", () => {
    const r = calcolaProgressione(stato(LIVELLO_MIN, [], 1), 0.50);
    expect(r.evento).toBe("retrocessione");
    expect(r.livello_corrente).toBe(LIVELLO_MIN); // Math.max(1, 0) = 1
  });

  // ── Caso 9 ────────────────────────────────────────────────────────────────────
  it("livello 20 + promozione → resta a 20 (ceiling), finestra azzerata", () => {
    const r = calcolaProgressione(stato(LIVELLO_MAX, [0.90, 0.85]), 0.95);
    expect(r.evento).toBe("promozione");
    expect(r.livello_corrente).toBe(LIVELLO_MAX); // Math.min(20, 21) = 20
    expect(r.ultime_accuratezze).toEqual([]);
  });

  // ── Caso 10 ───────────────────────────────────────────────────────────────────
  it("livello 20 + 2 sessioni consecutive <60% → retrocede a 19", () => {
    const r = calcolaProgressione(stato(LIVELLO_MAX, [], 1), 0.50);
    expect(r.evento).toBe("retrocessione");
    expect(r.livello_corrente).toBe(19);
    expect(r.sessioni_sotto_60_consecutive).toBe(0);
  });
});

// ── statoIniziale ─────────────────────────────────────────────────────────────
describe("statoIniziale", () => {
  it("restituisce livello 1, finestra vuota, sotto60=0", () => {
    const s = statoIniziale();
    expect(s.livello_corrente).toBe(LIVELLO_MIN);
    expect(s.ultime_accuratezze).toEqual([]);
    expect(s.sessioni_sotto_60_consecutive).toBe(0);
  });
});
