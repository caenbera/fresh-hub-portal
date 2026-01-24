'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { collection, onSnapshot, query, where, orderBy, writeBatch, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/context/auth-context';
import type { Notification } from '@/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

declare global {
  interface Navigator {
    setAppBadge?: (count?: number) => Promise<void>;
    clearAppBadge?: () => Promise<void>;
  }
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      if ('clearAppBadge' in navigator) {
        navigator.clearAppBadge?.();
      }
      return;
    }

    setLoading(true);
    const notificationsCollection = collection(db, 'users', user.uid, 'notifications');
    const q = query(notificationsCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notificationsData: Notification[] = [];
      let unread = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (!data.read) {
          unread++;
        }
        notificationsData.push({ id: doc.id, ...data } as Notification);
      });
      setNotifications(notificationsData);
      setUnreadCount(unread);
      if ('setAppBadge' in navigator) {
        if (unread > 0) {
            navigator.setAppBadge?.(unread);
        } else {
            navigator.clearAppBadge?.();
        }
      }
      setLoading(false);
    },
    (serverError) => {
      // This might be a permission error if the rules are not set up correctly
      // for the notifications subcollection.
      const permissionError = new FirestorePermissionError({ path: notificationsCollection.path, operation: 'list' });
      errorEmitter.emit('permission-error', permissionError);
      console.error("Error fetching notifications:", serverError);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const markAllAsRead = async () => {
    if (!user || unreadCount === 0) return;

    const notificationsCollection = collection(db, 'users', user.uid, 'notifications');
    const q = query(notificationsCollection, where('read', '==', false));
    
    try {
        const querySnapshot = await getDocs(q);
        const batch = writeBatch(db);
        querySnapshot.forEach(doc => {
            batch.update(doc.ref, { read: true });
        });
        await batch.commit();
        // The onSnapshot listener will automatically update the state
    } catch (e) {
        console.error("Error marking notifications as read:", e);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, loading, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
