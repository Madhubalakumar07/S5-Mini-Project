import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Sidebar } from '../components/sidebar/Sidebar';
import { Topbar } from '../components/topbar/Topbar';
import { AIMentorDrawer } from '../components/shared/AIMentorDrawer';

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);

  const sidebarWidth = sidebarCollapsed ? 72 : 240;

  return (
    <div className="min-h-screen bg-surface">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((v) => !v)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main content area pushed right by sidebar on desktop */}
      <motion.div
        animate={{ paddingLeft: sidebarWidth }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden lg:block"
        style={{ minHeight: '100vh' }}
      >
        {/* Top bar */}
        <div className="sticky top-0 z-20">
          <Topbar
            onMobileMenuToggle={() => setMobileMenuOpen((v) => !v)}
            mobileMenuOpen={mobileMenuOpen}
          />
        </div>
        {/* Page Content */}
        <main className="p-6 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>

      {/* Mobile: full width */}
      <div className="lg:hidden flex flex-col min-h-screen">
        <div className="sticky top-0 z-20">
          <Topbar
            onMobileMenuToggle={() => setMobileMenuOpen((v) => !v)}
            mobileMenuOpen={mobileMenuOpen}
          />
        </div>
        <main className="flex-1 p-4 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating AI Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setAiDrawerOpen(true)}
        className="fixed bottom-6 right-6 flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white px-4 py-3 rounded-2xl shadow-xl shadow-indigo-500/35 hover:shadow-indigo-500/50 transition-all z-30 font-semibold text-sm border border-indigo-400/30"
        aria-label="Open AI Mentor"
      >
        <Sparkles size={17} />
        <span className="hidden sm:inline">AI Mentor</span>
      </motion.button>

      {/* AI Mentor Drawer */}
      <AIMentorDrawer isOpen={aiDrawerOpen} onClose={() => setAiDrawerOpen(false)} />
    </div>
  );
};
