"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "../Lib/supabase/supabaseClient";
import { SessionUser } from "./useAuth";

export type Profile = {
  id: string;
  auth_user_id: string;
  email: string;
  username: string | null;
  full_name: string | null;
  account_balance: number | null;
};

export function useProfile(user: SessionUser | null) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) { setProfile(null); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from('Soln0002 - Users')
      .select('*')
      .eq('auth_user_id', user.id)
      .single<Profile>();
    if (!error) setProfile(data ?? null);
    setLoading(false);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  // ✅ Create a new profile row for the signed-in user
  const create = useCallback(async (init?: { username?: string | null; full_name?: string | null; account_balance?: number | null; }) => {
    if (!user) throw new Error("No session");
    const payload = {
      auth_user_id: user.id,
      email: user.email ?? "",           // auth email (not null in practice)
      username: init?.username ?? null,
      full_name: init?.full_name ?? null,
      account_balance: init?.account_balance ?? 0,
    };
    const { data, error } = await supabase
      .from('Soln0002 - Users')
      .insert(payload)
      .select('*')
      .single<Profile>();
    if (error) throw error;
    setProfile(data);
    return data;
  }, [user]);

  const update = useCallback(async (patch: Partial<Profile>) => {
    if (!user) throw new Error("No session");
    const allowed: Partial<Profile> = {};
    if (typeof patch.full_name !== "undefined") allowed.full_name = patch.full_name;
    if (typeof patch.username !== "undefined") allowed.username = patch.username;
    if (typeof patch.account_balance !== "undefined") allowed.account_balance = patch.account_balance;

    const { data, error } = await supabase
      .from('Soln0002 - Users')
      .update(allowed)
      .eq('auth_user_id', user.id)
      .select('*')
      .single<Profile>();

    if (error) throw error;
    setProfile(data);
  }, [user]);

  return { profile, loading, refresh, create, update };
}
