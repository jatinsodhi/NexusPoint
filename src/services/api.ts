const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const api = {
  // Users
  getUser: async (uid: string) => {
    const res = await fetch(`${API_BASE}/users/${uid}`);
    return res.ok ? res.json() : null;
  },
  saveUser: async (userData: any) => {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return res.json();
  },
  getTeamMembers: async (teamId: string) => {
    const res = await fetch(`${API_BASE}/teams/${teamId}/members`);
    return res.json();
  },

  // Teams
  getTeam: async (id: string) => {
    const res = await fetch(`${API_BASE}/teams/${id}`);
    return res.ok ? res.json() : null;
  },
  createTeam: async (teamData: any) => {
    const res = await fetch(`${API_BASE}/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teamData),
    });
    return res.json();
  },

  // Projects
  getProjects: async (teamId: string) => {
    const res = await fetch(`${API_BASE}/projects?teamId=${teamId}`);
    return res.json();
  },
  createProject: async (projectData: any) => {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData),
    });
    return res.json();
  },
  deleteProject: async (id: string) => {
    const res = await fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Tasks
  getTasks: async (projectId: string) => {
    const res = await fetch(`${API_BASE}/tasks?projectId=${projectId}`);
    return res.json();
  },
  createTask: async (taskData: any) => {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    return res.json();
  },
  updateTask: async (id: string, taskData: any) => {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    return res.json();
  },
  deleteTask: async (id: string) => {
    const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Messages
  getMessages: async (teamId: string) => {
    const res = await fetch(`${API_BASE}/messages?teamId=${teamId}`);
    return res.json();
  },
  createMessage: async (messageData: any) => {
    const res = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageData),
    });
    return res.json();
  },

  // Notifications
  getNotifications: async (userId: string) => {
    const res = await fetch(`${API_BASE}/notifications?userId=${userId}`);
    return res.json();
  },
  updateNotification: async (id: string, notificationData: any) => {
    const res = await fetch(`${API_BASE}/notifications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notificationData),
    });
    return res.json();
  },
  createNotification: async (notificationData: any) => {
    const res = await fetch(`${API_BASE}/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notificationData),
    });
    return res.json();
  }
};
