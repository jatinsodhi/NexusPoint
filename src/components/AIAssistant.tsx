import { useState, useRef, useEffect } from 'react';
import { Team, UserProfile, Project, Task } from '../types';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { processTaskCommand } from '../services/geminiService';
import { Bot, Send, X, Sparkles, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AIAssistantProps {
  team: Team;
  profile: UserProfile;
  projects: Project[];
  selectedProject: Project | null;
}

export default function AIAssistant({ team, profile, projects, selectedProject }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', content: string, status?: 'success' | 'error' }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const context = `
        Current Team: ${team.name}
        Current Project: ${selectedProject?.name || 'None selected'}
        Available Projects: ${projects.map(p => p.name).join(', ')}
        User Role: ${profile.role}
      `;

      const result = await processTaskCommand(userMsg, context);
      
      if (result.action === 'UNKNOWN') {
        setMessages(prev => [...prev, { role: 'bot', content: "I'm not sure how to help with that. Try asking me to 'create a task', 'update task status', or 'list tasks'." }]);
      } else {
        await executeAction(result);
        setMessages(prev => [...prev, { 
          role: 'bot', 
          content: result.reasoning || `Successfully executed ${result.action}`,
          status: 'success'
        }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'bot', content: "Sorry, I encountered an error processing your request.", status: 'error' }]);
    } finally {
      setLoading(false);
    }
  };

  const executeAction = async (result: any) => {
    const { action, taskData } = result;

    switch (action) {
      case 'CREATE_TASK':
        if (!selectedProject) throw new Error("No project selected");
        await addDoc(collection(db, 'tasks'), {
          title: taskData.title || 'Untitled Task',
          description: taskData.description || '',
          status: taskData.status || 'todo',
          projectId: selectedProject.id,
          assignedTo: profile.uid,
          createdAt: new Date().toISOString()
        });
        break;
      case 'UPDATE_TASK':
        if (!taskData.taskId) throw new Error("Task ID missing");
        await updateDoc(doc(db, 'tasks', taskData.taskId), {
          status: taskData.status,
          ...(taskData.title && { title: taskData.title }),
          ...(taskData.description && { description: taskData.description })
        });
        break;
      // Implement other actions as needed
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl border border-zinc-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-100 bg-zinc-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Task Assistant</h4>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Powered by Gemini</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <Bot className="w-12 h-12 text-zinc-200 mb-4" />
                  <p className="text-sm font-medium text-zinc-900">How can I help you today?</p>
                  <p className="text-xs text-zinc-400 mt-1">Try "Create a task to design the landing page" or "Move task X to done"</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-zinc-100 text-zinc-900 rounded-tr-none' 
                      : 'bg-zinc-900 text-white rounded-tl-none'
                  }`}>
                    <div className="flex items-start gap-2">
                      {msg.role === 'bot' && msg.status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                      {msg.role === 'bot' && msg.status === 'error' && <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-900 text-white p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-xs font-medium">Processing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleCommand} className="p-6 border-t border-zinc-100">
              <div className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="w-full pl-4 pr-12 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 text-sm"
                />
                <button 
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
          isOpen ? 'bg-zinc-900 text-white rotate-90' : 'bg-white text-zinc-900 hover:scale-110'
        }`}
      >
        {isOpen ? <X className="w-8 h-8" /> : <Bot className="w-8 h-8" />}
      </button>
    </div>
  );
}
