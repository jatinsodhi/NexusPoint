import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Notification } from '../types';

export const createNotification = async (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
  try {
    await addDoc(collection(db, 'notifications'), {
      ...notification,
      createdAt: new Date().toISOString(),
      read: false
    });
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};
