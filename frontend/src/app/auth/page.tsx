'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // If already logged in, skip auth
    if (localStorage.getItem('token')) router.push('/');
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Logic for Auth (Local storage sync)
      const userData = {
        id: `user_${Math.floor(Math.random() * 100000)}`,
        username: formData.username || formData.email.split('@')[0],
        email: formData.email
      };
      
      localStorage.setItem('token', 'session_id_' + Date.now());
      localStorage.setItem('user', JSON.stringify(userData));
      
      router.push('/');
    } catch (err: any) {
      setError('Operational error. Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#050505] text-white relative flex-col font-sans overflow-hidden">
       <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent opacity-50 blur-3xl" />
       
       <motion.div 
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         className="w-full max-w-sm glass-card p-10 relative z-10 border border-white/5 bg-white/[0.02] backdrop-blur-3xl"
       >
          <div className="flex flex-col items-center mb-10">
             <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                <ShieldCheck className="text-emerald-500" size={32} />
             </div>
             <h1 className="text-3xl font-black tracking-tighter uppercase italic text-center">
                {isLogin ? 'Secure Access' : 'Create Node'}
             </h1>
             <p className="text-zinc-500 text-[10px] mt-3 uppercase tracking-[0.3em] font-bold text-center">
                AUTHORIZED PERSONNEL ONLY
             </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
             {!isLogin && (
               <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                  <input
                    type="text"
                    placeholder="USERNAME"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-xs font-bold tracking-widest focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-white/10"
                  />
               </div>
             )}

             <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                <input
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-xs font-bold tracking-widest focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-white/10"
                />
             </div>

             <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                <input
                  type="password"
                  placeholder="ENCRYPTION KEY"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-xs font-bold tracking-widest focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-white/10"
                />
             </div>

             {error && <p className="text-red-500 text-[10px] font-bold text-center">{error}</p>}

             <button
               disabled={loading}
               type="submit"
               className="w-full bg-emerald-500 text-black font-black py-4 rounded-xl shadow-[0_10px_30px_rgba(16,185,129,0.2)] hover:scale-[1.02] transition-all flex items-center justify-center gap-3 mt-6 text-xs uppercase italic tracking-widest"
             >
                {loading ? 'SYNCING...' : (isLogin ? 'Authorize' : 'Verify')}
                <ArrowRight size={16} />
             </button>
          </form>

          <div className="mt-8 text-center text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">
             {isLogin ? "No active node?" : "Already verified?"}
             <button onClick={() => setIsLogin(!isLogin)} className="text-emerald-500 ml-2 hover:text-emerald-400 transition-colors">
                {isLogin ? 'Register' : 'Login'}
             </button>
          </div>
       </motion.div>
    </main>
  );
}
