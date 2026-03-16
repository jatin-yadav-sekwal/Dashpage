import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Function to update session
    const updateSession = (newSession: Session | null) => {
      if (isMounted) {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      }
    };

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      updateSession(session);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      updateSession(newSession);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  };

  const refresh = async () => {
    const {
      data: { session: newSession },
    } = await supabase.auth.getSession();
    setSession(newSession);
    setUser(newSession?.user ?? null);
  };

  return { user, session, loading, signOut, refresh };
}
