import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { getCurrentUser } from './auth-api';
import {
  clearSession,
  getStoredToken,
  getStoredUser,
  saveSession,
} from './auth-storage';
import type { AuthUser } from './types';

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  user: AuthUser | null;
  setSession: (token: string, user: AuthUser) => void;
  refreshUser: () => Promise<void>;
  updateUser: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();

    setToken(storedToken);
    setUser(storedUser);

    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    void (async () => {
      try {
        const response = await getCurrentUser();
        saveSession(storedToken, response.user);
        setUser(response.user);
      } catch {
        clearSession();
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(token && user),
      isLoading,
      token,
      user,
      setSession: (nextToken, nextUser) => {
        saveSession(nextToken, nextUser);
        setToken(nextToken);
        setUser(nextUser);
        setIsLoading(false);
      },
      refreshUser: async () => {
        const currentToken = getStoredToken();

        if (!currentToken) {
          clearSession();
          setToken(null);
          setUser(null);
          return;
        }

        const response = await getCurrentUser();
        saveSession(currentToken, response.user);
        setToken(currentToken);
        setUser(response.user);
      },
      updateUser: (nextUser) => {
        const currentToken = token ?? getStoredToken();
        if (currentToken) {
          saveSession(currentToken, nextUser);
        }
        setUser(nextUser);
      },
      logout: () => {
        clearSession();
        setToken(null);
        setUser(null);
        setIsLoading(false);
      },
    }),
    [isLoading, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}
