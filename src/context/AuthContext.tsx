'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

type User = {
  id: string;
  name: string;
  email: string;
  role?: 'user' | 'admin' | string;
  customLimits?: {
    lldReview?: number | null;
    lldChat?: number | null;
    hldReview?: number | null;
    hldChat?: number | null;
    aiGenerator?: number | null;
    mentorChat?: number | null;
  };
  aiUsage?: {
    lldReview?: number;
    lldChat?: number;
    hldReview?: number;
    hldChat?: number;
    aiGenerator?: number;
    mentorChat?: number;
    totalCalls?: number;
    lastUsedAt?: string | null;
  };
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
    let isMounted = true;

    const fetchUser = async () => {
      try {
        // If NextAuth session is already available
        if (session && session.user) {
          if (isMounted) {
            setUser({
              id: (session.user as any).id || session.user.email || '',
              name: session.user.name || 'User',
              email: session.user.email || '',
            });
            setLoading(false);
          }
          return;
        }

        // Check custom JWT authentication
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user && isMounted) {
            setUser(data.user);
            setLoading(false);
            return;
          }
        }
        
        // If NextAuth is still loading, wait for it before marking user as null
        if (status === 'loading') {
          return;
        }

        // Neither auth method succeeded
        if (isMounted) {
          setUser(null);
        }
      } catch (error) {
        if (!session?.user && isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted && status !== 'loading') {
          setLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
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
