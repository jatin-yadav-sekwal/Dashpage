import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const refreshSession = useCallback(async () => {
    const { data: { session: newSession } } = await supabase.auth.getSession();
    setSession(newSession);
    setUser(newSession?.user ?? null);
  }, []);

  useEffect(() => {
    let isMounted = true;
    // Track whether onAuthStateChange has already given us the initial session.
    // If it fires first, we skip the getSession() update to avoid overwriting.
    let authEventFired = false;

    // IMPORTANT: Set up the auth state listener FIRST, before getSession().
    // This ensures we don't miss the SIGNED_IN event from OAuth redirects
    // (which fires when Supabase processes the hash fragment in the URL).
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        console.log("Auth state changed:", _event, newSession ? "session exists" : "no session");
        authEventFired = true;

        if (isMounted) {
          setSession(newSession);
          setUser(newSession?.user ?? null);
          setLoading(false);
          setInitialized(true);
        }
      }
    );

    // Fallback: get the existing session from storage.
    // Only applies if onAuthStateChange hasn't fired yet (e.g., no OAuth redirect).
    const initAuth = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
        }

        if (isMounted && !authEventFired) {
          // onAuthStateChange hasn't fired yet, so we set state from getSession()
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setLoading(false);
          setInitialized(true);
        } else if (isMounted) {
          // onAuthStateChange already ran — just ensure loading flags are cleared
          setLoading(false);
          setInitialized(true);
        }
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
      subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, initialized, signOut, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
