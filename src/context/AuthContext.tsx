'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

type User = {
  id: string;
  name: string;
  email: string;
};

export type AuthModalView = 'login' | 'signup' | 'forgot-password' | 'reset-password';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  isAuthModalOpen: boolean;
  authModalView: AuthModalView;
  openAuthModal: (view?: AuthModalView) => void;
  closeAuthModal: () => void;
  setAuthModalView: (view: AuthModalView) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<AuthModalView>('login');
  
  // NextAuth Session Hook
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // First check custom JWT authentication
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            return;
          }
        }
        
        // If custom JWT auth fails, check NextAuth session
        if (session && session.user) {
          setUser({
            id: (session.user as any).id || session.user.email || '',
            name: session.user.name || 'User',
            email: session.user.email || '',
          });
          return;
        }

        // Neither auth method succeeded
        setUser(null);
      } catch (error) {
        if (!session?.user) {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    if (status !== 'loading') {
      fetchUser();
    }
  }, [session, status]);

  const logout = async () => {
    try {
      // Clear custom JWT token
      await fetch('/api/auth/logout', { method: 'POST' });
      // Clear NextAuth session (this will trigger a page reload by default)
      if (session) {
        await signOut({ redirect: false });
      }
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const openAuthModal = (view: AuthModalView = 'login') => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        setUser, 
        logout,
        isAuthModalOpen,
        authModalView,
        openAuthModal,
        closeAuthModal,
        setAuthModalView
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
