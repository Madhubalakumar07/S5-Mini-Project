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

const STUDENT_DEMO_ACCOUNTS = [
  {
    name: 'Arun Kumar',
    email: 'arun.kumar@college.edu',
    dept: 'Computer Science',
    roll: '21CS001',
    cgpa: 8.4,
    avatar: 'AK',
    role: 'student',
    color: 'bg-emerald-600',
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@college.edu',
    dept: 'AI & Data Science',
    roll: '21AD045',
    cgpa: 9.1,
    avatar: 'PS',
    role: 'student',
    color: 'bg-blue-600',
  },
  {
    name: 'Rahul Verma',
    email: 'rahul.verma@college.edu',
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
    email: 'priya.faculty@college.edu',
    dept: 'CSE · Class Advisor',
    roll: 'STF-CS-042',
    designation: 'Associate Professor',
    avatar: 'PS',
    role: 'staff',
    color: 'bg-indigo-600',
  },
  {
    name: 'Prof. Rajesh Kumar',
    email: 'rajesh.faculty@college.edu',
    dept: 'AI & DS · HOD',
    roll: 'STF-AD-018',
    designation: 'Professor & HOD',
    avatar: 'RK',
    role: 'staff',
    color: 'bg-violet-600',
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
  const { login, register, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [demoTab, setDemoTab] = useState<'student' | 'staff'>('student');
  const [regRole, setRegRole] = useState<'student' | 'staff'>('student');
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
  const [designation, setDesignation] = useState('Assistant Professor');
  const [phone, setPhone] = useState('');

  // If already authenticated, redirect to appropriate role dashboard
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
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login({ email, password });
        // Check email/role to route immediately
        const isStaffUser = email.toLowerCase().includes('faculty') || email.toLowerCase().includes('staff');
        navigate(isStaffUser ? '/staff/dashboard' : '/dashboard', { replace: true });
      } else {
        await register({
          name,
          email,
          password,
          role: regRole,
          department,
          rollNumber: regRole === 'staff' ? (rollNumber || 'STF-CS-099') : rollNumber,
          staffId: regRole === 'staff' ? (rollNumber || 'STF-CS-099') : undefined,
          designation: regRole === 'staff' ? designation : undefined,
          phone,
        });
        setSuccessMsg('Account created successfully! Welcome aboard.');
        setTimeout(() => {
          navigate(regRole === 'staff' ? '/staff/dashboard' : '/dashboard', { replace: true });
        }, 600);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
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
      await login({ email: demo.email, password: 'password123', role: demo.role });
      navigate(targetUrl, { replace: true });
    } catch (err: any) {
      try {
        await register({
          name: demo.name,
          email: demo.email,
          password: 'password123',
          role: demo.role,
          department: demo.dept,
          rollNumber: demo.roll,
          staffId: demo.role === 'staff' ? demo.roll : undefined,
          cgpa: (demo as any).cgpa,
          designation: (demo as any).designation,
        });
        navigate(targetUrl, { replace: true });
      } catch (regErr: any) {
        setError(regErr.message || 'Quick login failed.');
      }
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
            {/* Header Tabs */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {mode === 'login' ? 'Welcome Back' : 'Create Student Account'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  {mode === 'login'
                    ? 'Enter your credentials to access your student dashboard'
                    : 'Register with your institutional details to get started'}
                </p>
              </div>

              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    mode === 'login'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
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
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    mode === 'register'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Register
                </button>
              </div>
            </div>

            {/* Quick Demo Accounts Selection */}
            {mode === 'login' && (
              <div className="mb-6 bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-indigo-600" />
                    Quick 1-Click Demo Profiles
                  </span>

                  {/* Role selector tabs for demo profiles */}
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
                        <div
                          className={`w-7 h-7 ${demo.color} rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                        >
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
                        <div
                          className={`w-7 h-7 ${demo.color} rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                        >
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
            )}

            {/* Alerts */}
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

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-700 font-medium"
              >
                <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <>
                  {/* Role Selector in Registration */}
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1">Account Role</label>
                    <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setRegRole('student')}
                        className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                          regRole === 'student' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
                        }`}
                      >
                        Student Account
                      </button>
                      <button
                        type="button"
                        onClick={() => setRegRole('staff')}
                        className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                          regRole === 'staff' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
                        }`}
                      >
                        Faculty / Staff Account
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={regRole === 'staff' ? 'e.g. Dr. Priya Sharma' : 'e.g. Arun Kumar'}
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1">Department</label>
                      <div className="relative">
                        <GraduationCap size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                      <label className="block text-xs font-bold text-slate-900 mb-1">
                        {regRole === 'staff' ? 'Staff Employee ID' : 'Roll / Register No'}
                      </label>
                      <div className="relative">
                        <Hash size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={rollNumber}
                          onChange={(e) => setRollNumber(e.target.value)}
                          placeholder={regRole === 'staff' ? 'e.g. STF-CS-042' : 'e.g. 21CS102'}
                          className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {regRole === 'staff' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1">Designation</label>
                      <input
                        type="text"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="e.g. Associate Professor & Class Advisor"
                        className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>
                  )}
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  College Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@college.edu"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-900">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  {mode === 'login' && (
                    <span className="text-[11px] text-indigo-600 font-semibold hover:underline cursor-pointer">
                      Forgot Password?
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your secure password"
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

              {mode === 'login' && (
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                    />
                    Keep me logged in
                  </label>
                  <span className="text-slate-400">Default pwd: <code className="text-indigo-600 font-mono font-bold">password123</code></span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed group mt-2"
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

          <div className="pt-6 mt-6 border-t border-slate-100 text-center text-xs text-slate-400">
            {mode === 'login' ? (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError(null);
                  }}
                  className="font-bold text-indigo-600 hover:underline"
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
                  className="font-bold text-indigo-600 hover:underline"
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
