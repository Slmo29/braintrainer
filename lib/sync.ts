import { createClient } from "@/lib/supabase/client";

export async function initUserData(userId: string) {
  const supabase = createClient();

  const [{ data: profile }, { data: userMedaglie }, { count: eserciziFattiOggi }] =
    await Promise.all([
      supabase.from("users").select("*").eq("id", userId).single(),
      supabase.from("user_medaglie").select("medaglia_id").eq("user_id", userId),
      supabase
        .from("sessioni")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", new Date().toISOString().split("T")[0]),
    ]);

  if (!profile) return null;

  return {
    userId,
    nome: profile.nome as string,
    cognome: (profile.cognome ?? "") as string,
    telefono: (profile.telefono ?? "") as string,
    email: (profile.email ?? "") as string,
    anno_nascita: (profile.anno_nascita ?? 0) as number,
    orario_notifica: (profile.orario_notifica ?? "09:00") as string,
    canale_notifica: (profile.canale_notifica ?? "whatsapp") as string,
    consenso_notifiche: (profile.consenso_notifiche ?? false) as boolean,
    streak: (profile.current_streak ?? 0) as number,
    lastActivityDate: (profile.last_activity_date ?? null) as string | null,
    medaglie: (userMedaglie ?? []).map((m) => m.medaglia_id as string),
    eserciziFattiOggi: eserciziFattiOggi ?? 0,
    isGuest: false,
  };
}

export async function salvaSessione({
  userId,
  esercizioId,
  categoriaId,
  score,
}: {
  userId: string;
  esercizioId: string;
  categoriaId: string | null;
  score: number;
}) {
  const supabase = createClient();
  await supabase.from("sessioni").insert({
    user_id: userId,
    esercizio_id: esercizioId,
    categoria_id: categoriaId,
    score,
    accuratezza: score,
    completato: true,
  });
}

export async function aggiornaStreak(
  userId: string,
  streakCorrente: number,
  lastActivityDate: string | null
): Promise<number> {
  const supabase = createClient();
  const oggi = new Date().toISOString().split("T")[0];
  const ieri = new Date(Date.now() - 86_400_000).toISOString().split("T")[0];

  if (lastActivityDate === oggi) return streakCorrente;

  const nuovoStreak = lastActivityDate === ieri ? streakCorrente + 1 : 1;

  await supabase
    .from("users")
    .update({ current_streak: nuovoStreak, last_activity_date: oggi })
    .eq("id", userId);

  return nuovoStreak;
}

export async function controllaNuoveMedaglie(
  userId: string,
  nuovoStreak: number,
  medaglieGiaOttenute: string[]
): Promise<string[]> {
  const supabase = createClient();

  let query = supabase
    .from("medaglie")
    .select("id")
    .lte("giorni", nuovoStreak);

  if (medaglieGiaOttenute.length > 0) {
    query = query.not("id", "in", `(${medaglieGiaOttenute.map((m) => `"${m}"`).join(",")})`);
  }

  const { data: nuove } = await query;
  if (!nuove || nuove.length === 0) return [];

  const ids = nuove.map((m) => m.id as string);
  await supabase.from("user_medaglie").insert(ids.map((id) => ({ user_id: userId, medaglia_id: id })));

  return ids;
}
