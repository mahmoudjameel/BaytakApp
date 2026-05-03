import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { TokenStorage } from '../services/api';
import { ProfileService, UserProfile } from '../services/profile.service';
import { AuthService } from '../services/auth.service';
import { devLog } from '../utils/devLog';

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  role: 'CLIENT' | 'PROVIDER' | null;
  signIn: (email: string, password: string) => Promise<UserProfile | null>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<UserProfile | null>;
};

const AuthContext = createContext<AuthState>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  role: null,
  signIn: async () => null,
  signOut: async () => {},
  refreshUser: async () => null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<'CLIENT' | 'PROVIDER' | null>(null);

  const loadUser = useCallback(async (): Promise<UserProfile | null> => {
    try {
      const token = await TokenStorage.getAccess();
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setRole(null);
        return null;
      }
      let profile = await ProfileService.getProfile();
      const uidStr = await TokenStorage.getUserId();
      const fromToken = uidStr ? Number(uidStr) : 0;
      if ((!profile.id || profile.id <= 0) && fromToken > 0) {
        profile = { ...profile, id: fromToken };
      }
      devLog('auth.context.loadUser', {
        userIdFromToken: fromToken || null,
        profileInState: profile,
        role: profile.role ?? null,
      });
      setUser(profile);
      setRole(profile.role ?? null);
      setIsAuthenticated(true);
      return profile;
    } catch {
      await TokenStorage.clear();
      setIsAuthenticated(false);
      setUser(null);
      setRole(null);
      return null;
    }
  }, []);

  useEffect(() => {
    loadUser().finally(() => setIsLoading(false));
  }, [loadUser]);

  const signIn = useCallback(async (email: string, password: string) => {
    await AuthService.signIn(email, password);
    return loadUser();
  }, [loadUser]);

  const signOut = useCallback(async () => {
    await AuthService.signOut();
    setIsAuthenticated(false);
    setUser(null);
    setRole(null);
  }, []);

  const refreshUser = useCallback(async () => loadUser(), [loadUser]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, role, signIn, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
