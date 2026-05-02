import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TokenStorage } from '../services/api';
import { ProfileService, UserProfile } from '../services/profile.service';
import { AuthService } from '../services/auth.service';

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  role: 'CLIENT' | 'PROVIDER' | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  role: null,
  signIn: async () => {},
  signOut: async () => {},
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<'CLIENT' | 'PROVIDER' | null>(null);

  const loadUser = useCallback(async () => {
    try {
      const token = await TokenStorage.getAccess();
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setRole(null);
        return;
      }
      const profile = await ProfileService.getProfile();
      setUser(profile);
      setRole(profile.role ?? null);
      setIsAuthenticated(true);
    } catch {
      await TokenStorage.clear();
      setIsAuthenticated(false);
      setUser(null);
      setRole(null);
    }
  }, []);

  useEffect(() => {
    loadUser().finally(() => setIsLoading(false));
  }, [loadUser]);

  const signIn = useCallback(async (email: string, password: string) => {
    await AuthService.signIn(email, password);
    await loadUser();
  }, [loadUser]);

  const signOut = useCallback(async () => {
    await AuthService.signOut();
    setIsAuthenticated(false);
    setUser(null);
    setRole(null);
  }, []);

  const refreshUser = useCallback(async () => {
    await loadUser();
  }, [loadUser]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, role, signIn, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
