import { useState, useEffect, useRef } from 'react';
import { Team, UserProfile, Message } from '../types';
import { Send, User, Loader2, MessageSquare, Tag as TagIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { api } from '../services/api';

interface ChatProps {
  team: Team;
  profile: UserProfile;
  searchQuery?: string;
}

export default function Chat({ team, profile, searchQuery = '' }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [newTags, setNewTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messagesData = await api.getMessages(team.id);
        setMessages(messagesData);
        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
          }
        }, 100);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [team.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setLoading(true);
    try {
      const msg = await api.createMessage({
        content: newMessage,
        senderId: profile.uid,
        senderName: profile.name,
        teamId: team.id,
        tags: newTags,
        timestamp: new Date().toISOString()
      });
      setMessages(prev => [...prev, msg]);
      setNewMessage('');
      setNewTags([]);
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !newTags.includes(tagInput.trim())) {
      setNewTags([...newTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setNewTags(newTags.filter(t => t !== tag));
  };

  const filteredMessages = messages.filter(msg => {
    const q = searchQuery.toLowerCase();
    return (
      msg.content.toLowerCase().includes(q) ||
      msg.senderName.toLowerCase().includes(q) ||
      msg.tags?.some(tag => tag.toLowerCase().includes(q))
    );
  });

  return (
    <div className="h-full flex flex-col bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm transition-colors">
      <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 shrink-0 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-zinc-900 dark:text-white">Team Chat</h3>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">Real-time messaging for {team.name}</p>
        </div>
        <div className="flex -space-x-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 border-2 border-white dark:border-zinc-900 flex items-center justify-center">
              <User className="w-4 h-4 text-zinc-400" />
            </div>
          ))}
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        {filteredMessages.map((msg, index) => {
          const isMe = msg.senderId === profile.uid;
          const showName = index === 0 || filteredMessages[index - 1].senderId !== msg.senderId;

          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              {showName && !isMe && (
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1 ml-1">
                  {msg.senderName}
                </span>
              )}
              <div className={`max-w-[70%] p-4 rounded-2xl text-sm transition-all ${
                isMe 
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-tr-none' 
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-tl-none'
              }`}>
                {msg.content}
                {msg.tags && msg.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {msg.tags.map(tag => (
                      <span key={tag} className={`px-1.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 ${
                        isMe ? 'bg-white/10 text-white/70' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400'
                      }`}>
                        <TagIcon className="w-2 h-2" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-[9px] text-zinc-300 dark:text-zinc-600 mt-1">
                {msg.timestamp ? format(new Date(msg.timestamp), 'h:mm a') : 'Sending...'}
              </span>
            </div>
          );
        })}
        {filteredMessages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-30 dark:text-white">
            <MessageSquare className="w-12 h-12 mb-4" />
            <p className="text-sm font-medium">
              {searchQuery ? 'No messages match your search.' : 'No messages yet. Start the conversation!'}
            </p>
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="p-6 border-t border-zinc-100 dark:border-zinc-800 shrink-0">
        <div className="flex flex-wrap gap-1 mb-3">
          {newTags.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded text-[10px] font-bold flex items-center gap-1">
              {tag}
              <button onClick={() => removeTag(tag)} className="hover:text-red-500"><X className="w-2.5 h-2.5" /></button>
            </span>
          ))}
          {newTags.length > 0 && <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1 self-center" />}
          <div className="flex items-center gap-1 bg-zinc-50 dark:bg-zinc-800 rounded-lg px-2 py-1">
            <TagIcon className="w-3 h-3 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Add tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="bg-transparent border-none p-0 text-[10px] focus:ring-0 w-16 dark:text-white"
            />
          </div>
        </div>
        <div className="relative">
          <input 
            type="text" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full pl-6 pr-16 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 text-sm dark:text-white transition-all"
          />
          <button 
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </form>
    </div>
  );
}
