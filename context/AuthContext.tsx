"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored demo user
    const stored = localStorage.getItem("incidentiq_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const signInWithGoogle = async () => {
    const demoUser: User = {
      uid: "demo-user-001",
      email: "engineer@incidentiq.ai",
      displayName: "Sarah Chen",
      photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    };
    setUser(demoUser);
    localStorage.setItem("incidentiq_user", JSON.stringify(demoUser));
  };

  const signInWithEmail = async (email: string, _password: string) => {
    const demoUser: User = {
      uid: "demo-user-001",
      email,
      displayName: email.split("@")[0],
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    };
    setUser(demoUser);
    localStorage.setItem("incidentiq_user", JSON.stringify(demoUser));
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem("incidentiq_user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
