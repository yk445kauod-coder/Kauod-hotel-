"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  roomNumber: string | null;
  name: string | null;
  phone: string | null;
}

interface UserContextType {
  user: User;
  setUser: (user: User) => void;
  isDataGateOpen: boolean;
  setDataGateOpen: (isOpen: boolean) => void;
  isLoading: boolean;
  logout: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User>({ roomNumber: null, name: null, phone: null });
  const [isDataGateOpen, setDataGateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('hotel_user');
      if (storedUser) {
        setUserState(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  const setUser = (newUser: User) => {
    setUserState(newUser);
    try {
      localStorage.setItem('hotel_user', JSON.stringify(newUser));
    } catch (error) {
      console.error("Failed to save user to localStorage", error);
    }
  };

  const logout = () => {
      localStorage.removeItem('hotel_user');
      setUserState({ roomNumber: null, name: null, phone: null });
      router.push('/login');
  }

  return (
    <UserContext.Provider value={{ user, setUser, isDataGateOpen, setDataGateOpen, isLoading, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
