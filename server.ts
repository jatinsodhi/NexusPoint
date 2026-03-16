import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { User, Team, Project, Task, Message, Notification } from './server/models.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Middleware
  app.use(cors());
  app.use(express.json());

  // MongoDB Connection
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://NexusPoint:NexusPoint@cluster0.ltnunqb.mongodb.net/?appName=Cluster0';
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }

  // API Routes

  // Users
  app.get('/api/users/:uid', async (req, res) => {
    try {
      const user = await User.findOne({ uid: req.params.uid });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/users', async (req, res) => {
    try {
      const user = await User.findOneAndUpdate(
        { uid: req.body.uid },
        req.body,
        { upsert: true, new: true }
      );
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/teams/:teamId/members', async (req, res) => {
    try {
      const members = await User.find({ teamId: req.params.teamId });
      res.json(members);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Teams
  app.get('/api/teams/:id', async (req, res) => {
    try {
      const team = await Team.findById(req.params.id);
      res.json(team);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/teams', async (req, res) => {
    try {
      const team = new Team(req.body);
      await team.save();
      res.json(team);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Projects
  app.get('/api/projects', async (req, res) => {
    try {
      const { teamId } = req.query;
      const projects = await Project.find({ teamId });
      res.json(projects);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/projects', async (req, res) => {
    try {
      const project = new Project(req.body);
      await project.save();
      res.json(project);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/projects/:id', async (req, res) => {
    try {
      await Project.findByIdAndDelete(req.params.id);
      await Task.deleteMany({ projectId: req.params.id });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Tasks
  app.get('/api/tasks', async (req, res) => {
    try {
      const { projectId } = req.query;
      const tasks = await Task.find({ projectId });
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/tasks', async (req, res) => {
    try {
      const task = new Task(req.body);
      await task.save();
      res.json(task);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.patch('/api/tasks/:id', async (req, res) => {
    try {
      const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(task);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/tasks/:id', async (req, res) => {
    try {
      await Task.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Messages
  app.get('/api/messages', async (req, res) => {
    try {
      const { teamId } = req.query;
      const messages = await Message.find({ teamId }).sort({ timestamp: 1 });
      res.json(messages);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/messages', async (req, res) => {
    try {
      const message = new Message(req.body);
      await message.save();
      res.json(message);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Notifications
  app.get('/api/notifications', async (req, res) => {
    try {
      const { userId } = req.query;
      const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
      res.json(notifications);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.patch('/api/notifications/:id', async (req, res) => {
    try {
      const notification = await Notification.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(notification);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/notifications', async (req, res) => {
    try {
      const notification = new Notification(req.body);
      await notification.save();
      res.json(notification);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
