'use client';
import { redirect, useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface AuthContextType {
  user: any;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) return null;
  return context;
};


export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const profile = useCallback(async () => {
    try {
  
      setLoading(true);
      const response = await fetch('/api/auth/profile', { method: 'GET' });
      
      if (!response.ok) {
        if(response.status === 401) {
          return redirect('/login')
        }
        throw new Error('Profile fetch failed');
      }
      
      const data = await response.json();
      setUser(data.user);

    } catch (error) {

      router.push('/login')
      setUser(null);

    }finally{
      setLoading(false);
    }
  }, [])


  useEffect(() => {
    profile();
  }, [profile]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
