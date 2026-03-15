import { useState, useEffect } from 'react';
import { Team, UserProfile } from '../types';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { User, Shield, Mail, Calendar, Copy, Check } from 'lucide-react';
import { format } from 'date-fns';

interface TeamOverviewProps {
  team: Team;
  profile: UserProfile;
  searchQuery?: string;
}

export default function TeamOverview({ team, profile, searchQuery = '' }: TeamOverviewProps) {
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'users'),
      where('teamId', '==', team.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMembers(snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
    });

    return () => unsubscribe();
  }, [team.id]);

  const copyId = () => {
    navigator.clipboard.writeText(team.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredMembers = members.filter(member => {
    const q = searchQuery.toLowerCase();
    return (
      member.name.toLowerCase().includes(q) ||
      member.email.toLowerCase().includes(q) ||
      member.role.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Team Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Team Details</h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Team Name</label>
                <p className="text-zinc-900 dark:text-white font-semibold">{team.name}</p>
              </div>
              
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Description</label>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">{team.description || 'No description provided.'}</p>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Team ID (Invite Code)</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-600 dark:text-zinc-400 flex-1 truncate">
                    {team.id}
                  </code>
                  <button 
                    onClick={copyId}
                    className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400">Total Members</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{members.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Members List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Team Members</h3>
            </div>
            
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredMembers.map((member) => (
                <div key={member.uid} className="p-6 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                      <User className="w-6 h-6 text-zinc-400 dark:text-zinc-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-white">{member.name}</h4>
                      <div className="flex items-center gap-3 mt-0.5">
                        <div className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500">
                          <Mail className="w-3 h-3" />
                          {member.email}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500">
                          <Calendar className="w-3 h-3" />
                          Joined {format(new Date(member.createdAt), 'MMM yyyy')}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    member.role === 'ADMIN' ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900' :
                    member.role === 'MANAGER' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                    'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}>
                    <Shield className="w-3 h-3" />
                    {member.role}
                  </div>
                </div>
              ))}

              {filteredMembers.length === 0 && (
                <div className="p-12 text-center">
                  <User className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-zinc-900 dark:text-white">No members found</h4>
                  <p className="text-zinc-500 dark:text-zinc-400">Try adjusting your search query.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
