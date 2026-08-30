import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  GraduationCap,
  Hash,
  Phone,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  TrendingUp,
  Award,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DEMO_ACCOUNTS = [
  {
    name: 'Arun Kumar',
    email: 'arun.kumar@college.edu',
    dept: 'Computer Science',
    roll: '21CS001',
    cgpa: 8.4,
    avatar: 'AK',
    color: 'bg-emerald-600',
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@college.edu',
    dept: 'AI & Data Science',
    roll: '21AD045',
    cgpa: 9.1,
    avatar: 'PS',
    color: 'bg-blue-600',
  },
  {
    name: 'Rahul Verma',
    email: 'rahul.verma@college.edu',
    dept: 'Electronics & Comm',
    roll: '20EC089',
    cgpa: 8.2,
    avatar: 'RV',
    color: 'bg-purple-600',
  },
];

const DEPARTMENTS = [
  'Computer Science',
  'Artificial Intelligence & Data Science',
  'Information Technology',
  'Electronics & Communication',
  'Electrical & Electronics',
  'Mechanical Engineering',
];

export const Login: React.FC = () => {
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [rollNumber, setRollNumber] = useState('');
  const [phone, setPhone] = useState('');

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login({ email, password });
        navigate('/dashboard', { replace: true });
      } else {
        await register({
          name,
          email,
          password,
          department,
          rollNumber,
          phone,
        });
        setSuccessMsg('Account created successfully! Welcome aboard.');
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 600);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demo: (typeof DEMO_ACCOUNTS)[0]) => {
    setEmail(demo.email);
    setPassword('password123');
    setError(null);
    setLoading(true);
    try {
      await login({ email: demo.email, password: 'password123' });
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      // If backend mock is freshly restarted and demo user wasn't registered in DB, register directly
      try {
        await register({
          name: demo.name,
          email: demo.email,
          password: 'password123',
          department: demo.dept,
          rollNumber: demo.roll,
          cgpa: demo.cgpa,
        });
        navigate('/dashboard', { replace: true });
      } catch (regErr: any) {
        setError(regErr.message || 'Quick login failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background glowing gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-5xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10"
      >
        {/* Left Visual / Branding Column */}
        <div className="lg:col-span-5 bg-gradient-to-br from-brand-600 via-brand-700 to-slate-900 p-8 lg:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl" />

          {/* Logo & Header */}
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                <Sparkles size={22} className="text-emerald-300" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight">CampusAI</h1>
                <p className="text-xs text-emerald-200/80 font-medium">Student Performance & Career Suite</p>
              </div>
            </div>

            <div className="mt-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-emerald-300 border border-white/15">
                <ShieldCheck size={13} /> Institutional Access Only
              </span>
              <h2 className="text-2xl lg:text-3xl font-extrabold mt-3 leading-snug">
                Your entire academic journey in one smart hub.
              </h2>
              <p className="text-sm text-gray-300 mt-2.5 leading-relaxed">
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
              <div key={idx} className="flex items-start gap-3 bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10">
                <div className="w-8 h-8 rounded-lg bg-emerald-400/20 flex items-center justify-center flex-shrink-0 text-emerald-300 mt-0.5">
                  <item.icon size={16} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">{item.title}</p>
                  <p className="text-[11px] text-gray-300 leading-tight mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-300">
            <span>Academic Year 2025–2026</span>
            <span className="font-semibold text-emerald-300">v2.4 Live</span>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white">
          <div>
            {/* Header Tabs */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <div>
                <h3 className="text-2xl font-bold text-charcoal">
                  {mode === 'login' ? 'Welcome Back' : 'Create Student Account'}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {mode === 'login'
                    ? 'Enter your credentials to access your student dashboard'
                    : 'Register with your institutional details to get started'}
                </p>
              </div>

              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    mode === 'login'
                      ? 'bg-white text-brand-600 shadow-sm'
                      : 'text-gray-500 hover:text-charcoal'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    mode === 'register'
                      ? 'bg-white text-brand-600 shadow-sm'
                      : 'text-gray-500 hover:text-charcoal'
                  }`}
                >
                  Register
                </button>
              </div>
            </div>

            {/* Quick Demo Accounts Selection */}
            {mode === 'login' && (
              <div className="mb-6 bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-brand-500" />
                    Quick 1-Click Demo Profiles
                  </span>
                  <span className="text-[11px] text-gray-400">Click to switch user</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {DEMO_ACCOUNTS.map((demo) => (
                    <button
                      key={demo.email}
                      type="button"
                      onClick={() => handleQuickLogin(demo)}
                      disabled={loading}
                      className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-gray-200 hover:border-brand-500 hover:shadow-sm transition-all text-left group"
                    >
                      <div
                        className={`w-7 h-7 ${demo.color} rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                      >
                        {demo.avatar}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-charcoal truncate group-hover:text-brand-600">
                          {demo.name}
                        </p>
                        <p className="text-[10px] text-gray-400 truncate">{demo.dept}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Alerts */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700"
              >
                <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-700"
              >
                <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-charcoal mb-1">Department</label>
                      <div className="relative">
                        <GraduationCap size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-charcoal"
                        >
                          {DEPARTMENTS.map((dept) => (
                            <option key={dept} value={dept}>
                              {dept}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-charcoal mb-1">Roll / Register No</label>
                      <div className="relative">
                        <Hash size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={rollNumber}
                          onChange={(e) => setRollNumber(e.target.value)}
                          placeholder="e.g. 21CS102"
                          className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  College Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@college.edu"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-charcoal">
                    Password <span className="text-red-500">*</span>
                  </label>
                  {mode === 'login' && (
                    <span className="text-[11px] text-brand-600 font-medium hover:underline cursor-pointer">
                      Forgot Password?
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your secure password"
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {mode === 'login' && (
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-gray-300 text-brand-500 focus:ring-brand-500 w-3.5 h-3.5"
                    />
                    Keep me logged in
                  </label>
                  <span className="text-gray-400">Default pwd: <code className="text-brand-600 font-mono">password123</code></span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed group mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Sign In to CampusAI' : 'Create Student Account'}</span>
                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="pt-6 mt-6 border-t border-gray-100 text-center text-xs text-gray-400">
            {mode === 'login' ? (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError(null);
                  }}
                  className="font-semibold text-brand-600 hover:underline"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className="font-semibold text-brand-600 hover:underline"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
