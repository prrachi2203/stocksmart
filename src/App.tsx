/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LearningModule from './components/LearningModule';
import MarketAnalysis from './components/MarketAnalysis';
import MyPortfolio from './components/MyPortfolio';
import { User, Role } from './types';
import { auth, db, googleProvider, signInWithPopup, onAuthStateChanged, signOut, doc, getDoc, setDoc } from './firebase';
import { LogIn, AlertTriangle, Activity, TrendingUp } from 'lucide-react';

// Error Boundary Component
interface ErrorBoundaryProps { children: ReactNode; }
interface ErrorBoundaryState { hasError: boolean; error: Error | null; }

// Simple Error Boundary Wrapper (Functional)
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default function App() {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Check if user exists in Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as User);
        } else {
          // Create new user profile
          const newUser: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'Anonymous User',
            email: firebaseUser.email || '',
            role: 'customer' // Default role
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), {
            ...newUser,
            createdAt: new Date().toISOString()
          });
          setUser(newUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setActiveTab('dashboard');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-brand-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen bg-brand-bg flex items-center justify-center p-4">
        <div className="glass p-10 rounded-[40px] border border-white/5 max-w-md w-full text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-green to-transparent" />
          <div className="w-20 h-20 bg-accent-green/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Activity className="text-accent-green w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold text-slate-200 mb-4 tracking-tight">StockSmart</h1>
          <p className="text-slate-400 mb-10 leading-relaxed">
            Let's analyse stock
          </p>
          <button 
            onClick={handleLogin}
            className="w-full py-4 bg-brand-surface text-slate-200 border border-white/10 font-bold rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(30,41,59,0.3)]"
          >
            <LogIn size={20} />
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-brand-bg overflow-hidden">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          role={user.role} 
          onLogout={handleLogout}
        />
        
        <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_50%_0%,#1E293B_0%,#121212_100%)]">
          {activeTab === 'dashboard' && <Dashboard user={user} />}
          {activeTab === 'learning' && <LearningModule user={user} />}
          {activeTab === 'market' && <MarketAnalysis user={user} />}
          {activeTab === 'portfolio' && <MyPortfolio user={user} />}
          {activeTab === 'settings' && (
            <div className="p-8 flex items-center justify-center h-full text-slate-400 italic">
              Settings view coming soon...
            </div>
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}
