import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, X, Send, ChevronRight, FileText, Upload, Briefcase,
  CheckCircle, AlertTriangle, BookOpen, Clock, Award, HelpCircle,
  RefreshCw, ArrowRight, Check, Copy, ExternalLink, Zap, Trash2, Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { aiService } from '../../services/aiService';
import type { SummarizePdfResult, CompanyRecruitmentProfile, CompanyAnalysisResult } from '../../types';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  timestamp: string;
  actionType?: string;
  companyAnalysis?: CompanyAnalysisResult;
}

interface AIMentorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'chat' | 'pdf' | 'company';
  initialCompanyId?: string;
}

const quickPrompts = [
  { label: '🏢 Analyze Zoho Recruitment', prompt: 'Explain the complete Zoho recruitment process, Round 1 to 5, and past asked coding questions.' },
  { label: '💼 Prepare for TCS Drive', prompt: 'How do I prepare for TCS NQT (Foundation + Advanced) to get Digital or Prime package?' },
  { label: '⚡ Accenture Placement Tips', prompt: 'What are the stages and questions asked in Accenture on-campus placement?' },
  { label: '📈 Fix CN Attendance', prompt: 'How can I recover my Computer Networks attendance above 75%?' },
  { label: '📅 Weekly Study Plan', prompt: 'Create a weekly study plan focusing on my weak subjects and placement prep.' },
  { label: '💻 DSA Roadmap', prompt: 'Recommend key DSA topics and LeetCode problems for my current level.' },
];

