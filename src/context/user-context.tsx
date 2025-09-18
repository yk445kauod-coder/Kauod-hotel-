"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { initializeApp } from 'firebase/app';
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
    apiKey: "AIzaSyApgrwfyrVJYsihy9tUwPfazdNYZPqWbow",
    authDomain: "kaoud-hotel.firebaseapp.com",
    databaseURL: "https://kaoud-hotel-default-rtdb.firebaseio.com",
    projectId: "kaoud-hotel",
    storageBucket: "kaoud-hotel.appspot.com",
    messagingSenderId: "77309702077",
    appId: "1:77309702077:web:1eee14c06204def2eb6cd4"
};

const app = initializeApp(firebaseConfig);
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
