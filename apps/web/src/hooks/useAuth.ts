import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const updateSession = useCallback((newSession: Session | null) => {
    setSession(newSession);
    setUser(newSession?.user ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        // First, try to get session from storage immediately
        // This helps with session restoration on page refresh
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        
        if (existingSession) {
          if (isMounted) {
            updateSession(existingSession);
            setInitialized(true);
          }
        } else {
          // No session yet, set loading to false and initialized
          // Wait for onAuthStateChange to potentially restore session
          if (isMounted) {
            setLoading(false);
            setInitialized(true);
          }
        }

        // Listen for auth changes - this includes session restoration
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, newSession) => {
          if (isMounted) {
            console.log("Auth state changed:", _event, !!newSession);
            updateSession(newSession);
            setInitialized(true);
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (isMounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, [updateSession]);

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

  return { user, session, loading, initialized, signOut, refresh };
}
