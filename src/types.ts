export type UserRole = 'ADMIN' | 'MANAGER' | 'MEMBER';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  teamId?: string;
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  adminId: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  teamId: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  projectId: string;
  assignedTo?: string;
  tags: string[];
  createdAt: string;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  teamId: string;
  tags: string[];
  timestamp: any; // Firestore Timestamp
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'task_assigned' | 'task_status_changed' | 'mention' | 'project_update';
  read: boolean;
  createdAt: string;
}
