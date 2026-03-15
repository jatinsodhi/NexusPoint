import React from 'react';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

interface FooterProps {
  navigate?: (p: 'home' | 'about' | 'contact') => void;
}

export default function Footer({ navigate }: FooterProps) {
  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900 py-12 px-8 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <button onClick={() => navigate?.('home')} className="flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-zinc-900 dark:bg-white rounded-lg flex items-center justify-center">
              <span className="text-white dark:text-zinc-900 font-bold text-sm">C</span>
            </div>
            <h2 className="font-bold text-zinc-900 dark:text-white text-lg">CollabHub</h2>
          </button>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-xs leading-relaxed">
            The ultimate real-time collaboration platform for modern teams. 
            Manage projects, track tasks, and communicate seamlessly.
          </p>
          <div className="flex items-center gap-4 mt-8">
            <a href="#" className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-zinc-900 dark:text-white mb-6">Product</h4>
          <ul className="space-y-4 text-sm text-zinc-500 dark:text-zinc-400">
            <li><button onClick={() => navigate?.('home')} className="hover:text-zinc-900 dark:hover:text-white transition-colors">Features</button></li>
            <li><button onClick={() => navigate?.('home')} className="hover:text-zinc-900 dark:hover:text-white transition-colors">Kanban Boards</button></li>
            <li><button onClick={() => navigate?.('home')} className="hover:text-zinc-900 dark:hover:text-white transition-colors">Team Chat</button></li>
            <li><button onClick={() => navigate?.('home')} className="hover:text-zinc-900 dark:hover:text-white transition-colors">AI Assistant</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-zinc-900 dark:text-white mb-6">Company</h4>
          <ul className="space-y-4 text-sm text-zinc-500 dark:text-zinc-400">
            <li><button onClick={() => navigate?.('about')} className="hover:text-zinc-900 dark:hover:text-white transition-colors">About Us</button></li>
            <li><button onClick={() => navigate?.('contact')} className="hover:text-zinc-900 dark:hover:text-white transition-colors">Contact</button></li>
            <li><button className="hover:text-zinc-900 dark:hover:text-white transition-colors">Privacy Policy</button></li>
            <li><button onClick={() => navigate?.('contact')} className="hover:text-zinc-900 dark:hover:text-white transition-colors">Support</button></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-zinc-400">
          © {new Date().getFullYear()} CollabHub Inc. All rights reserved.
        </p>
        <div className="flex items-center gap-6 text-xs text-zinc-400">
          <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
}
