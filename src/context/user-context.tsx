
"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, onDisconnect, set, serverTimestamp, remove } from 'firebase/database';

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

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getDatabase(app);

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
        const parsedUser = JSON.parse(storedUser);
        setUserState(parsedUser);
        updatePresence(parsedUser.roomNumber);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  const updatePresence = (roomNumber: string | null) => {
    if (!roomNumber) return;
    const userStatusRef = ref(db, `/active_users/room_${roomNumber}`);
    
    set(userStatusRef, {
        active: true,
        last_seen: serverTimestamp()
    });
    
    onDisconnect(userStatusRef).remove();
  }

  const setUser = (newUser: User) => {
    // Clean up old presence if room number changes
    if(user.roomNumber && user.roomNumber !== newUser.roomNumber) {
        remove(ref(db, `/active_users/room_${user.roomNumber}`));
    }
      
    setUserState(newUser);
    updatePresence(newUser.roomNumber);

    try {
      localStorage.setItem('hotel_user', JSON.stringify(newUser));
    } catch (error) {
      console.error("Failed to save user to localStorage", error);
    }
  };

  const logout = () => {
      if (user.roomNumber) {
        remove(ref(db, `/active_users/room_${user.roomNumber}`));
      }
      localStorage.removeItem('hotel_user');
      localStorage.removeItem('language_selected');
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
