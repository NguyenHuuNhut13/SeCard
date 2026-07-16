'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter, usePathname } from 'next/navigation';
import { CompanyApiService } from '@/utils/api';

interface AuthContextType {
  user: any | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Load token from cookie and fetch profile on mount
  useEffect(() => {
    async function initAuth() {
      const savedToken = Cookies.get('nks_token');
      if (savedToken) {
        setToken(savedToken);
        const res = await CompanyApiService.getProfile(savedToken);
        if (res.success) {
          setUser(res.user);
        } else {
          // Token expired or invalid
          Cookies.remove('nks_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    }
    initAuth();
  }, []);

  // Handle protected routing
  useEffect(() => {
    if (loading) return;

    const isPublicPage = pathname === '/login' || pathname === '/';
    
    if (!token && !isPublicPage) {
      router.push('/login');
    } else if (token && pathname === '/login') {
      router.push('/profile');
    }
  }, [token, pathname, loading, router]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const res = await CompanyApiService.login(email, password);
    if (res.success && res.token) {
      Cookies.set('nks_token', res.token, { expires: 7 }); // Store token in cookie for 7 days
      setToken(res.token);
      setUser(res.user);
      
      // Save account history in localStorage to display as quick-login cards (remember feature)
      try {
        const accountsJson = localStorage.getItem('nks_saved_accounts');
        let accounts: any[] = [];
        if (accountsJson) {
          accounts = JSON.parse(accountsJson) || [];
        }
        if (!Array.isArray(accounts)) accounts = [];
        
        const emailLower = email.toLowerCase();
        const avatarUrl = res.user?.avatar ?? res.user?.avatar_url ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80';
        const name = res.user?.name ?? res.user?.username ?? email.split('@')[0];
        
        const existIdx = accounts.findIndex(acc => acc.email?.toLowerCase() === emailLower);
        if (existIdx > -1) {
          accounts[existIdx].name = name;
          accounts[existIdx].avatar = avatarUrl;
        } else {
          accounts.push({
            email: emailLower,
            name,
            avatar: avatarUrl,
          });
        }
        localStorage.setItem('nks_saved_accounts', JSON.stringify(accounts));
        localStorage.setItem('nks_last_user_email', emailLower);
      } catch (e) {
        console.error('Error saving account history', e);
      }

      setLoading(false);
      router.push('/profile');
      return { success: true };
    }
    
    setLoading(false);
    return { success: false, message: res.message };
  };

  const logout = () => {
    Cookies.remove('nks_token');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  const refreshProfile = async () => {
    if (!token) return;
    const res = await CompanyApiService.getProfile(token);
    if (res.success) {
      setUser(res.user);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