export const AIMentorDrawer: React.FC<AIMentorDrawerProps> = ({
  isOpen,
  onClose,
  initialTab = 'chat',
  initialCompanyId,
}) => {
  const { student } = useAuth();
  const [activeTab, setActiveTab] = useState<'chat' | 'pdf' | 'company'>(initialTab);
  
  // ── Chat State ──────────────────────────────────────────────────────────
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome_1',
      role: 'assistant',
      text: `Hi ${student.firstName || student.name.split(' ')[0]}! 👋 I'm your **CampusAI Academic & Placement Mentor**.

I'm here to help you ace your exams and crack campus placements. Here is what we can do:
• 🏢 **Placement Intelligence:** In-depth analysis of recruitment procedures for **Zoho, TCS, Infosys, Accenture**, and Product companies.
• 📄 **Multi-PDF Study Summarizer:** Upload multiple lecture PDFs/notes to get instant exam guides, key formulas, and expected questions.
• 🎯 **Academic Support:** Targeted study plans and attendance recovery strategies.

How can I help you today?`,
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeCompanyContext, setActiveCompanyContext] = useState<string | null>(initialCompanyId || null);
  const [activePdfContext, setActivePdfContext] = useState<SummarizePdfResult | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // ── Multi-PDF Summarizer State ──────────────────────────────────────────
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [rawText, setRawText] = useState('');
  const [useTextInput, setUseTextInput] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [pdfSummaryResult, setPdfSummaryResult] = useState<SummarizePdfResult | null>(null);
  const [summaryActiveSubTab, setSummaryActiveSubTab] = useState<'overview' | 'concepts' | 'questions' | 'flashcards'>('overview');
  const [pdfError, setPdfError] = useState<string | null>(null);

  // ── Company Intelligence State ──────────────────────────────────────────
  const [companies, setCompanies] = useState<CompanyRecruitmentProfile[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(initialCompanyId || 'zoho');
  const [companyAnalysis, setCompanyAnalysis] = useState<CompanyAnalysisResult | null>(null);
  const [isLoadingCompany, setIsLoadingCompany] = useState(false);
  const [expandedRound, setExpandedRound] = useState<number | null>(1);

  // Sync initial tab and company if passed
  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
    if (initialCompanyId) {
      setSelectedCompanyId(initialCompanyId);
      setActiveCompanyContext(initialCompanyId);
    }
  }, [initialTab, initialCompanyId]);

  // Load companies list on open
  useEffect(() => {
    if (isOpen) {
      aiService.getCompanies().then((data) => {
        if (data && data.length > 0) {
          setCompanies(data);
        }
      }).catch(console.error);
    }
  }, [isOpen]);

  // Fetch company analysis when selectedCompanyId changes
  useEffect(() => {
    if (selectedCompanyId && isOpen) {
      setIsLoadingCompany(true);
      aiService.analyzeCompany(selectedCompanyId).then((result) => {
        setCompanyAnalysis(result);
        setIsLoadingCompany(false);
      }).catch((err) => {
        console.error(err);
        setIsLoadingCompany(false);
      });
    }
  }, [selectedCompanyId, isOpen]);

  // Auto-scroll chat
  useEffect(() => {
    if (activeTab === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, activeTab]);

  // Handle Send Message
  const sendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: messageContent,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.text,
      }));

      const studyContext = activePdfContext
        ? `Document: ${activePdfContext.title}\nSummary: ${activePdfContext.executiveSummary}\nKey Concepts: ${activePdfContext.keyConcepts.map(c => c.title).join(', ')}`
        : undefined;

      const response = await aiService.chat(
        messageContent,
        historyPayload,
        activeCompanyContext || undefined,
        studyContext
      );

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: response.text,
        timestamp: 'Just now',
        actionType: response.actionType,
        companyAnalysis: response.companyAnalysis,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: `⚠️ ${err.message || 'Unable to generate response right now. Please try again.'}`,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle File Input Change (Support multiple files)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setPdfFiles((prev) => {
        const existingNames = new Set(prev.map(f => f.name));
        const filteredNew = newFiles.filter(f => !existingNames.has(f.name));
        return [...prev, ...filteredNew];
      });
      setPdfError(null);
    }
  };

  const removeFile = (index: number) => {
    setPdfFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle PDF / Text Summarization
  const handleSummarize = async () => {
    if (pdfFiles.length === 0 && !rawText.trim()) {
      setPdfError('Please choose one or more PDF files or paste study notes.');
      return;
    }

    setPdfError(null);
    setIsSummarizing(true);

    try {
      let result: SummarizePdfResult;
      if (pdfFiles.length > 0) {
        result = await aiService.summarizeStudyMaterial(pdfFiles, undefined, student.department);
      } else {
        result = await aiService.summarizeStudyMaterial(rawText, 'Pasted Study Notes', student.department);
      }

      setPdfSummaryResult(result);
      setActivePdfContext(result);
      setSummaryActiveSubTab('overview');
    } catch (err: any) {
      setPdfError(err.message || 'Failed to summarize the document. Please try again.');
    } finally {
      setIsSummarizing(false);
    }
  };

  // Load sample lecture notes for fast demo
  const loadSampleNotes = () => {
    setUseTextInput(true);
    setRawText(`Computer Networks — Unit 3: Transport Layer Protocols

The Transport Layer is responsible for process-to-process delivery of messages.
1. Transmission Control Protocol (TCP):
   - Connection-oriented protocol providing reliable, ordered, and error-checked delivery.
   - Three-way handshake: SYN -> SYN-ACK -> ACK.
   - Flow Control: Uses Sliding Window mechanism to prevent receiver buffer overflow.
   - Congestion Control: Implements Slow Start, Congestion Avoidance, Fast Retransmit, and Fast Recovery.
   - Header size: 20 to 60 bytes.

2. User Datagram Protocol (UDP):
   - Connectionless, unreliable, best-effort transport protocol.
   - No handshake, no flow control, minimal 8-byte header.
   - Ideal for real-time applications like DNS, VoIP, Video Streaming, and Gaming where latency is critical.

3. Port Numbers:
   - Well-known ports (0-1023): HTTP (80), HTTPS (443), SSH (22), DNS (53).
   - Ephemeral ports dynamically assigned to client applications.`);
  };

  // Copy message text helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Switch to chat with company prep prompt
  const launchCompanyChat = (companyName: string) => {
    setActiveCompanyContext(selectedCompanyId);
    setActiveTab('chat');
    sendMessage(`Please give me a complete round-by-round preparation plan and mock interview questions for ${companyName}.`);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Drawer Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col border-l border-gray-100"
          >
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-emerald-900 via-brand-700 to-brand-600 text-white flex flex-col gap-3 flex-shrink-0 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-inner">
                    <Sparkles size={20} className="text-emerald-200 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-white">CampusAI Mentor</h3>
                      <span className="px-2 py-0.5 bg-emerald-400/20 text-emerald-200 text-[10px] font-semibold rounded-full border border-emerald-300/30">
                        BIT Sathy AI
                      </span>
                    </div>
                    <p className="text-xs text-brand-100/90">Academic Tutoring • Multi-PDF Summaries • Placement Intelligence</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-all"
                  aria-label="Close drawer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex bg-black/20 p-1 rounded-xl gap-1 border border-white/10">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'chat'
                      ? 'bg-white text-charcoal shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Sparkles size={14} className={activeTab === 'chat' ? 'text-brand-600' : ''} />
                  AI Chat
                </button>
                <button
                  onClick={() => setActiveTab('pdf')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'pdf'
                      ? 'bg-white text-charcoal shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <FileText size={14} className={activeTab === 'pdf' ? 'text-brand-600' : ''} />
                  Multi-PDF Summarizer
                </button>
                <button
                  onClick={() => setActiveTab('company')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'company'
                      ? 'bg-white text-charcoal shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Briefcase size={14} className={activeTab === 'company' ? 'text-brand-600' : ''} />
                  Placement Advisor
                </button>
              </div>
            </div>

            {/* Active Context Banner */}
            {(activeCompanyContext || activePdfContext) && activeTab === 'chat' && (
              <div className="bg-emerald-50 px-5 py-2 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-800">
                <div className="flex items-center gap-2">
                  <Zap size={13} className="text-emerald-600" />
                  <span>
                    Active Context:{' '}
                    <strong>
                      {activeCompanyContext ? `Company: ${activeCompanyContext.toUpperCase()}` : ''}
                      {activeCompanyContext && activePdfContext ? ' • ' : ''}
                      {activePdfContext ? `PDF: ${activePdfContext.title}` : ''}
                    </strong>
                  </span>
                </div>
                <button
                  onClick={() => {
                    setActiveCompanyContext(null);
                    setActivePdfContext(null);
                  }}
                  className="text-emerald-700 hover:underline text-[11px]"
                >
                  Clear Context
                </button>
              </div>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col bg-slate-50/50">
              {/* ════════════════ TAB 1: AI CHAT ════════════════ */}
              {activeTab === 'chat' && (
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                  {/* Messages list */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}
                      >
                        {msg.role === 'assistant' && (
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-500 text-white flex items-center justify-center flex-shrink-0 mr-2.5 mt-0.5 shadow-sm">
                            <Sparkles size={14} />
                          </div>
                        )}
                        <div
                          className={`relative max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-brand-600 text-white rounded-tr-sm shadow-md'
                              : 'bg-white text-gray-800 border border-gray-200/80 rounded-tl-sm shadow-sm'
                          }`}
                        >
                          {/* Message content */}
                          <div className="whitespace-pre-line prose prose-sm max-w-none text-inherit">
                            {msg.text}
                          </div>

                          {/* Company analysis card snippet if attached */}
                          {msg.companyAnalysis && (
                            <div className="mt-3 p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs text-gray-700 space-y-2">
                              <div className="flex items-center justify-between font-semibold text-emerald-900">
                                <span>🎯 {msg.companyAnalysis.company.name} Readiness</span>
                                <span className="px-2 py-0.5 bg-emerald-600 text-white rounded-full font-bold">
                                  {msg.companyAnalysis.estimatedReadiness}%
                                </span>
                              </div>
                              <p className="text-gray-600">{msg.companyAnalysis.company.overview}</p>
                              <div className="flex gap-2 pt-1">
                                <button
                                  onClick={() => {
                                    setSelectedCompanyId(msg.companyAnalysis!.company.id);
                                    setActiveTab('company');
                                  }}
                                  className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1"
                                >
                                  View Full Recruitment Rounds <ArrowRight size={12} />
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Footer & Copy */}
                          <div className="flex items-center justify-between mt-2 pt-1 border-t border-black/5 text-[10px] text-gray-400">
                            <span>{msg.timestamp}</span>
                            {msg.role === 'assistant' && (
                              <button
                                onClick={() => handleCopy(msg.text, msg.id)}
                                className="hover:text-brand-600 transition-colors flex items-center gap-1"
                                title="Copy response"
                              >
                                {copiedId === msg.id ? (
                                  <>
                                    <Check size={11} className="text-emerald-600" />
                                    <span className="text-emerald-600">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy size={11} />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Typing indicator */}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-500 text-white flex items-center justify-center flex-shrink-0 mr-2.5 mt-0.5 shadow-sm">
                          <Sparkles size={14} className="animate-spin" />
                        </div>
                        <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-gray-500 font-medium mr-1">CampusAI is analyzing...</span>
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                className="w-1.5 h-1.5 bg-brand-500 rounded-full"
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={chatBottomRef} />
                  </div>

                  {/* Quick Prompts Bar */}
                  <div className="px-4 py-2 bg-white border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-shrink-0">
                    <span className="text-[11px] text-gray-400 font-semibold whitespace-nowrap mr-1">Suggested:</span>
                    {quickPrompts.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => sendMessage(item.prompt)}
                        className="px-2.5 py-1 bg-gray-100/80 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 border border-transparent rounded-lg text-xs text-gray-700 whitespace-nowrap transition-all font-medium flex items-center gap-1"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <div className="p-3 bg-white border-t border-gray-200 flex-shrink-0">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        sendMessage();
                      }}
                      className="flex gap-2 items-center"
                    >
                      <input
                        type="text"
                        placeholder="Ask anything about placement rounds, exam topics, or study plans..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isTyping}
                        className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all shadow-inner"
                      />
                      <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="px-4 py-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold text-sm shadow-md flex items-center gap-1.5"
                        aria-label="Send message"
                      >
                        <Send size={15} />
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* ════════════════ TAB 2: MULTI-PDF SUMMARIZER ════════════════ */}
              {activeTab === 'pdf' && (
                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                  {/* Upload & Input Card */}
                  <div className="card p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                          <BookOpen size={16} />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-charcoal">Multi-PDF Study Summarizer</h4>
                          <p className="text-xs text-gray-500">Select multiple PDF notes/slides for combined AI analysis</p>
                        </div>
                      </div>
                      <button
                        onClick={loadSampleNotes}
                        className="text-xs text-brand-600 hover:text-brand-700 font-semibold underline"
                      >
                        Load Sample Notes
                      </button>
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex gap-2 mb-3 text-xs">
                      <button
                        onClick={() => setUseTextInput(false)}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                          !useTextInput ? 'bg-brand-50 text-brand-700 border border-brand-200 font-bold' : 'text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        Upload PDF Documents (Multiple)
                      </button>
                      <button
                        onClick={() => setUseTextInput(true)}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                          useTextInput ? 'bg-brand-50 text-brand-700 border border-brand-200 font-bold' : 'text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        Paste Lecture Notes Text
                      </button>
                    </div>

                    {!useTextInput ? (
                      <div className="space-y-3">
                        <div className="border-2 border-dashed border-gray-200 hover:border-brand-400 rounded-xl p-6 text-center transition-all bg-gray-50/50">
                          <input
                            type="file"
                            id="pdf-upload"
                            multiple
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-brand-600">
                              <Upload size={20} />
                            </div>
                            <p className="text-xs font-semibold text-gray-700">
                              Click to select multiple PDF files or drag & drop here
                            </p>
                            <p className="text-[11px] text-gray-400">Select multiple files (PDF, DOCX, TXT)</p>
                          </label>
                        </div>

                        {/* Selected Files List */}
                        {pdfFiles.length > 0 && (
                          <div className="space-y-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                            <div className="flex items-center justify-between text-xs font-semibold text-charcoal">
                              <span>Selected Files ({pdfFiles.length}):</span>
                              <button
                                onClick={() => setPdfFiles([])}
                                className="text-red-600 hover:underline text-[11px]"
                              >
                                Clear all
                              </button>
                            </div>
                            <div className="space-y-1.5 max-h-36 overflow-y-auto">
                              {pdfFiles.map((f, index) => (
                                <div
                                  key={`${f.name}-${index}`}
                                  className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-100 text-xs text-gray-700"
                                >
                                  <div className="flex items-center gap-2 truncate pr-2">
                                    <FileText size={14} className="text-brand-600 flex-shrink-0" />
                                    <span className="truncate font-medium">{f.name}</span>
                                    <span className="text-[10px] text-gray-400 flex-shrink-0">
                                      ({formatFileSize(f.size)})
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => removeFile(index)}
                                    className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                                    title="Remove file"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                            <label
                              htmlFor="pdf-upload"
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:text-brand-800 cursor-pointer pt-1"
                            >
                              <Plus size={12} /> Add more files
                            </label>
                          </div>
                        )}
                      </div>
                    ) : (
                      <textarea
                        value={rawText}
                        onChange={(e) => setRawText(e.target.value)}
                        placeholder="Paste syllabus modules, lecture slides text, or textbook sections here..."
                        rows={6}
                        className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    )}

                    {pdfError && (
                      <div className="mt-3 p-2.5 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex items-center gap-2">
                        <AlertTriangle size={14} />
                        <span>{pdfError}</span>
                      </div>
                    )}

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={handleSummarize}
                        disabled={isSummarizing || (pdfFiles.length === 0 && !rawText.trim())}
                        className="px-5 py-2.5 bg-gradient-to-r from-brand-600 to-emerald-600 text-white text-xs font-bold rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                      >
                        {isSummarizing ? (
                          <>
                            <RefreshCw size={14} className="animate-spin" />
                            <span>Analyzing {pdfFiles.length > 1 ? `${pdfFiles.length} Documents` : 'Document'}...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles size={14} />
                            <span>Generate AI Exam Summary</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Summarized Output View */}
                  {pdfSummaryResult && (
                    <div className="card p-5 bg-white border border-gray-200 shadow-sm rounded-2xl space-y-4">
                      {/* Document Meta Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full">
                              AI Summary Ready
                            </span>
                            <h4 className="font-bold text-sm text-charcoal">{pdfSummaryResult.title}</h4>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Word Count: ~{pdfSummaryResult.wordCount} words • Exam Readiness Guide
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setActivePdfContext(pdfSummaryResult);
                            setActiveTab('chat');
                            sendMessage(`I've uploaded "${pdfSummaryResult.title}". Can you give me 3 practice questions to test my understanding?`);
                          }}
                          className="px-3 py-1.5 bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 self-start"
                        >
                          <Sparkles size={12} />
                          Ask Questions in Chat
                        </button>
                      </div>

                      {/* Sub-tabs */}
                      <div className="flex gap-1 border-b border-gray-100 pb-2">
                        <button
                          onClick={() => setSummaryActiveSubTab('overview')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            summaryActiveSubTab === 'overview' ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          📌 Overview
                        </button>
                        <button
                          onClick={() => setSummaryActiveSubTab('concepts')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            summaryActiveSubTab === 'concepts' ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          🔑 Key Concepts ({pdfSummaryResult.keyConcepts.length})
                        </button>
                        <button
                          onClick={() => setSummaryActiveSubTab('questions')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            summaryActiveSubTab === 'questions' ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          ❓ Exam Q&A ({pdfSummaryResult.topExamQuestions.length})
                        </button>
                        <button
                          onClick={() => setSummaryActiveSubTab('flashcards')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            summaryActiveSubTab === 'flashcards' ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          💡 Flashcards
                        </button>
                      </div>

                      {/* Sub-tab Content: Overview */}
                      {summaryActiveSubTab === 'overview' && (
                        <div className="space-y-3 text-xs leading-relaxed">
                          <div className="p-3 bg-slate-50 rounded-xl border border-gray-100">
                            <p className="font-semibold text-charcoal mb-1">Executive Summary</p>
                            <p className="text-gray-700">{pdfSummaryResult.executiveSummary}</p>
                          </div>

                          <div>
                            <p className="font-semibold text-charcoal mb-2">🎯 Recommended Next Steps:</p>
                            <ul className="space-y-1.5">
                              {pdfSummaryResult.suggestedActionItems.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-gray-700">
                                  <CheckCircle size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Sub-tab Content: Key Concepts */}
                      {summaryActiveSubTab === 'concepts' && (
                        <div className="space-y-2.5">
                          {pdfSummaryResult.keyConcepts.map((concept, idx) => (
                            <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
                              <div className="flex items-center justify-between">
                                <p className="font-bold text-xs text-charcoal">{concept.title}</p>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  concept.importance === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {concept.importance} Yield
                                </span>
                              </div>
                              <p className="text-xs text-gray-600">{concept.explanation}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Sub-tab Content: Questions */}
                      {summaryActiveSubTab === 'questions' && (
                        <div className="space-y-3">
                          {pdfSummaryResult.topExamQuestions.map((q, idx) => (
                            <div key={idx} className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <p className="font-bold text-xs text-emerald-950">Q{idx + 1}: {q.question}</p>
                                <span className="px-2 py-0.5 bg-emerald-200/80 text-emerald-900 font-bold text-[10px] rounded whitespace-nowrap">
                                  {q.markWeightage}
                                </span>
                              </div>
                              <div className="p-2.5 bg-white rounded-lg border border-emerald-100 text-xs text-gray-700 whitespace-pre-line">
                                <p className="font-semibold text-[11px] text-gray-500 mb-1">Model Answer Outline:</p>
                                {q.answerSummary}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Sub-tab Content: Flashcards */}
                      {summaryActiveSubTab === 'flashcards' && (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-charcoal">High-Yield Revision Points:</p>
                          {pdfSummaryResult.quickRevisionPoints.map((point, idx) => (
                            <div key={idx} className="p-2.5 bg-brand-50/50 border border-brand-100 rounded-xl text-xs text-gray-800 flex items-start gap-2">
                              <Zap size={14} className="text-brand-600 flex-shrink-0 mt-0.5" />
                              <span>{point}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ════════════════ TAB 3: COMPANY PLACEMENT ADVISOR ════════════════ */}
              {activeTab === 'company' && (
                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                  {/* Company Select Carousel */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-2">Select Target Recruitment Company:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {companies.map((comp) => {
                        const isSelected = selectedCompanyId.toLowerCase() === comp.id.toLowerCase();
                        return (
                          <button
                            key={comp.id}
                            onClick={() => setSelectedCompanyId(comp.id)}
                            className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                              isSelected
                                ? 'border-brand-500 bg-brand-50/60 shadow-sm ring-2 ring-brand-500/20'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs mb-2"
                              style={{ backgroundColor: comp.color }}
                            >
                              {comp.logo}
                            </div>
                            <p className="font-bold text-xs text-charcoal truncate">{comp.name}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5 truncate">{comp.ctc}</p>
                            {isSelected && (
                              <div className="absolute top-2 right-2 text-brand-600">
                                <CheckCircle size={14} />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Company Detail & Analysis */}
                  {isLoadingCompany ? (
                    <div className="card p-12 text-center text-gray-400">
                      <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-brand-600" />
                      <p className="text-xs">Analyzing company recruitment standards & your profile...</p>
                    </div>
                  ) : companyAnalysis ? (
                    <div className="space-y-4">
                      {/* Eligibility & Readiness Hero Card */}
                      <div className="card p-5 bg-gradient-to-br from-white to-emerald-50/40 border border-emerald-100 shadow-sm rounded-2xl">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-sm"
                              style={{ backgroundColor: companyAnalysis.company.color }}
                            >
                              {companyAnalysis.company.logo}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-base text-charcoal">{companyAnalysis.company.name}</h3>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  companyAnalysis.isCgpaEligible ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {companyAnalysis.isCgpaEligible ? '✅ CGPA Eligible' : '⚠️ Below Cutoff'}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5">
                                CTC: <strong className="text-charcoal">{companyAnalysis.company.ctc}</strong> • Roles: {companyAnalysis.company.roles.join(', ')}
                              </p>
                            </div>
                          </div>

                          <div className="text-right flex sm:flex-col items-center sm:items-end justify-between">
                            <span className="text-xs text-gray-500">Readiness Score</span>
                            <span className="text-2xl font-black text-brand-600">
                              {companyAnalysis.estimatedReadiness}%
                            </span>
                          </div>
                        </div>

                        {/* Targeted Recommendations */}
                        <div className="mt-3 space-y-1.5">
                          <p className="text-xs font-semibold text-charcoal">CampusAI Placement Verdict:</p>
                          {companyAnalysis.recommendations.map((rec, i) => (
                            <div key={i} className="text-xs text-gray-700 flex items-start gap-2">
                              <span className="text-brand-600 font-bold">•</span>
                              <span>{rec}</span>
                            </div>
                          ))}
                        </div>

                        {/* CTA button */}
                        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                          <button
                            onClick={() => launchCompanyChat(companyAnalysis.company.name)}
                            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
                          >
                            <Sparkles size={14} />
                            Launch Custom {companyAnalysis.company.name} Prep in Chat
                          </button>
                        </div>
                      </div>

                      {/* Recruitment Stages & Procedures */}
                      <div className="card p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-sm text-charcoal flex items-center gap-2">
                            <Clock size={16} className="text-brand-600" />
                            Recruitment Stages & Selection Procedure
                          </h4>
                          <span className="text-[11px] text-gray-400">
                            {companyAnalysis.company.stages.length} Assessment Rounds
                          </span>
                        </div>

                        <div className="space-y-3">
                          {companyAnalysis.company.stages.map((stage) => {
                            const isExpanded = expandedRound === stage.roundNumber;
                            return (
                              <div
                                key={stage.roundNumber}
                                className={`border rounded-xl transition-all ${
                                  isExpanded ? 'border-brand-300 bg-brand-50/20' : 'border-gray-200 hover:border-gray-300 bg-white'
                                }`}
                              >
                                <button
                                  onClick={() => setExpandedRound(isExpanded ? null : stage.roundNumber)}
                                  className="w-full px-4 py-3 text-left flex items-center justify-between text-xs font-semibold"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-[11px]">
                                      {stage.roundNumber}
                                    </span>
                                    <span className="text-charcoal">{stage.name}</span>
                                    <span className="text-gray-400 font-normal">({stage.duration})</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {stage.elimination && (
                                      <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-bold">
                                        Elimination
                                      </span>
                                    )}
                                    <ChevronRight size={14} className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                  </div>
                                </button>

                                {isExpanded && (
                                  <div className="px-4 pb-4 pt-1 text-xs text-gray-700 space-y-2 border-t border-brand-100/60">
                                    <p className="text-gray-600">{stage.description}</p>
                                    <div>
                                      <strong className="text-charcoal">Key Focus Topics:</strong> {stage.keyTopics.join(', ')}
                                    </div>
                                    <div className="p-2.5 bg-amber-50/60 rounded-lg border border-amber-200/60 text-amber-900">
                                      <strong>💡 Pro-Tip for this Round:</strong> {stage.tips[0]}
                                    </div>
                                    <div>
                                      <strong className="text-charcoal">Sample Questions:</strong>
                                      <ul className="mt-1 space-y-1 list-disc list-inside text-gray-600">
                                        {stage.sampleQuestions.map((q, idx) => (
                                          <li key={idx}>{q}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Previous Year Asked Questions */}
                      <div className="card p-5 bg-white border border-gray-200 shadow-sm rounded-2xl space-y-3">
                        <h4 className="font-bold text-sm text-charcoal flex items-center gap-2">
                          <Award size={16} className="text-brand-600" />
                          Previous Year Coding & Interview Questions
                        </h4>

                        <div className="space-y-2">
                          {companyAnalysis.company.previousYearQuestions.coding.map((q, idx) => (
                            <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-charcoal">{q.title}</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  q.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-800' :
                                  q.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {q.difficulty} • {q.topic}
                                </span>
                              </div>
                              <p className="text-gray-600">{q.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
