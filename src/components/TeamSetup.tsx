import { useState } from 'react';
import { UserProfile } from '../types';
import { Users, Plus, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../services/api';

interface TeamSetupProps {
  user: any;
  onProfileCreated: (profile: UserProfile) => void;
}

export default function TeamSetup({ user, onProfileCreated }: TeamSetupProps) {
  const [mode, setMode] = useState<'choice' | 'create' | 'join'>('choice');
  const [teamName, setTeamName] = useState('');
  const [teamId, setTeamId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const createTeam = async () => {
    if (!teamName.trim()) return;
    setLoading(true);
    setError('');
    try {
      const team = await api.createTeam({
        name: teamName,
        adminId: user.uid,
        createdAt: new Date().toISOString()
      });

      const profile: UserProfile = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || 'Anonymous',
        role: 'ADMIN',
        teamId: team._id || team.id,
        createdAt: new Date().toISOString()
      };

      await api.saveUser(profile);
      onProfileCreated(profile);
    } catch (err) {
      console.error('Error creating team:', err);
      setError('Failed to create team. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const joinTeam = async () => {
    if (!teamId.trim()) return;
    setLoading(true);
    setError('');
    try {
      const team = await api.getTeam(teamId);
      if (!team) {
        setError('Team not found. Please check the ID.');
        setLoading(false);
        return;
      }

      const profile: UserProfile = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || 'Anonymous',
        role: 'MEMBER',
        teamId: teamId,
        createdAt: new Date().toISOString()
      };

      await api.saveUser(profile);
      onProfileCreated(profile);
    } catch (err) {
      console.error('Error joining team:', err);
      setError('Failed to join team. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-10">
        {mode === 'choice' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="text-zinc-600 dark:text-zinc-400 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Welcome to CollabHub</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-8">Set up your team to start collaborating</p>
            
            <div className="space-y-4">
              <button
                onClick={() => setMode('create')}
                className="w-full p-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-semibold hover:opacity-90 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Plus className="w-5 h-5" />
                  Create a new team
                </div>
                <ArrowRight className="w-5 h-5 opacity-50" />
              </button>
              
              <button
                onClick={() => setMode('join')}
                className="w-full p-4 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-2xl font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  Join an existing team
                </div>
                <ArrowRight className="w-5 h-5 opacity-50" />
              </button>
            </div>
          </div>
        )}

        {mode === 'create' && (
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Create a Team</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6">Give your team a name to get started</p>
            
            <input
              type="text"
              placeholder="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl mb-4 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 dark:text-white"
            />
            
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => setMode('choice')}
                className="flex-1 p-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
              >
                Back
              </button>
              <button
                onClick={createTeam}
                disabled={loading || !teamName.trim()}
                className="flex-[2] p-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Team'}
              </button>
            </div>
          </div>
        )}

        {mode === 'join' && (
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Join a Team</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6">Enter the team ID provided by your admin</p>
            
            <input
              type="text"
              placeholder="Team ID"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl mb-4 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 dark:text-white"
            />
            
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            
            <div className="flex gap-3">
              <button
                onClick={() => setMode('choice')}
                className="flex-1 p-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
              >
                Back
              </button>
              <button
                onClick={joinTeam}
                disabled={loading || !teamId.trim()}
                className="flex-[2] p-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Join Team'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
