"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/lib/store";
import { initUserData } from "@/lib/sync";

export default function UserInit() {
  const { setUser, isGuest } = useUserStore();

  useEffect(() => {
    if (isGuest) return;

    async function init() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const data = await initUserData(user.id);
      if (data) setUser(data);
    }

    init();
  }, [isGuest, setUser]);

  return null;
}
