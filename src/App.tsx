/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { UserProfile, Team } from './types';
import { ErrorBoundary } from './components/ErrorBoundary';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import TeamSetup from './components/TeamSetup';
import { Loader2 } from 'lucide-react';

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
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserProfile;
            setProfile(userData);
            
            if (userData.teamId) {
              const teamDoc = await getDoc(doc(db, 'teams', userData.teamId));
              if (teamDoc.exists()) {
                setTeam({ id: teamDoc.id, ...teamDoc.data() } as Team);
              }
            }
          } else {
            // New user - profile will be created during team setup or login
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

  // Listen for team changes if profile exists
  useEffect(() => {
    if (profile?.teamId) {
      const unsubscribe = onSnapshot(doc(db, 'teams', profile.teamId), (doc) => {
        if (doc.exists()) {
          setTeam({ id: doc.id, ...doc.data() } as Team);
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, `teams/${profile.teamId}`);
      });
      return () => unsubscribe();
    }
  }, [profile?.teamId]);

  if (!authReady || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
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

