import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

type UserData = {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  avatar: string | null;
};

type AuthContextType = {
  accessToken: string | null;
  updateAccessToken: (token: string | null) => void;
  userData: UserData | null;
  updateUserData: (data: UserData | null) => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  const updateAccessToken = useCallback((token: string | null) => {
    setAccessToken(token);
  }, []);

  const updateUserData = useCallback((data: UserData | null) => {
    setUserData(data);
  }, []);

  const authContextValue = {
    accessToken,
    updateAccessToken,
    userData,
    updateUserData,
  };

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
