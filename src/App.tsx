/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { UserProfile, Team } from './types';
import { ErrorBoundary } from './components/ErrorBoundary';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import TeamSetup from './components/TeamSetup';
import { Loader2 } from 'lucide-react';
import { api } from './services/api';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const userData = await api.getUser(firebaseUser.uid);
          if (userData) {
            setProfile(userData);
            
            if (userData.teamId) {
              const teamData = await api.getTeam(userData.teamId);
              if (teamData) {
                setTeam(teamData);
              }
            }
          } else {
            setProfile(null);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      } else {
        setUser(null);
        setProfile(null);
        setTeam(null);
      }
      setAuthReady(true);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Poll for team changes (since we don't have real-time MongoDB listeners easily set up here)
  useEffect(() => {
    if (profile?.teamId) {
      const interval = setInterval(async () => {
        try {
          const teamData = await api.getTeam(profile.teamId!);
          if (teamData) setTeam(teamData);
        } catch (error) {
          console.error("Error polling team:", error);
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [profile?.teamId]);

  if (!authReady || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      {!user ? (
        <Login />
      ) : !profile || !profile.teamId ? (
        <TeamSetup user={user} onProfileCreated={(p) => setProfile(p)} />
      ) : (
        <Dashboard user={user} profile={profile} team={team!} />
      )}
    </ErrorBoundary>
  );
}

