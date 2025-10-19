import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { User } from '../types';
import { supabase } from '../services/supabaseService';
import type { AuthChangeEvent, Session as SupabaseSession, User as SupabaseUser } from '@supabase/supabase-js';

// Helper to transform Supabase user to our app's User type
const transformSupabaseUser = (supabaseUser: SupabaseUser | null): User | null => {
  if (!supabaseUser) return null;
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
    age: supabaseUser.user_metadata?.age || 0,
    gender: supabaseUser.user_metadata?.gender || 'Other',
  };
};

interface AuthContextType {
  user: User | null;
  session: SupabaseSession | null;
  loading: boolean;
  login: typeof supabase.auth.signInWithPassword;
  register: typeof supabase.auth.signUp;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<SupabaseSession | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      setSession(data.session);
      setUser(transformSupabaseUser(data.session?.user ?? null));
    } catch (error)      {
      console.error('Error getting session:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: SupabaseSession | null) => {
        setSession(session);
        setUser(transformSupabaseUser(session?.user ?? null));
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