import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'MANAGER', 'MEMBER'], default: 'MEMBER' },
  teamId: { type: String },
  createdAt: { type: String, default: () => new Date().toISOString() }
});

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  adminId: { type: String, required: true },
  createdAt: { type: String, default: () => new Date().toISOString() }
});

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  teamId: { type: String, required: true },
  createdAt: { type: String, default: () => new Date().toISOString() }
});

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
  projectId: { type: String, required: true },
  assignedTo: { type: String },
  tags: { type: [String], default: [] },
  createdAt: { type: String, default: () => new Date().toISOString() }
});

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  teamId: { type: String, required: true },
  tags: { type: [String], default: [] },
  timestamp: { type: Date, default: Date.now }
});

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: String, default: () => new Date().toISOString() }
});

export const User = mongoose.model('User', userSchema);
export const Team = mongoose.model('Team', teamSchema);
export const Project = mongoose.model('Project', projectSchema);
export const Task = mongoose.model('Task', taskSchema);
export const Message = mongoose.model('Message', messageSchema);
export const Notification = mongoose.model('Notification', notificationSchema);
