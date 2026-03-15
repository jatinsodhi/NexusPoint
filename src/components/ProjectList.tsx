import { useState } from 'react';
import { Project, Team, UserProfile } from '../types';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Plus, Folder, MoreVertical, Trash2, Edit2, Calendar, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface ProjectListProps {
  projects: Project[];
  team: Team;
  profile: UserProfile;
  onSelect: (project: Project) => void;
  searchQuery?: string;
}

export default function ProjectList({ projects, team, profile, onSelect, searchQuery = '' }: ProjectListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const canManage = profile.role === 'ADMIN' || profile.role === 'MANAGER';

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'projects'), {
        name,
        description,
        teamId: team.id,
        createdAt: new Date().toISOString()
      });
      setName('');
      setDescription('');
      setIsAdding(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project? All tasks will be lost.')) return;
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `projects/${id}`);
    }
  };

  const filteredProjects = projects.filter(project => {
    const q = searchQuery.toLowerCase();
    return (
      project.name.toLowerCase().includes(q) ||
      project.description?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Team Projects</h3>
          <p className="text-zinc-500 dark:text-zinc-400">Manage and track your team's initiatives</p>
        </div>
        {canManage && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-zinc-900/10 dark:shadow-white/5"
          >
            <Plus className="w-5 h-5" />
            New Project
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleAddProject} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Project Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Q1 Marketing Campaign"
                  className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 dark:text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Description (Optional)</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe the project goals"
                  className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 dark:text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-6 py-3 text-zinc-600 dark:text-zinc-400 font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => onSelect(project)}
            className="group bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-white hover:shadow-xl hover:shadow-zinc-900/5 transition-all cursor-pointer relative"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center group-hover:bg-zinc-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-zinc-900 transition-colors">
                <Folder className="w-6 h-6" />
              </div>
              {canManage && (
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.id); }}
                  className="p-2 text-zinc-300 dark:text-zinc-700 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
            <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">{project.name}</h4>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-6 h-10">
              {project.description || 'No description provided.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              Created {format(new Date(project.createdAt), 'MMM d, yyyy')}
            </div>
          </div>
        ))}

        {filteredProjects.length === 0 && !isAdding && (
          <div className="col-span-full py-20 text-center bg-zinc-100/50 dark:bg-zinc-900/50 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
            <Folder className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-zinc-900 dark:text-white">
              {searchQuery ? 'No matching projects' : 'No projects yet'}
            </h4>
            <p className="text-zinc-500 dark:text-zinc-400">
              {searchQuery ? 'Try adjusting your search query.' : 'Create your first project to start managing tasks.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
