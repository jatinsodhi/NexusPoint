import { Notification } from '../types';
import { api } from './api';

export const createNotification = async (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
  try {
    await api.createNotification({
      ...notification,
      createdAt: new Date().toISOString(),
      read: false
    });
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};
