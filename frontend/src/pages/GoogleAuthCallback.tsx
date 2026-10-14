import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * GoogleAuthCallback — landing page after Google OAuth redirect.
 * Reads ?token=...&user=... from the URL (set by the backend),
 * stores them in localStorage, then redirects to the appropriate dashboard.
 */
export const GoogleAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    const userRaw = searchParams.get('user');
    const authError = searchParams.get('error');

    if (authError || !token || !userRaw) {
      setError('Google sign-in failed. Please try again or use your institutional email.');
      setTimeout(() => navigate('/login', { replace: true }), 3000);
      return;
    }

    try {
      const user = JSON.parse(decodeURIComponent(userRaw));

      // Store exactly like the normal login flow
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));

      // Redirect to the correct dashboard
      const role = (user.role || '').toLowerCase();
      navigate(role === 'staff' ? '/staff/dashboard' : '/dashboard', { replace: true });
    } catch {
      setError('Failed to process sign-in data. Please try again.');
      setTimeout(() => navigate('/login', { replace: true }), 3000);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center px-6"
      >
        {error ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-rose-900/40 border border-rose-500/30 flex items-center justify-center">
              <AlertCircle size={26} className="text-rose-400" />
            </div>
            <p className="text-white font-semibold text-lg">Sign-in failed</p>
            <p className="text-slate-400 text-sm max-w-xs">{error}</p>
            <p className="text-slate-500 text-xs">Redirecting to login...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center">
              <Sparkles size={26} className="text-indigo-300 animate-pulse" />
            </div>
            <p className="text-white font-semibold text-lg">Signing you in with Google...</p>
            <p className="text-slate-400 text-sm">Please wait a moment</p>
            <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden mt-2">
              <motion.div
                className="h-full bg-indigo-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
