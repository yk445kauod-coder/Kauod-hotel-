"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

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
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User>({ roomNumber: null, name: null, phone: null });
  const [isDataGateOpen, setDataGateOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('hotel_user');
    if (storedUser) {
      setUserState(JSON.parse(storedUser));
    }
  }, []);

  const setUser = (newUser: User) => {
    setUserState(newUser);
    localStorage.setItem('hotel_user', JSON.stringify(newUser));
  };

  return (
    <UserContext.Provider value={{ user, setUser, isDataGateOpen, setDataGateOpen }}>
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
