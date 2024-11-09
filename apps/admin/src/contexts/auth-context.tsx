'use client';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

  const profile = async () => {
    try {
  
      setLoading(true);
      const response = await fetch('/api/auth/profile', { method: 'GET' });
      
      if (!response.ok) {
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
  };


  useEffect(() => {
    profile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
