import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, ChevronRight } from 'lucide-react';

interface Message {
  id: string;
  role: 'ai' | 'user';
  text: string;
  timestamp: string;
}

interface AIMentorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'ai',
    text: "Hi Arun! 👋 Based on your recent performance, I recommend focusing on Computer Networks and DSA this week. Your CN attendance is at 72.4% — below the 75% threshold.",
    timestamp: 'Just now',
  },
];

const quickActions = [
  'Create Study Plan',
  'Improve Attendance',
  'Practice DSA',
  'Prepare for Placement',
];

const aiResponses: Record<string, string> = {
  'Create Study Plan': "Great choice! Based on your weak areas, here's a focused plan:\n\n📅 Mon: Data Structures — Trees & Graphs (45 min)\n📅 Tue: Operating Systems — Process Scheduling (40 min)\n📅 Wed: Coding Practice — 3 LeetCode mediums (60 min)\n📅 Thu: Computer Networks — Routing Algorithms (45 min)\n📅 Fri: DBMS — Normalization review (40 min)\n📅 Sat: Full Mock Test (90 min)\n\nShall I add this to your calendar?",
  'Improve Attendance': "Your Computer Networks attendance is at 72.4% — you need to attend the next 2 consecutive classes to get back above the 75% threshold. Here's what I suggest:\n\n✅ Enable morning reminders for CN class\n✅ Mark CN classes as high priority in your schedule\n✅ Attend the next 3 classes without fail\n\nYou're doing great in AI & ML (93.8%) and DSA (91.4%)! Keep it up.",
  'Practice DSA': "For DSA practice this week, I recommend:\n\n🟢 Easy (warm up): Two Sum, Valid Parentheses\n🟡 Medium (focus): Binary Tree Level Order, LRU Cache, Word Search\n🔴 Hard (stretch): Merge K Sorted Lists\n\nBased on your current rating of 1542, you're close to the 1600 threshold. Solving 2 mediums per day will get you there in ~10 days.",
  'Prepare for Placement': "For placement prep, here's your priority order:\n\n1️⃣ DSA — 248/345 done (72%). Do 2 problems daily\n2️⃣ Core CS — OS, Networks, DBMS theory review\n3️⃣ Aptitude — Practice 30 min daily on Quant & LR\n4️⃣ Communication — Record mock answers to HR questions\n\nYour resume is 90% complete — just add your Achievements section!\n\nBased on your current profile, TCS (92% match) and Infosys (88% match) look very promising.",
};

export const AIMentorDrawer: React.FC<AIMentorDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: 'Just now',
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = aiResponses[text] || 
        "That's a great question! Based on your profile, I'd recommend focusing on your weak areas first — Computer Networks and Operating Systems. Would you like me to create a specific study plan for these subjects?";
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: response,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-drawer z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-brand-500 to-brand-600">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">AI Student Mentor</p>
                  <p className="text-xs text-brand-100">Powered by CampusAI</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close AI mentor"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'ai' && (
                    <div className="w-7 h-7 bg-brand-50 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                      <Sparkles size={12} className="text-brand-500" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-brand-500 text-white rounded-tr-sm'
                        : 'bg-gray-50 text-gray-700 border border-gray-100 rounded-tl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="w-7 h-7 bg-brand-50 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                    <Sparkles size={12} className="text-brand-500" />
                  </div>
                  <div className="bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm">
                    <div className="flex items-center gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-2 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-2 font-medium">Quick Actions</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action}
                    onClick={() => sendMessage(action)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-brand-50 text-brand-600 text-xs font-medium rounded-lg hover:bg-brand-100 transition-colors border border-brand-100"
                  >
                    {action}
                    <ChevronRight size={10} />
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask your AI mentor..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim()}
                  className="p-2 bg-brand-500 text-white rounded-xl hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
