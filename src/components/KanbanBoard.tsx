import { useState, useEffect } from 'react';
import { Project, Task, UserProfile } from '../types';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, deleteDoc, orderBy } from 'firebase/firestore';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { 
  Plus, 
  MoreHorizontal, 
  User, 
  Calendar, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Loader2, 
  AlertTriangle,
  Tag as TagIcon,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import Modal from './Modal';
import { createNotification } from '../services/notificationService';

interface KanbanBoardProps {
  project: Project | null;
  projects: Project[];
  onProjectChange: (project: Project) => void;
  profile: UserProfile;
  searchQuery?: string;
}

const COLUMNS = [
  { id: 'todo', label: 'To Do', icon: Circle, color: 'text-zinc-400' },
  { id: 'in-progress', label: 'In Progress', icon: Clock, color: 'text-amber-500' },
  { id: 'done', label: 'Done', icon: CheckCircle2, color: 'text-emerald-500' },
];

export default function KanbanBoard({ project, projects, onProjectChange, profile, searchQuery = '' }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAdding, setIsAdding] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskTags, setNewTaskTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  useEffect(() => {
    if (!project) return;

    const q = query(
      collection(db, 'tasks'),
      where('projectId', '==', project.id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'tasks');
    });

    return () => unsubscribe();
  }, [project?.id]);

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    try {
      await updateDoc(doc(db, 'tasks', draggableId), {
        status: destination.droppableId
      });
      
      // Notify if status changed to done
      if (destination.droppableId === 'done') {
        const task = tasks.find(t => t.id === draggableId);
        if (task) {
          await createNotification({
            userId: task.assignedTo || profile.uid,
            title: 'Task Completed',
            message: `Task "${task.title}" has been moved to Done.`,
            type: 'task_status_changed'
          });
        }
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `tasks/${draggableId}`);
    }
  };

  const handleAddTask = async (status: string) => {
    if (!newTaskTitle.trim() || !project) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'tasks'), {
        title: newTaskTitle,
        description: newTaskDesc,
        status,
        projectId: project.id,
        teamId: project.teamId,
        assignedTo: profile.uid,
        tags: newTaskTags,
        createdAt: new Date().toISOString()
      });
      setNewTaskTitle('');
      setNewTaskDesc('');
      setNewTaskTags([]);
      setIsAdding(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'tasks');
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      await deleteDoc(doc(db, 'tasks', taskToDelete.id));
      setTaskToDelete(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `tasks/${taskToDelete.id}`);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !newTaskTags.includes(tagInput.trim())) {
      setNewTaskTags([...newTaskTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setNewTaskTags(newTaskTags.filter(t => t !== tag));
  };

  const filteredTasks = tasks.filter(task => {
    const q = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(q) ||
      task.description?.toLowerCase().includes(q) ||
      task.tags?.some(tag => tag.toLowerCase().includes(q))
    );
  });

  if (!project) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-3xl flex items-center justify-center mb-6">
          <Plus className="w-10 h-10 text-zinc-300 dark:text-zinc-700" />
        </div>
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Select a project</h3>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto mt-2">
          Choose a project from the list or create a new one to start managing tasks.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-8">
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <select 
            value={project.id}
            onChange={(e) => {
              const p = projects.find(p => p.id === e.target.value);
              if (p) onProjectChange(p);
            }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 font-semibold text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 transition-colors"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 flex gap-6 overflow-x-auto pb-4 min-h-0">
          {COLUMNS.map((column) => (
            <div key={column.id} className="w-96 flex flex-col shrink-0">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <column.icon className={`w-5 h-5 ${column.color}`} />
                  <h4 className="font-bold text-zinc-900 dark:text-white">{column.label}</h4>
                  <span className="bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-bold px-2 py-0.5 rounded-full">
                    {filteredTasks.filter(t => t.status === column.id).length}
                  </span>
                </div>
                <button 
                  onClick={() => setIsAdding(column.id)}
                  className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`flex-1 flex flex-col gap-4 p-2 rounded-2xl transition-colors ${
                      snapshot.isDraggingOver ? 'bg-zinc-100/50 dark:bg-zinc-900/50' : ''
                    }`}
                  >
                    {isAdding === column.id && (
                      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border-2 border-zinc-900 dark:border-white shadow-sm animate-in fade-in zoom-in-95 duration-200">
                        <input
                          autoFocus
                          placeholder="Task title..."
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold p-0 mb-2 dark:text-white"
                        />
                        <textarea
                          placeholder="Description (optional)..."
                          value={newTaskDesc}
                          onChange={(e) => setNewTaskDesc(e.target.value)}
                          className="w-full bg-transparent border-none focus:ring-0 text-xs text-zinc-500 dark:text-zinc-400 resize-none p-0 mb-3"
                          rows={2}
                        />
                        
                        <div className="mb-3">
                          <div className="flex gap-2 mb-2">
                            <input 
                              type="text" 
                              placeholder="Add tag..."
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                              className="flex-1 bg-zinc-50 dark:bg-zinc-800 border-none rounded-lg px-2 py-1 text-[10px] focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white dark:text-white"
                            />
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {newTaskTags.map(tag => (
                              <span key={tag} className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded text-[10px] font-bold flex items-center gap-1">
                                {tag}
                                <button onClick={() => removeTag(tag)} className="hover:text-red-500"><X className="w-2.5 h-2.5" /></button>
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setIsAdding(null)}
                            className="px-3 py-1.5 text-xs font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => handleAddTask(column.id)}
                            disabled={loading || !newTaskTitle.trim()}
                            className="px-3 py-1.5 text-xs font-bold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg hover:opacity-90 disabled:opacity-50"
                          >
                            {loading ? 'Adding...' : 'Add Task'}
                          </button>
                        </div>
                      </div>
                    )}

                    {filteredTasks
                      .filter(task => task.status === column.id)
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group ${
                                snapshot.isDragging ? 'shadow-xl border-zinc-900 dark:border-white rotate-2' : ''
                              }`}
                            >
                              <div className="flex justify-between items-start mb-3">
                                <h5 className="text-sm font-bold text-zinc-900 dark:text-white leading-tight flex-1">
                                  {task.title}
                                </h5>
                                <button 
                                  onClick={() => setTaskToDelete(task)}
                                  className="p-1 text-zinc-300 dark:text-zinc-700 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              {task.description && (
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-3">
                                  {task.description}
                                </p>
                              )}

                              {task.tags && task.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-4">
                                  {task.tags.map(tag => (
                                    <span key={tag} className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded text-[10px] font-bold flex items-center gap-1">
                                      <TagIcon className="w-2.5 h-2.5" />
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                              
                              <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-50 dark:border-zinc-800">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                                  <Calendar className="w-3 h-3" />
                                  {format(new Date(task.createdAt), 'MMM d')}
                                </div>
                                <div className="w-6 h-6 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center border border-white dark:border-zinc-900">
                                  <User className="w-3 h-3 text-zinc-400" />
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        title="Delete Task"
        footer={
          <>
            <button
              onClick={() => setTaskToDelete(null)}
              className="px-4 py-2 text-zinc-600 dark:text-zinc-400 font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              onClick={confirmDeleteTask}
              className="px-4 py-2 bg-red-600 text-white font-bold hover:bg-red-700 rounded-xl transition-all shadow-lg shadow-red-600/20"
            >
              Delete Task
            </button>
          </>
        }
      >
        <div className="flex items-center gap-4 text-zinc-600 dark:text-zinc-400">
          <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <p>Are you sure you want to delete <span className="font-bold text-zinc-900 dark:text-white">"{taskToDelete?.title}"</span>? This action cannot be undone.</p>
        </div>
      </Modal>
    </div>
  );
}

