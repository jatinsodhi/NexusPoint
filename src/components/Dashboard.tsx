import { useState, useEffect } from 'react';
import { UserProfile, Team, Project } from '../types';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { 
  LayoutDashboard, 
  Kanban, 
  MessageSquare, 
  Users, 
  LogOut, 
  Search,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import KanbanBoard from './KanbanBoard';
import Chat from './Chat';
import ProjectList from './ProjectList';
import TeamOverview from './TeamOverview';
import AIAssistant from './AIAssistant';
import NotificationCenter from './NotificationCenter';
import { useTheme } from '../contexts/ThemeContext';
import { api } from '../services/api';

interface DashboardProps {
  user: any;
  profile: UserProfile;
  team: Team;
}

export default function Dashboard({ user, profile, team }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'projects' | 'kanban' | 'chat' | 'team'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme: currentTheme, toggleTheme } = useTheme();

  const fetchProjects = async () => {
    if (!team?.id) return;
    try {
      const projectsData = await api.getProjects(team.id);
      setProjects(projectsData);
      if (projectsData.length > 0 && !selectedProject) {
        setSelectedProject(projectsData[0]);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
    const interval = setInterval(fetchProjects, 10000);
    return () => clearInterval(interval);
  }, [team?.id]);

  const sidebarItems = [
    { id: 'projects', label: 'Projects', icon: LayoutDashboard },
    { id: 'kanban', label: 'Kanban Board', icon: Kanban },
    { id: 'chat', label: 'Team Chat', icon: MessageSquare },
    { id: 'team', label: 'Team Overview', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-72 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col transition-colors">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-zinc-900 dark:bg-white rounded-xl flex items-center justify-center">
              <span className="text-white dark:text-zinc-900 font-bold text-xl">C</span>
            </div>
            <div>
              <h1 className="font-bold text-zinc-900 dark:text-white leading-none">CollabHub</h1>
              <span className="text-xs text-zinc-400">{team?.name || 'Loading...'}</span>
            </div>
          </div>

          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id 
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-md' 
                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-all"
          >
            {currentTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span className="font-medium">{currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <img 
              src={user.photoURL || `https://ui-avatars.com/api/?name=${profile.name}`} 
              className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800"
              alt={profile.name}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{profile.name}</p>
              <p className="text-xs text-zinc-400 truncate">{profile.role}</p>
            </div>
          </div>
          <button 
            onClick={() => signOut(auth)}
            className="w-full flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-20 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-8 flex items-center justify-between shrink-0 transition-colors">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              {sidebarItems.find(i => i.id === activeTab)?.label}
            </h2>
            {activeTab === 'kanban' && selectedProject && (
              <>
                <ChevronRight className="w-4 h-4 text-zinc-300 dark:text-zinc-700" />
                <span className="text-zinc-500 dark:text-zinc-400 font-medium">{selectedProject.name}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="w-5 h-5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 w-64 dark:text-white transition-all"
              />
            </div>
            <NotificationCenter />
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8 flex flex-col">
          <div className="flex-1">
            {activeTab === 'projects' && (
              <ProjectList 
                projects={projects} 
                team={team} 
                profile={profile} 
                onSelect={(p) => { setSelectedProject(p); setActiveTab('kanban'); }}
                searchQuery={searchQuery}
                onRefresh={fetchProjects}
              />
            )}
            {activeTab === 'kanban' && (
              <KanbanBoard 
                project={selectedProject} 
                projects={projects}
                onProjectChange={setSelectedProject}
                profile={profile}
                searchQuery={searchQuery}
              />
            )}
            {activeTab === 'chat' && <Chat team={team} profile={profile} searchQuery={searchQuery} />}
            {activeTab === 'team' && <TeamOverview team={team} profile={profile} searchQuery={searchQuery} />}
          </div>
          
          <footer className="mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
            <p>© {new Date().getFullYear()} CollabHub. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Support</a>
            </div>
          </footer>
        </div>

        {/* AI Assistant */}
        <AIAssistant team={team} profile={profile} projects={projects} selectedProject={selectedProject} />
      </main>
    </div>
  );
}

