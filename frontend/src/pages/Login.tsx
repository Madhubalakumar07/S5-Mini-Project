import React, { useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck,
  TrendingUp,
  Award,
  BookOpen,
  Building2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ORG_DOMAIN = 'bitsathy.ac.in';

export const Login: React.FC = () => {
  const { login, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  // Pick up any error message the backend injected via redirect (e.g., domain restriction)
  const urlError = searchParams.get('msg')
    ? decodeURIComponent(searchParams.get('msg')!)
    : searchParams.get('error') === 'domain_restricted'
    ? `Only @${ORG_DOMAIN} Google accounts are permitted. Use your institutional email.`
    : searchParams.get('error') === 'google_auth_failed'
    ? 'Google sign-in failed. Please try again.'
    : null;

  const [error, setError] = useState<string | null>(urlError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // If already authenticated, redirect to the appropriate dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      const defaultDest = role === 'staff' ? '/staff/dashboard' : '/dashboard';
      const from = (location.state as any)?.from?.pathname;
      const target = from && from !== '/login' ? from : defaultDest;
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, role, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailNorm = email.trim().toLowerCase();
    if (!emailNorm.endsWith(`@${ORG_DOMAIN}`)) {
      setError(`Only official @${ORG_DOMAIN} email addresses are permitted.`);
      return;
    }

    setLoading(true);
    try {
      await login({ email: emailNorm, password });
      const storedUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
      const userRole = (storedUser.role || '').toLowerCase();
      navigate(userRole === 'staff' ? '/staff/dashboard' : '/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Redirect to backend Google OAuth endpoint — passport handles the rest
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div className="min-h-screen w-full flex overflow-hidden">
      {/* ── LEFT PANEL – Branding ── */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative flex-col justify-between overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #3730a3 0%, #4f46e5 40%, #1e1b4b 100%)',
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-indigo-300/10 blur-2xl" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 flex flex-col h-full px-10 xl:px-14 py-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
              <Sparkles size={22} className="text-indigo-200" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white">CampusAI</h1>
              <p className="text-xs text-indigo-200/80 font-medium">Student Performance & Career Suite</p>
            </div>
          </div>

          {/* Hero text */}
          <div className="mt-auto mb-auto pt-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-indigo-200 border border-white/15 mb-4">
              <ShieldCheck size={13} /> Institutional Access Only
            </span>
            <h2 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight">
              Your entire academic<br />journey in one<br />
              <span className="text-indigo-300">smart hub.</span>
            </h2>
            <p className="text-sm text-slate-300/90 mt-4 leading-relaxed max-w-md">
              Log in with your college credentials to track attendance, explore placement matches, and get real-time AI mentoring.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="space-y-3 mb-12">
            {[
              { icon: TrendingUp, title: 'Smart Attendance Tracking', desc: 'Real-time subject-wise percentage and safe bunks calculator' },
              { icon: Award, title: 'Placement Match Engine', desc: 'Custom role matching, ATS resume scoring, and mock tests' },
              { icon: BookOpen, title: 'AI Mentor Copilot', desc: 'Instant personalized guidance for exams and coding prep' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1, duration: 0.4 }}
                className="flex items-start gap-3 bg-white/8 backdrop-blur-sm p-3.5 rounded-xl border border-white/10 hover:bg-white/12 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-400/20 flex items-center justify-center flex-shrink-0 text-indigo-200 mt-0.5">
                  <item.icon size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{item.title}</p>
                  <p className="text-[11px] text-slate-300/80 leading-tight mt-0.5">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom strip */}
          <div className="border-t border-white/10 pt-4 flex items-center justify-between text-xs text-slate-300">
            <span>Academic Year 2025–2026</span>
            <span className="font-bold text-indigo-300">v2.4 Live</span>
          </div>
        </div>
      </motion.div>

      {/* ── RIGHT PANEL – Form ── */}
      <motion.div
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="w-full lg:w-1/2 xl:w-[45%] flex flex-col justify-center bg-slate-950 relative overflow-hidden px-6 sm:px-12 lg:px-14 xl:px-20 py-12"
      >
        {/* Subtle background glow */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-md mx-auto">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white">CampusAI</h1>
              <p className="text-[11px] text-slate-400">Student Performance & Career Suite</p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h3 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back 👋</h3>
            <p className="text-sm text-slate-400 mt-1.5">Sign in to access your institutional dashboard</p>
          </div>

          {/* Error alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 bg-rose-950/60 border border-rose-500/30 rounded-xl flex items-start gap-2.5 text-xs text-rose-300 font-medium"
            >
              <AlertCircle size={16} className="text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Google Sign-In button */}
          <button
            id="google-signin-btn"
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md active:scale-[0.99] mb-5"
          >
            {/* Google G icon */}
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-xs text-slate-500 font-medium">or sign in with email</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Institutional Email <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={`you@${ORG_DOMAIN}`}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5 ml-1">Only @{ORG_DOMAIN} accounts are permitted</p>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Password <span className="text-rose-400">*</span>
                </label>
                <span className="text-[11px] text-indigo-400 font-semibold hover:text-indigo-300 hover:underline cursor-pointer transition-colors">
                  Forgot Password?
                </span>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-3 text-sm bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400 font-medium hover:text-slate-300 transition-colors">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-600 bg-slate-800 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                Keep me logged in
              </label>
            </div>

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed group active:scale-[0.99] mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to CampusAI</span>
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Institutional notice */}
          <div className="mt-8 flex items-start gap-3 bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
            <Building2 size={16} className="text-slate-500 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-500 leading-relaxed">
              <span className="font-bold text-slate-400">Account access is managed by the institution.</span>{' '}
              Your login credentials are provided by the college administration. For access issues, contact your department coordinator or the IT helpdesk.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};


