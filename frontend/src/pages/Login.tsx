import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

const STUDENT_DEMO_ACCOUNTS = [
  {
    name: 'Arun Kumar',
    email: 'arun.kumar@bitsathy.ac.in',
    dept: 'Computer Science',
    roll: '21CS001',
    cgpa: 8.4,
    avatar: 'AK',
    role: 'student',
    color: 'bg-emerald-600',
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@bitsathy.ac.in',
    dept: 'AI & Data Science',
    roll: '21AD045',
    cgpa: 9.1,
    avatar: 'PS',
    role: 'student',
    color: 'bg-blue-600',
  },
  {
    name: 'Rahul Verma',
    email: 'rahul.verma@bitsathy.ac.in',
    dept: 'Electronics & Comm',
    roll: '20EC089',
    cgpa: 8.2,
    avatar: 'RV',
    role: 'student',
    color: 'bg-purple-600',
  },
];

const STAFF_DEMO_ACCOUNTS = [
  {
    name: 'Dr. Priya Sharma',
    email: 'priya.faculty@bitsathy.ac.in',
    dept: 'CSE · Class Advisor',
    roll: 'STF-CS-042',
    designation: 'Associate Professor',
    avatar: 'PS',
    role: 'staff',
    color: 'bg-indigo-600',
  },
  {
    name: 'Prof. Rajesh Kumar',
    email: 'rajesh.faculty@bitsathy.ac.in',
    dept: 'AI & DS · HOD',
    roll: 'STF-AD-018',
    designation: 'Professor & HOD',
    avatar: 'RK',
    role: 'staff',
    color: 'bg-violet-600',
  },
];

export const Login: React.FC = () => {
  const { login, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [demoTab, setDemoTab] = useState<'student' | 'staff'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleQuickLogin = async (demo: (typeof STUDENT_DEMO_ACCOUNTS)[0] | (typeof STAFF_DEMO_ACCOUNTS)[0]) => {
    setEmail(demo.email);
    setPassword('password123');
    setError(null);
    setLoading(true);
    const targetUrl = demo.role === 'staff' ? '/staff/dashboard' : '/dashboard';
    try {
      await login({ email: demo.email, password: 'password123' });
      navigate(targetUrl, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Quick login failed. Ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background glowing gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-5xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10"
      >
        {/* Left Visual / Branding Column */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 p-8 lg:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl" />

          {/* Logo & Header */}
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                <Sparkles size={22} className="text-indigo-200" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight">CampusAI</h1>
                <p className="text-xs text-indigo-200/80 font-medium">Student Performance & Career Suite</p>
              </div>
            </div>

            <div className="mt-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-indigo-200 border border-white/15">
                <ShieldCheck size={13} /> Institutional Access Only
              </span>
              <h2 className="text-2xl lg:text-3xl font-extrabold mt-3 leading-snug">
                Your entire academic journey in one smart hub.
              </h2>
              <p className="text-sm text-slate-200/90 mt-2.5 leading-relaxed">
                Log in with your college credentials to track attendance, explore placement matches, and get real-time AI mentoring.
              </p>
            </div>
          </div>

          {/* Highlights */}
          <div className="space-y-3.5 my-8">
            {[
              { icon: TrendingUp, title: 'Smart Attendance Tracking', desc: 'Real-time subject-wise percentage and safe bunks calculator' },
              { icon: Award, title: 'Placement Match Engine', desc: 'Custom role matching, ATS resume scoring, and mock tests' },
              { icon: BookOpen, title: 'AI Mentor Copilot', desc: 'Instant personalized guidance for exams and coding prep' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
                <div className="w-8 h-8 rounded-lg bg-indigo-400/20 flex items-center justify-center flex-shrink-0 text-indigo-200 mt-0.5">
                  <item.icon size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{item.title}</p>
                  <p className="text-[11px] text-slate-200/80 leading-tight mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
            <span>Academic Year 2025–2026</span>
            <span className="font-bold text-indigo-200">v2.4 Live</span>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white">
          <div>
            {/* Header */}
            <div className="border-b border-slate-100 pb-5 mb-6">
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Enter your institutional credentials to access your dashboard
              </p>
            </div>

            {/* Quick Demo Accounts */}
            <div className="mb-6 bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-indigo-600" />
                  Quick 1-Click Demo Profiles
                </span>

                <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setDemoTab('student')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      demoTab === 'student'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Students (3)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDemoTab('staff')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      demoTab === 'staff'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Staff / Faculty (2)
                  </button>
                </div>
              </div>

              {demoTab === 'student' ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {STUDENT_DEMO_ACCOUNTS.map((demo) => (
                    <button
                      key={demo.email}
                      type="button"
                      onClick={() => handleQuickLogin(demo)}
                      disabled={loading}
                      className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-sm transition-all text-left group"
                    >
                      <div className={`w-7 h-7 ${demo.color} rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                        {demo.avatar}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600">
                          {demo.name}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate font-medium">{demo.dept}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {STAFF_DEMO_ACCOUNTS.map((demo) => (
                    <button
                      key={demo.email}
                      type="button"
                      onClick={() => handleQuickLogin(demo)}
                      disabled={loading}
                      className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-indigo-200/90 hover:border-indigo-500 hover:shadow-sm transition-all text-left group bg-gradient-to-r from-indigo-50/40 to-white"
                    >
                      <div className={`w-7 h-7 ${demo.color} rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                        {demo.avatar}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600">
                          {demo.name}
                        </p>
                        <p className="text-[10px] text-indigo-600 truncate font-semibold">{demo.dept}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 font-medium"
              >
                <AlertCircle size={16} className="text-rose-500 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Institutional Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={`you@${ORG_DOMAIN}`}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                  <p className="text-[10px] text-slate-400 mt-1 ml-1">Only @{ORG_DOMAIN} accounts permitted</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-900">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-indigo-600 font-semibold hover:underline cursor-pointer">
                    Forgot Password?
                  </span>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                  />
                  Keep me logged in
                </label>
                <span className="text-slate-400">Demo pwd: <code className="text-indigo-600 font-mono font-bold">password123</code></span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed group mt-2"
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
          </div>

          {/* Institutional notice — replaces "create account" link */}
          <div className="pt-6 mt-6 border-t border-slate-100">
            <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <Building2 size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-500 leading-relaxed">
                <span className="font-bold text-slate-700">Account access is managed by the institution.</span>{' '}
                Your login credentials are provided by the college administration. For access issues, contact your department coordinator or the IT helpdesk.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
