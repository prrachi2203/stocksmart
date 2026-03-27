import React from 'react';
import { BookOpen, CheckCircle2, PlayCircle, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { User, LearningTopic } from '../types';
import { db, collection, onSnapshot, handleFirestoreError, OperationType } from '../firebase';

interface LearningModuleProps {
  user: User;
}

export default function LearningModule({ user }: LearningModuleProps) {
  const [modules, setModules] = React.useState<LearningTopic[]>([]);

  React.useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'learning_content'), (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LearningTopic));
      setModules(list.sort((a, b) => (a as any).order - (b as any).order));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'learning_content'));

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold text-slate-200">Learning Center</h1>
        <p className="text-slate-400 mt-1">Master the markets with our curated learning paths.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {modules.length > 0 ? modules.map((module, i) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            key={module.id} 
            className="glass p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 rounded-xl bg-accent-green/10 text-accent-green">
                <BookOpen size={24} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${module.progress === 100 ? 'bg-accent-green/20 text-accent-green' : 'bg-white/5 text-slate-400'}`}>
                {module.progress === 100 ? 'Completed' : module.progress > 0 ? 'In Progress' : 'Not Started'}
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-200 group-hover:text-accent-green transition-colors">{module.title}</h3>
            
            <div className="flex items-center gap-4 mt-4 text-sm text-slate-400">
              <div className="flex items-center gap-1">
                <Clock size={14} />
                {(module as any).duration || '30m'}
              </div>
              <div className="flex items-center gap-1">
                <PlayCircle size={14} />
                {(module as any).lessons || 10} Lessons
              </div>
            </div>

            <div className="mt-8">
              <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                <span>Progress</span>
                <span>{module.progress}%</span>
              </div>
              <div className="h-2 bg-brand-surface rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${module.progress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-accent-green shadow-[0_0_10px_rgba(100,255,218,0.5)]"
                />
              </div>
            </div>

            <button className="w-full mt-8 py-3 rounded-xl border border-accent-green/30 text-accent-green font-bold hover:bg-accent-green hover:text-navy-900 transition-all">
              {module.progress === 100 ? 'Review Module' : 'Continue Learning'}
            </button>
          </motion.div>
        )) : (
          <div className="col-span-full text-center py-20">
            <div className="w-12 h-12 border-4 border-accent-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Loading curriculum...</p>
          </div>
        )}
      </div>
    </div>
  );
}
