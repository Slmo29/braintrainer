/**
 * scripts/smoke-test-db.mts
 *
 * Smoke test Layer 1 — DB shape e prep state per Flanker e Stroop.
 *
 * COPRE:
 *   - Shape contract tabella sessioni: metriche JSONB 6 campi, accuratezza int 0-100, durata > 0
 *   - Query reset pre-smoke (R1–R3) e verifica idempotenza
 *   - Prep stato S8 (livello 11), S9 (livello 13), S10 (livello 13 + sessione fittizia lv 10)
 *   - Verifica che fetchUltimoLivelloEsercizio restituisca livello 10 dopo S10 prep
 *   - Cleanup finale verificato con exit code 2 su fallimento
 *
 * NON COPRE:
 *   - Logica aggiornaProgressione (lib/sync.ts, chiamata da page.tsx onComplete — Layer 2)
 *   - Logica aggiornaStreak (idem — nessun DB trigger, logica applicativa pura)
 *   - UI flow, rendering componenti, tutorial, warning overlay (Layer 2 — Playwright)
 *   - Race condition doppia risposta S12 (Layer 2)
 *
 * LIMITE ESPLICITO: gli INSERT diretti bypassano onComplete in lib/sync.ts.
 * user_levels.ultime_accuratezze e users.current_streak non vengono aggiornati
 * da questo script — è by design. I check F5/F6 verificano solo che lo stato
 * non sia stato corrotto, NON la logica di progressione o streak.
 *
 * Uso:
 *   npx tsx scripts/smoke-test-db.mts --user-email=tua@email.test
 *   npx tsx scripts/smoke-test-db.mts --user-email=reale@prod.it --i-know-what-im-doing
 *
 * Exit codes:
 *   0 — tutti i check verdi
 *   1 — almeno 1 check rosso
 *   2 — cleanup finale fallito (DB potrebbe essere in stato sporco)
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

// ── Costanti ──────────────────────────────────────────────────────────────────

const ESERCIZI_TEST = ["flanker_frecce", "stroop_classico"] as const;
const CATEGORIA = "esecutive";
const METRICHE_KEYS = [
  "congruenti_totali",
  "incongruenti_totali",
  "congruenti_errori",
  "incongruenti_errori",
  "tempo_totale_congruenti_ms",
  "tempo_totale_incongruenti_ms",
] as const;

// ── Env loader ────────────────────────────────────────────────────────────────

function loadEnvLocal(): Record<string, string> {
  const path = resolve(process.cwd(), ".env.local");
  let content: string;
  try {
    content = readFileSync(path, "utf-8");
  } catch {
    console.error("[setup] ERRORE: .env.local non trovato in", process.cwd());
    process.exit(1);
  }
  const env: Record<string, string> = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const raw = trimmed.slice(eqIdx + 1).trim();
    env[key] = raw.replace(/^["']|["']$/g, "");
  }
  return env;
}

// ── Arg parser ────────────────────────────────────────────────────────────────

function parseArgs(): { email: string; override: boolean } {
  const args = process.argv.slice(2);
  const emailArg = args.find((a) => a.startsWith("--user-email="));
  const override = args.includes("--i-know-what-im-doing");
  if (!emailArg) {
    console.error("Uso: npx tsx scripts/smoke-test-db.mts --user-email=tua@email.test");
    process.exit(1);
  }
  return { email: emailArg.slice("--user-email=".length), override };
}

// ── Safety guard ──────────────────────────────────────────────────────────────

const TEST_PATTERNS = [/test/i, /smoke/i, /@example\./i, /\.test$/, /\.local$/, /localhost/i];

function checkEmailSafety(email: string, override: boolean): void {
  const looksLikeTest = TEST_PATTERNS.some((p) => p.test(email));
  if (!looksLikeTest && !override) {
    console.error(
      `REFUSED: "${email}" non sembra un indirizzo di test.\n` +
      `Se sai quello che fai, rilancia con --i-know-what-im-doing.`
    );
    process.exit(1);
  }
}

// ── Logger ────────────────────────────────────────────────────────────────────

const PAD = 14;

function ok(step: string, msg: string): void {
  console.log(`[${step.padEnd(PAD)}] 🟢 ${msg}`);
}

function fail(step: string, msg: string): void {
  console.log(`[${step.padEnd(PAD)}] 🔴 ${msg}`);
}

// ── Step runner ───────────────────────────────────────────────────────────────

let failedSteps = 0;

async function step(
  label: string,
  fn: () => Promise<string>
): Promise<boolean> {
  try {
    const msg = await fn();
    ok(label, msg);
    return true;
  } catch (e) {
    fail(label, e instanceof Error ? e.message : String(e));
    failedSteps++;
    return false;
  }
}

// ── Metriche shape validator ──────────────────────────────────────────────────

function validateMetricheShape(metriche: unknown): void {
  if (!metriche || typeof metriche !== "object") {
    throw new Error("metriche è null o non è un oggetto");
  }
  const m = metriche as Record<string, unknown>;
  for (const key of METRICHE_KEYS) {
    if (!(key in m)) throw new Error(`metriche manca il campo "${key}"`);
    if (typeof m[key] !== "number") throw new Error(`metriche.${key} non è number (trovato: ${typeof m[key]})`);
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const { email, override } = parseArgs();
  checkEmailSafety(email, override);

  const env = loadEnvLocal();
  const supabaseUrl = env["NEXT_PUBLIC_SUPABASE_URL"];
  const serviceKey  = env["SUPABASE_SERVICE_ROLE_KEY"];

  if (!supabaseUrl || !serviceKey) {
    console.error(
      "[setup] ERRORE: NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY mancanti in .env.local"
    );
    process.exit(1);
  }

  const sb: SupabaseClient = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  // ── 1. Setup: lookup user_id ────────────────────────────────────────────────

  let userId: string | undefined;

  await step("setup", async () => {
    const { data, error } = await sb
      .from("users")
      .select("id")
      .eq("email", email)
      .limit(1)
      .single();
    if (error || !data) {
      throw new Error(`utente non trovato per email "${email}"`);
    }
    userId = data.id as string;
    return `user_id = ${userId}`;
  });

  if (!userId) {
    console.error("[setup] userId non disponibile dopo lookup");
    process.exit(1);
  }

  // Se setup fallisce non possiamo continuare
  if (failedSteps > 0) process.exit(1);

  // ── 2. Reset pre-smoke (R1–R3) ──────────────────────────────────────────────

  await step("R1-R3", async () => {
    // R1: cancella sessioni test
    const { error: delErr } = await sb
      .from("sessioni")
      .delete()
      .eq("user_id", userId)
      .in("esercizio_id", ESERCIZI_TEST);
    if (delErr) throw new Error(`DELETE sessioni: ${delErr.message}`);

    // R2: azzera livello e progressione (NON tocca streak)
    const { error: updErr } = await sb
      .from("user_levels")
      .update({
        livello_corrente:              1,
        ultime_accuratezze:            [],
        sessioni_sotto_60_consecutive: 0,
      })
      .eq("user_id", userId)
      .eq("categoria_id", CATEGORIA);
    if (updErr) throw new Error(`UPDATE user_levels: ${updErr.message}`);

    // R3: verifica
    const { count } = await sb
      .from("sessioni")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .in("esercizio_id", ESERCIZI_TEST);
    if ((count ?? 0) !== 0) throw new Error(`sessioni rimaste dopo reset: ${count}`);

    const { data: lvl, error: lvlErr } = await sb
      .from("user_levels")
      .select("livello_corrente, ultime_accuratezze, sessioni_sotto_60_consecutive")
      .eq("user_id", userId)
      .eq("categoria_id", CATEGORIA)
      .single();
    if (lvlErr || !lvl) throw new Error(`lettura user_levels post-reset: ${lvlErr?.message}`);
    if (lvl.livello_corrente !== 1) throw new Error(`livello_corrente atteso 1, trovato ${lvl.livello_corrente}`);
    const acc = (lvl.ultime_accuratezze as unknown[]) ?? [];
    if (acc.length !== 0) throw new Error(`ultime_accuratezze non vuoto dopo reset: ${JSON.stringify(acc)}`);

    return "reset pre-smoke completato";
  });

  // ── 3. F4: INSERT sessione Flanker + validazione shape ──────────────────────

  let flankerSessionId: string | null = null;

  await step("F4", async () => {
    const metriche = {
      congruenti_totali:            22,
      incongruenti_totali:          8,
      congruenti_errori:            2,
      incongruenti_errori:          2,
      tempo_totale_congruenti_ms:   12000,
      tempo_totale_incongruenti_ms: 5500,
    };

    const { data, error } = await sb
      .from("sessioni")
      .insert({
        user_id:      userId,
        esercizio_id: "flanker_frecce",
        categoria_id: CATEGORIA,
        livello:      1,
        score:        78,
        accuratezza:  87,
        durata:       90,
        completato:   true,
        metriche,
      })
      .select("id, accuratezza, durata, metriche")
      .single();

    if (error || !data) throw new Error(`INSERT Flanker: ${error?.message}`);

    flankerSessionId = data.id as string;

    // Shape validation
    const acc = data.accuratezza as number;
    if (!Number.isInteger(acc) || acc < 0 || acc > 100) {
      throw new Error(`accuratezza fuori range o non intero: ${acc}`);
    }
    if ((data.durata as number) <= 0) {
      throw new Error(`durata non positiva: ${data.durata}`);
    }
    validateMetricheShape(data.metriche);

    return "INSERT Flanker + 6 metriche shape OK";
  });

  // ── 4. S4: INSERT sessione Stroop + validazione shape ──────────────────────

  let stroopSessionId: string | null = null;

  await step("S4", async () => {
    const metriche = {
      congruenti_totali:            18,
      incongruenti_totali:          7,
      congruenti_errori:            2,
      incongruenti_errori:          3,
      tempo_totale_congruenti_ms:   13500,
      tempo_totale_incongruenti_ms: 6200,
    };

    const { data, error } = await sb
      .from("sessioni")
      .insert({
        user_id:      userId,
        esercizio_id: "stroop_classico",
        categoria_id: CATEGORIA,
        livello:      1,
        score:        72,
        accuratezza:  80,
        durata:       90,
        completato:   true,
        metriche,
      })
      .select("id, accuratezza, durata, metriche")
      .single();

    if (error || !data) throw new Error(`INSERT Stroop: ${error?.message}`);

    stroopSessionId = data.id as string;

    const acc = data.accuratezza as number;
    if (!Number.isInteger(acc) || acc < 0 || acc > 100) {
      throw new Error(`accuratezza fuori range o non intero: ${acc}`);
    }
    if ((data.durata as number) <= 0) {
      throw new Error(`durata non positiva: ${data.durata}`);
    }
    validateMetricheShape(data.metriche);

    return "INSERT Stroop + 6 metriche shape OK";
  });

  // ── 5. F5: verifica user_levels integrità (logica progressione NON testata) ─

  await step("F5", async () => {
    const { data, error } = await sb
      .from("user_levels")
      .select("livello_corrente, ultime_accuratezze, sessioni_sotto_60_consecutive")
      .eq("user_id", userId)
      .eq("categoria_id", CATEGORIA)
      .single();

    if (error || !data) throw new Error(`lettura user_levels: ${error?.message}`);

    // INSERT diretto bypassa aggiornaProgressione — livello deve essere ancora 1
    if (data.livello_corrente !== 1) {
      throw new Error(
        `livello_corrente cambiato inaspettatamente: ${data.livello_corrente} (atteso 1 — aggiornaProgressione non è stata chiamata)`
      );
    }
    const acc = (data.ultime_accuratezze as unknown[]) ?? [];
    if (acc.length !== 0) {
      throw new Error(`ultime_accuratezze modificato inaspettatamente: ${JSON.stringify(acc)}`);
    }

    return "user_levels esecutive integro (logica progressione NON testata)";
  });

  // ── 6. F6: verifica streak / last_activity invariati (logica streak NON testata)

  await step("F6", async () => {
    const { data, error } = await sb
      .from("users")
      .select("current_streak, last_activity_date")
      .eq("id", userId)
      .single();

    if (error || !data) throw new Error(`lettura users: ${error?.message}`);

    // Streak non viene toccato dallo script — verifica solo che il campo esista e sia leggibile
    const streak = data.current_streak;
    const lastDate = data.last_activity_date;
    if (typeof streak !== "number") throw new Error(`current_streak non è number: ${streak}`);

    return `streak/last_activity invariati (streak=${streak}, last=${lastDate ?? "null"}) — logica streak NON testata`;
  });

  // ── 7. S8 prep: forza livello 11 ────────────────────────────────────────────

  await step("S8 prep", async () => {
    const { error } = await sb
      .from("user_levels")
      .update({ livello_corrente: 11 })
      .eq("user_id", userId)
      .eq("categoria_id", CATEGORIA);
    if (error) throw new Error(error.message);

    const { data, error: readErr } = await sb
      .from("user_levels")
      .select("livello_corrente")
      .eq("user_id", userId)
      .eq("categoria_id", CATEGORIA)
      .single();
    if (readErr || !data) throw new Error(`verifica S8: ${readErr?.message}`);
    if (data.livello_corrente !== 11) throw new Error(`atteso 11, trovato ${data.livello_corrente}`);

    return "livello_corrente = 11 applicato";
  });

  // ── 8. S9 prep: forza livello 13 ────────────────────────────────────────────

  await step("S9 prep", async () => {
    const { error } = await sb
      .from("user_levels")
      .update({ livello_corrente: 13 })
      .eq("user_id", userId)
      .eq("categoria_id", CATEGORIA);
    if (error) throw new Error(error.message);

    const { data, error: readErr } = await sb
      .from("user_levels")
      .select("livello_corrente")
      .eq("user_id", userId)
      .eq("categoria_id", CATEGORIA)
      .single();
    if (readErr || !data) throw new Error(`verifica S9: ${readErr?.message}`);
    if (data.livello_corrente !== 13) throw new Error(`atteso 13, trovato ${data.livello_corrente}`);

    return "livello_corrente = 13 applicato";
  });

  // ── 9. S10 prep: livello 13 + sessione fittizia lv 10 ───────────────────────

  let fittiziaSessionId: string | null = null;

  await step("S10 prep", async () => {
    // UPDATE già a 13 dal passo precedente — verifica e basta
    const { data: lvlData, error: lvlErr } = await sb
      .from("user_levels")
      .select("livello_corrente")
      .eq("user_id", userId)
      .eq("categoria_id", CATEGORIA)
      .single();
    if (lvlErr || !lvlData) throw new Error(`lettura livello: ${lvlErr?.message}`);
    if (lvlData.livello_corrente !== 13) throw new Error(`livello atteso 13, trovato ${lvlData.livello_corrente}`);

    // INSERT sessione fittizia Stroop lv 10 (marker _test_fittizia per cleanup non-distruttivo)
    const { data: ins, error: insErr } = await sb
      .from("sessioni")
      .insert({
        user_id:      userId,
        esercizio_id: "stroop_classico",
        categoria_id: CATEGORIA,
        livello:      10,
        score:        70,
        accuratezza:  75,
        durata:       90,
        completato:   true,
        metriche:     { _test_fittizia: 1 },
      })
      .select("id")
      .single();
    if (insErr || !ins) throw new Error(`INSERT fittizia: ${insErr?.message}`);
    fittiziaSessionId = ins.id as string;

    // Sanity check: devono esserci almeno 2 sessioni Stroop (S4 lv 1 + fittizia lv 10).
    // Protegge da falsi positivi: se S4 non ha inserito, S10 passerebbe per coincidenza.
    const { count: stroopCount } = await sb
      .from("sessioni")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("esercizio_id", "stroop_classico");
    if ((stroopCount ?? 0) < 2) {
      throw new Error(
        `atteso almeno 2 sessioni Stroop in DB (S4 + fittizia), trovate ${stroopCount}`
      );
    }

    // Verifica con la query ESATTA di fetchUltimoLivelloEsercizio (lib/sync.ts:202-210)
    // .from("sessioni").select("livello").eq("user_id", ...).eq("esercizio_id", ...)
    // .not("livello", "is", null).order("created_at", { ascending: false }).limit(1)
    const { data: lastLvl, error: lastErr } = await sb
      .from("sessioni")
      .select("livello")
      .eq("user_id", userId)
      .eq("esercizio_id", "stroop_classico")
      .not("livello", "is", null)
      .order("created_at", { ascending: false })
      .limit(1);
    if (lastErr) throw new Error(`fetchUltimoLivelloEsercizio simulata: ${lastErr.message}`);
    const livelloPrec = lastLvl && lastLvl.length > 0 ? (lastLvl[0].livello as number) : null;
    if (livelloPrec !== 10) {
      throw new Error(`livelloPrec atteso 10, fetchUltimoLivelloEsercizio restituirebbe ${livelloPrec}`);
    }

    return `doppio cambio: livello=13, sessione fittizia lv=10 inserita, livelloPrec simulato = ${livelloPrec}`;
  });

  // ── 10. Cleanup finale ──────────────────────────────────────────────────────
  // Cleanup separato: exit code 2 se fallisce (DB sporco)

  let cleanupOk = false;
  try {
    // Cancella tutte le sessioni test (reali + fittizia)
    const { error: del1 } = await sb
      .from("sessioni")
      .delete()
      .eq("user_id", userId)
      .in("esercizio_id", ESERCIZI_TEST);
    if (del1) throw new Error(`DELETE sessioni: ${del1.message}`);

    // Ripristina user_levels
    const { error: rst } = await sb
      .from("user_levels")
      .update({
        livello_corrente:              1,
        ultime_accuratezze:            [],
        sessioni_sotto_60_consecutive: 0,
      })
      .eq("user_id", userId)
      .eq("categoria_id", CATEGORIA);
    if (rst) throw new Error(`RESET user_levels: ${rst.message}`);

    // Verifica finale
    const { count } = await sb
      .from("sessioni")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .in("esercizio_id", ESERCIZI_TEST);
    if ((count ?? 0) !== 0) throw new Error(`sessioni rimaste dopo cleanup: ${count}`);

    const { data: finalLvl, error: flErr } = await sb
      .from("user_levels")
      .select("livello_corrente, ultime_accuratezze")
      .eq("user_id", userId)
      .eq("categoria_id", CATEGORIA)
      .single();
    if (flErr || !finalLvl) throw new Error(`lettura user_levels finale: ${flErr?.message}`);
    if (finalLvl.livello_corrente !== 1) throw new Error(`livello post-cleanup: ${finalLvl.livello_corrente}`);
    const finalAcc = (finalLvl.ultime_accuratezze as unknown[]) ?? [];
    if (finalAcc.length !== 0) throw new Error(`ultime_accuratezze non vuoto: ${JSON.stringify(finalAcc)}`);

    cleanupOk = true;
    ok("R-finale", "cleanup completo, DB allo stato pre-smoke");
  } catch (e) {
    fail("R-finale", `CLEANUP FALLITO — ${e instanceof Error ? e.message : String(e)}`);
  }

  // ── Riepilogo ───────────────────────────────────────────────────────────────

  const total = 10;
  const passed = total - failedSteps - (cleanupOk ? 0 : 1);
  console.log("");

  if (!cleanupOk) {
    console.error(
      "STATO DB SPORCO — ripulire manualmente:\n" +
      `  DELETE FROM sessioni WHERE user_id = '${userId}' AND esercizio_id IN ('flanker_frecce','stroop_classico');\n` +
      `  UPDATE user_levels SET livello_corrente=1, ultime_accuratezze='{}', sessioni_sotto_60_consecutive=0\n` +
      `    WHERE user_id = '${userId}' AND categoria_id = 'esecutive';`
    );
    process.exit(2);
  }

  if (failedSteps > 0) {
    console.log(`RISULTATO: ${failedSteps} check falliti (${passed}/${total}).`);
    console.log("Manuale UI residuo: F1-F3, F7, S1-S3, S7, S8/S9/S10 visivo, S11, S12.");
    process.exit(1);
  }

  console.log(`RISULTATO: tutti i check DB Layer 1 verdi (${total}/${total}).`);
  console.log("Manuale UI residuo: F1-F3, F7, S1-S3, S7, S8/S9/S10 visivo, S11, S12.");
}

main();
