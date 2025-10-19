
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { User, Session } from '../types';
import { supabase } from '../services/supabaseService';
// FIX: The mock service does not export 'Session'. Importing 'AuthChangeEvent' and using 'Session' from '../types' which is what the mock provides.
import { AuthChangeEvent } from '../services/supabaseService'; // Use mock types

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: typeof supabase.auth.signInWithPassword;
  register: typeof supabase.auth.signUp;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      setSession(data.session as Session | null);
      setUser(data.session?.user ?? null);
    } catch (error) {
      console.error('Error getting session:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      // FIX: The mock's onAuthStateChange provides a session of type `Session` from `../types`, so we use that type directly.
      (_event: AuthChangeEvent, session: Session | null) => {
        // FIX: The type cast is no longer needed as the session type is now correct.
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [getSession]);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };
  
  const value = {
    session,
    user,
    loading,
    login: supabase.auth.signInWithPassword,
    register: supabase.auth.signUp,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
