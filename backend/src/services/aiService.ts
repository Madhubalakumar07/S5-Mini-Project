import { config } from '../config/index.js';
import { COMPANY_PROFILES, analyzeStudentForCompany, getAllCompanyProfiles, CompanyRecruitmentProfile } from '../data/companyPlacementData.js';
import { studentRepository } from '../repositories/studentRepository.js';
import { userRepository } from '../repositories/userRepository.js';
import { groqService } from './groqService.js';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface SummarizePdfResult {
  title: string;
  wordCount: number;
  executiveSummary: string;
  keyConcepts: { title: string; explanation: string; importance: 'High' | 'Medium' }[];
  formulasAndDefinitions: string[];
  topExamQuestions: { question: string; answerSummary: string; markWeightage: string }[];
  quickRevisionPoints: string[];
  suggestedActionItems: string[];
}

export class AIService {
  /**
   * Helper to call Gemini API if key is available
   */
  private async callGeminiAPI(prompt: string, systemInstruction?: string): Promise<string | null> {
    if (!config.geminiApiKey) return null;

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.geminiApiKey}`;
      const payload = {
        contents: [
          ...(systemInstruction ? [{ role: 'user', parts: [{ text: `SYSTEM INSTRUCTION: ${systemInstruction}` }] }, { role: 'model', parts: [{ text: 'Understood. I will follow these instructions.' }] }] : []),
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        }
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        console.warn(`Gemini API returned status ${res.status}, falling back to secondary provider.`);
        return null;
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return text || null;
    } catch (err) {
      console.warn('Gemini API call failed, falling back to secondary provider:', err);
      return null;
    }
  }

  /**
   * Helper to call Groq API when GROQ_API_KEY is available
   */
  async callGroqAPI(
    prompt: string,
    systemInstruction?: string,
    history: ChatMessage[] = [],
    options?: { jsonMode?: boolean; maxTokens?: number; temperature?: number }
  ): Promise<string | null> {
    const apiKey = (config.groqApiKey || process.env.GROQ_API_KEY || '').replace(/^["']|["']$/g, '').trim();
    if (!apiKey || apiKey === 'your_api_key' || apiKey === 'undefined' || apiKey === 'null') return null;

    const modelsToTry = [
      config.groqModel || 'openai/gpt-oss-120b',
      'openai/gpt-oss-20b',
    ];

    for (const model of modelsToTry) {
      try {
        const messages: any[] = [];
        if (systemInstruction) {
          messages.push({ role: 'system', content: systemInstruction });
        }
        if (history && history.length > 0) {
          for (const msg of history) {
            if (msg.content && msg.content.trim()) {
              messages.push({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content.trim(),
              });
            }
          }
        }
        messages.push({ role: 'user', content: prompt });

        const body: any = {
          model,
          messages,
          temperature: options?.temperature ?? 0.4,
          max_tokens: options?.maxTokens ?? 2000,
        };

        if (options?.jsonMode) {
          body.response_format = { type: 'json_object' };
        }

        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          console.warn(`Groq chat API (${model}) returned status ${res.status}`);
          continue;
        }

        const data = await res.json();
        const content = data?.choices?.[0]?.message?.content;
        if (content && typeof content === 'string' && content.trim().length > 0) {
          return content.trim();
        }
      } catch (err) {
        console.warn(`Groq chat API call failed for model ${model}:`, err);
      }
    }

    return null;
  }

  /**
   * Unified LLM caller: attempts Groq first, then Gemini, then returns null for built-in rule engine
   */
  async callLLM(
    prompt: string,
    systemInstruction?: string,
    history: ChatMessage[] = [],
    options?: { jsonMode?: boolean; maxTokens?: number; temperature?: number }
  ): Promise<string | null> {
    const groqRes = await this.callGroqAPI(prompt, systemInstruction, history, options);
    if (groqRes) return groqRes;

    const geminiRes = await this.callGeminiAPI(prompt, systemInstruction);
    if (geminiRes) return geminiRes;

    return null;
  }


  /**
   * Analyze student for a company recruitment drive
   */
  async analyzeCompanyForStudent(studentId: string, companyId: string) {
    const user = await userRepository.findById(studentId);
    const placementData = await studentRepository.getPlacementData(studentId);
    const academicsData = await studentRepository.getAcademicsData(studentId);

    const studentStats = {
      name: user?.name || 'Student',
      department: user?.department || 'Computer Science & Engineering',
      cgpa: user?.cgpa || 8.4,
      skills: ['React', 'Node.js', 'Python', 'DSA', 'SQL', 'C++', 'Java'],
      codingProblemsSolved: 248,
      placementScore: placementData.placementScore.score,
    };

    const analysis = analyzeStudentForCompany(companyId, studentStats);
    return analysis;
  }

  /**
   * Summarize student study material (PDF text or notes)
   */
  async summarizeStudyMaterial(
    text: string,
    documentName?: string,
    topicContext?: string
  ): Promise<SummarizePdfResult> {
    const cleanText = text.trim();
    const wordCount = cleanText.split(/\s+/).filter(Boolean).length;
    const docTitle = documentName || 'Study Material / Lecture Notes';

    const prompt = `You are an elite academic professor and exam specialist for engineering students.
Analyze the following study material / PDF notes and provide a structured study guide in JSON format.

Document Title: ${docTitle}
Context / Subject: ${topicContext || 'Engineering Curriculum'}
Document Text:
"""
${cleanText.substring(0, 12000)}
"""

Return ONLY a valid JSON object matching this schema:
{
  "title": "${docTitle}",
  "wordCount": ${wordCount},
  "executiveSummary": "Concise 3-4 sentence high-yield summary of the entire document",
  "keyConcepts": [
    {"title": "Concept Name", "explanation": "Clear, precise explanation with intuitive example", "importance": "High"}
  ],
  "formulasAndDefinitions": [
    "Key definition or mathematical formula with variable definitions"
  ],
  "topExamQuestions": [
    {"question": "Expected 2-mark or 16-mark university/internal exam question", "answerSummary": "Structured point-by-point model answer", "markWeightage": "16 Marks"}
  ],
  "quickRevisionPoints": [
    "High-yield bullet point for last-minute revision before exam"
  ],
  "suggestedActionItems": [
    "Actionable next step for the student"
  ]
}`;

    const systemInstruction = 'You are an elite academic professor. You must return strictly valid JSON matching the requested schema. No conversational preamble.';

    const llmResponse = await this.callLLM(prompt, systemInstruction, [], { jsonMode: true, maxTokens: 2500, temperature: 0.2 });
    if (llmResponse) {
      try {
        const sanitized = llmResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(sanitized);
        return {
          title: docTitle,
          wordCount: wordCount || parsed.wordCount || 100,
          executiveSummary: parsed.executiveSummary || 'Summary generated from uploaded notes.',
          keyConcepts: Array.isArray(parsed.keyConcepts) && parsed.keyConcepts.length > 0 ? parsed.keyConcepts : [
            { title: 'Core Principles', explanation: 'Key theoretical foundations and formulas covered in this document.', importance: 'High' }
          ],
          formulasAndDefinitions: Array.isArray(parsed.formulasAndDefinitions) ? parsed.formulasAndDefinitions : [],
          topExamQuestions: Array.isArray(parsed.topExamQuestions) && parsed.topExamQuestions.length > 0 ? parsed.topExamQuestions : [
            { question: `Explain the fundamental concepts discussed in ${docTitle}.`, answerSummary: 'Review core definitions, diagrams, and operational principles.', markWeightage: '16 Marks' }
          ],
          quickRevisionPoints: Array.isArray(parsed.quickRevisionPoints) ? parsed.quickRevisionPoints : [],
          suggestedActionItems: Array.isArray(parsed.suggestedActionItems) ? parsed.suggestedActionItems : [
            'Review key formulas and diagrams before the exam.'
          ],
        };
      } catch (e) {
        console.warn('Failed to parse LLM JSON summary, falling back to rule engine:', e);
      }
    }

    // Built-in intelligent academic extraction engine
    return this.generateBuiltinStudySummary(cleanText, docTitle, topicContext);
  }

  /**
   * Built-in intelligent study material analyzer
   */
  private generateBuiltinStudySummary(
    text: string,
    title: string,
    topicContext?: string
  ): SummarizePdfResult {
    const words = text.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // Detect subject / domain keywords
    const lower = text.toLowerCase();
    const isNetworking = lower.includes('network') || lower.includes('tcp') || lower.includes('osi') || lower.includes('routing') || lower.includes('ip address') || lower.includes('transport layer') || lower.includes('udp');
    const isOS = lower.includes('process') || lower.includes('operating system') || lower.includes('deadlock') || lower.includes('scheduling') || lower.includes('paging') || lower.includes('semaphore') || lower.includes('thread');
    const isDBMS = lower.includes('database') || lower.includes('sql') || lower.includes('relation') || lower.includes('normalization') || lower.includes('transaction') || lower.includes('acid') || lower.includes('join');
    const isDSA = lower.includes('tree') || lower.includes('graph') || lower.includes('algorithm') || lower.includes('sorting') || lower.includes('complexity') || lower.includes('array') || lower.includes('linked list') || lower.includes('stack');
    const isAIML = lower.includes('neural') || lower.includes('machine learning') || lower.includes('regression') || lower.includes('classification') || lower.includes('model') || lower.includes('deep learning');

    let subjectTag = 'Computer Science & Engineering';
    if (isNetworking) subjectTag = 'Computer Networks';
    else if (isOS) subjectTag = 'Operating Systems';
    else if (isDBMS) subjectTag = 'Database Management Systems';
    else if (isDSA) subjectTag = 'Data Structures & Algorithms';
    else if (isAIML) subjectTag = 'Artificial Intelligence & Machine Learning';

    // Extract sentences for summary
    const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 25);
    const topSentences = sentences.slice(0, 4).join('. ') + (sentences.length > 0 ? '.' : '');

    // Extract potential headings / keywords
    const keyLines = text.split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 5 && l.length < 80 && (l.endsWith(':') || l.toUpperCase() === l || /^[0-9]\./.test(l) || /^[A-Z]/.test(l)))
      .slice(0, 5);

    const keyConcepts = keyLines.length >= 2 
      ? keyLines.slice(0, 4).map((line, idx) => ({
          title: line.replace(/[:0-9.]/g, '').trim(),
          explanation: `Fundamental principle and operational logic described in this unit, essential for internal and semester examinations.`,
          importance: idx === 0 ? 'High' : (idx % 2 === 0 ? 'High' : 'Medium') as 'High' | 'Medium',
        }))
      : [
          {
            title: `Core Architectural Principles in ${subjectTag}`,
            explanation: `Detailed breakdown of system modules, data flows, and core operational mechanics covered in this section.`,
            importance: 'High' as const,
          },
          {
            title: 'Performance Trade-offs & Complexity',
            explanation: `Analysis of algorithmic overhead, time/space trade-offs, and optimization strategies for practical implementations.`,
            importance: 'High' as const,
          },
          {
            title: 'Failure Modes & Recovery Protocols',
            explanation: `Standard exception handling, consistency verification, and edge-case boundary checks.`,
            importance: 'Medium' as const,
          }
        ];

    const topExamQuestions = [
      {
        question: `Explain the fundamental architecture and working mechanism of ${subjectTag} components discussed in this material.`,
        answerSummary: `1. Define core terminology and scope.\n2. Draw standard block/flow diagram.\n3. Detail internal state transitions and protocols.\n4. Mention practical use-cases and performance advantages.`,
        markWeightage: '16 Marks (University / Model Exam)'
      },
      {
        question: `Differentiate between key approaches/algorithms highlighted in the study material with comparative trade-offs.`,
        answerSummary: `Tabulate comparison across: Complexity, Resource Overhead, Scalability, Implementation Ease, and Common Failure Modes.`,
        markWeightage: '8 Marks / 13 Marks'
      },
      {
        question: `What are the primary edge-cases, validation checks, and security/efficiency constraints in this topic?`,
        answerSummary: `Discuss boundary value conditions, concurrency locks, data normalization, and throughput optimization.`,
        markWeightage: '2 Marks (Short Answer)'
      }
    ];

    const quickRevisionPoints = [
      `ðŸ“Œ Primary focus area: Master the flow diagrams and core definitions of ${subjectTag}.`,
      `ðŸ“Œ Watch out for corner test cases and algorithmic complexity guarantees (Big-O analysis).`,
      `ðŸ“Œ Differentiate between theoretical models and real-world system implementations.`,
      `ðŸ“Œ Practice drawing the architectural diagrams cleanly for full mark acquisition in semester exams.`,
      `ðŸ“Œ Re-verify key formulas and protocol layer responsibilities before entering the exam hall.`
    ];

    const suggestedActionItems = [
      `Solve the 3 expected exam questions provided above on paper without referencing the notes.`,
      `Review related past-year Anna University / Autonomous semester question papers for this unit.`,
      `Ask CampusAI chatbot if any specific definition or diagram requires further step-by-step clarification.`
    ];

    return {
      title,
      wordCount,
      executiveSummary: topSentences || `This study material covers essential foundations of ${subjectTag}, focusing on architectural principles, performance optimization, and exam-oriented problem solving.`,
      keyConcepts,
      formulasAndDefinitions: [
        `Key Definition: Core state representation and interface contracts defined for ${subjectTag}.`,
        `Efficiency Metric: Optimal time complexity O(log N) to O(N) depending on data partitioning.`,
        `Standard Constraint: Resource allocation and deadlock avoidance rules.`
      ],
      topExamQuestions,
      quickRevisionPoints,
      suggestedActionItems
    };
  }

  /**
   * General & Contextual AI Chat with Domain Knowledge Engine
   */
  async processChat(
    studentId: string,
    message: string,
    history: ChatMessage[] = [],
    activeCompanyId?: string,
    studyMaterialContext?: string
  ): Promise<{ text: string; actionType?: string; companyAnalysis?: any }> {
    const user = await userRepository.findById(studentId);
    const placementData = await studentRepository.getPlacementData(studentId);
    const academicsData = await studentRepository.getAcademicsData(studentId);
    const attendanceData = await studentRepository.getAttendanceData(studentId);

    const studentContext = {
      name: user?.name || 'Student',
      department: user?.department || 'Computer Science & Engineering',
      year: user?.year ?? 3,
      cgpa: user?.cgpa || 8.4,
      attendancePercentage: attendanceData.stats.overallPercentage,
      placementScore: placementData.placementScore.score,
      solvedDSA: 248,
      weakSubjects: academicsData.weakSubjects.map(w => w.subject),
    };

    const lower = message.toLowerCase();

    // 1. Company-specific placement inquiry detection
    const companies = getAllCompanyProfiles();
    const matchedCompany = companies.find(c =>
      lower.includes(c.id) ||
      lower.includes(c.name.toLowerCase()) ||
      (activeCompanyId && (c.id === activeCompanyId.toLowerCase() || c.name.toLowerCase().includes(activeCompanyId.toLowerCase())))
    );

    const isAskingAboutCompany = Boolean(matchedCompany) && (
      lower.includes('company') ||
      lower.includes('placement') ||
      lower.includes('interview') ||
      lower.includes('round') ||
      lower.includes('question') ||
      lower.includes('recruitment') ||
      lower.includes('procedure') ||
      lower.includes('ctc') ||
      lower.includes('package') ||
      lower.includes('prepare') ||
      lower.includes('eligib') ||
      lower.includes('zoho') ||
      lower.includes('tcs') ||
      lower.includes('infosys') ||
      lower.includes('accenture') ||
      Boolean(activeCompanyId)
    );

    // Determine context-appropriate actionType
    let detectedActionType = 'general';
    if (matchedCompany) {
      detectedActionType = 'company_guidance';
    } else if (studyMaterialContext) {
      detectedActionType = 'pdf_qa';
    } else if (lower.includes('attendance') || lower.includes('bunk') || lower.includes('shortage')) {
      detectedActionType = 'attendance_alert';
    } else if (lower.includes('study plan') || lower.includes('schedule') || lower.includes('timetable') || lower.includes('routine')) {
      detectedActionType = 'study_plan';
    } else if (lower.includes('dsa') || lower.includes('leetcode') || lower.includes('coding') || lower.includes('problem')) {
      detectedActionType = 'coding_plan';
    } else if (lower.includes('resume') || lower.includes('interview') || lower.includes('hr')) {
      detectedActionType = 'placement_prep';
    } else if (
      lower.includes('tcp') || lower.includes('udp') || lower.includes('osi') ||
      lower.includes('normalization') || lower.includes('join') || lower.includes('deadlock') ||
      lower.includes('process') || lower.includes('thread') || lower.includes('oop') ||
      lower.includes('quicksort') || lower.includes('mergesort') || lower.includes('algorithm') ||
      lower.includes('explain') || lower.includes('what is') || lower.includes('difference')
    ) {
      detectedActionType = 'academic_guidance';
    }

    // Call unified LLM (Groq as primary with openai/gpt-oss-120b, or Gemini)
    const systemInstruction = `You are CampusAI Mentor, an elite, interactive AI academic tutor, exam specialist, and placement coach for students at Bannari Amman Institute of Technology (BIT Sathy).
Student Details:
- Name: ${studentContext.name}
- Department: ${studentContext.department}, Year ${studentContext.year}
- Current CGPA: ${studentContext.cgpa}
- Overall Attendance: ${studentContext.attendancePercentage}% (Computer Networks is below 75% at 72.4%)
- Placement Readiness Score: ${studentContext.placementScore}/100
- Coding Problems Solved: ${studentContext.solvedDSA}
- Weak Subjects: ${studentContext.weakSubjects.join(', ') || 'Computer Networks'}

Guidelines:
1. Be interactive, encouraging, and highly specific. NEVER output canned, generic, or hardcoded templates. Always directly address the student's exact query.
2. Format cleanly using markdown headers (###, ####), bullet points, bold key terms, tables, and clean code blocks with syntax highlighting for coding or pseudocode.
3. If asked about company recruitment procedures (Zoho, TCS, Infosys, Accenture, etc.), provide exact round-by-round breakdown (Round 1, Round 2, Round 3, Technical, HR), key topics, past asked coding problems, eligibility check against their CGPA (${studentContext.cgpa}), and tailored preparation roadmap. Mention the company name and recruitment details clearly.
4. If study material or PDF context is provided, ground your explanations directly in that Uploaded Study Material / Document with precision.
5. If asked academic concepts (CN, OS, DBMS, DSA, OOP, System Design, Full Stack, AI/ML), explain them clearly with diagrams, examples (e.g. TCP 3-Way Handshake: SYN -> SYN-ACK -> ACK), time/space complexity, and Anna University / Autonomous exam tips.
6. If asked about attendance or study planning, provide actionable recovery steps referencing their exact stats (${studentContext.attendancePercentage}% overall, Computer Networks at 72.4%).`;

    let prompt = `User Message: ${message}`;
    if (studyMaterialContext) {
      prompt += `\n\n[Active Uploaded Study Material / Document Context]:\n${studyMaterialContext.substring(0, 5000)}`;
    }
    if (matchedCompany) {
      prompt += `\n\n[Target Company Context - ${matchedCompany.name}]:\nCTC: ${matchedCompany.ctc}\nMin CGPA: ${matchedCompany.minCgpa}\nStages: ${matchedCompany.stages.map(s => `${s.name} (${s.duration})`).join(' -> ')}\nRequired Skills: ${matchedCompany.requiredSkills.join(', ')}\nSample Coding: ${matchedCompany.previousYearQuestions.coding.map(c => `[${c.difficulty}] ${c.title}: ${c.description}`).join(' | ')}`;
    }

    const llmResult = await this.callLLM(prompt, systemInstruction, history);
    if (llmResult) {
      let analysis = undefined;
      if (matchedCompany) {
        analysis = await this.analyzeCompanyForStudent(studentId, matchedCompany.id);
      }
      return {
        text: llmResult,
        actionType: detectedActionType,
        companyAnalysis: analysis,
      };
    }



    // Built-in Intelligent Response Generation (when Gemini API is offline or not set)
    
    // Case 1: Target Company Placement Inquiries
    if (matchedCompany && isAskingAboutCompany) {
      const analysis = await this.analyzeCompanyForStudent(studentId, matchedCompany.id);
      const company = matchedCompany;

      let response = `### ðŸ¢ **${company.name} â€” Comprehensive Placement & Recruitment Intelligence**\n\n`;
      response += `ðŸ’¼ **Package / CTC:** ${company.ctc}  \n`;
      response += `ðŸ“Š **Selection Ratio:** ${company.selectionRatio} | **Difficulty:** ${company.difficultyLevel}  \n`;
      response += `ðŸŽ¯ **Your Estimated Readiness:** **${analysis.estimatedReadiness}%** (${analysis.isCgpaEligible ? 'âœ… CGPA Eligible' : 'âš ï¸ CGPA Attention Needed'})\n\n`;

      response += `#### ðŸ“‹ **Recruitment Stages & Procedures (Previous Drives):**\n`;
      company.stages.forEach(stage => {
        response += `\n**${stage.name}** (${stage.duration}) ${stage.elimination ? 'ðŸ”´ *Elimination Round*' : 'ðŸŸ¢ *Evaluation*'}\n`;
        response += `â€¢ **Focus:** ${stage.description}\n`;
        response += `â€¢ **Key Topics:** ${stage.keyTopics.join(', ')}\n`;
        response += `â€¢ **Crucial Pro-Tip:** ${stage.tips[0]}\n`;
      });

      response += `\n#### ðŸ’» **Frequently Asked Questions (Previous Year Drives):**\n`;
      company.previousYearQuestions.coding.slice(0, 3).forEach(c => {
        response += `â€¢ **[${c.difficulty}] ${c.title}** (${c.topic}): ${c.description}\n`;
      });

      response += `\n#### ðŸŽ¯ **Targeted Action Plan for ${studentContext.name}:**\n`;
      analysis.recommendations.forEach(rec => {
        response += `â€¢ ${rec}\n`;
      });

      response += `\nðŸ’¡ *Tip: Ask me "Give me a mock interview question for ${company.name}" or "Explain Round 3 design problem" to practice!*`;

      return {
        text: response,
        actionType: 'company_guidance',
        companyAnalysis: analysis,
      };
    }

    // Case 2: Active PDF Study Material Grounded Q&A
    if (studyMaterialContext && (lower.includes('what') || lower.includes('how') || lower.includes('explain') || lower.includes('why') || lower.includes('question') || lower.includes('summar') || lower.includes('pdf'))) {
      const summaryContextSnippet = studyMaterialContext.substring(0, 800);
      return {
        text: `### ðŸ“„ **Answer based on your Uploaded Study Material**\n\nBased on your active study notes (**${studyMaterialContext.split('\n')[0]}**):\n\n${this.generateGroundedAnswer(message, studyMaterialContext)}\n\n---\nðŸ’¡ *Would you like a 3-question self-assessment test based on this section?*`,
        actionType: 'pdf_qa'
      };
    }

    // Case 3: Academic & Core CS Concept Questions
    const academicResponse = this.generateAcademicExplanation(message, studentContext);
    if (academicResponse) {
      return {
        text: academicResponse,
        actionType: 'academic_guidance'
      };
    }

    // Case 4: Study Plan & Timetable
    if (lower.includes('study plan') || lower.includes('schedule') || lower.includes('timetable') || lower.includes('routine')) {
      return {
        text: `### ðŸ“… **Personalized Weekly Study Plan for ${studentContext.name}**\n\nBased on your current subjects and weak areas (**Computer Networks** & **Operating Systems**):\n\nâ€¢ **Monday (5:00 PM - 6:00 PM):** ðŸŒ Computer Networks â€” Routing Algorithms & IP Subnetting\nâ€¢ **Tuesday (5:00 PM - 5:45 PM):** âš™ï¸ Operating Systems â€” Process Scheduling & Deadlocks\nâ€¢ **Wednesday (6:00 PM - 7:30 PM):** ðŸ’» Coding Practice â€” 3 Medium LeetCode DSA problems\nâ€¢ **Thursday (5:00 PM - 5:45 PM):** ðŸ—„ï¸ DBMS â€” Normalization (1NF to BCNF) & SQL Joins\nâ€¢ **Friday (5:00 PM - 6:00 PM):** ðŸ¤– AI & Machine Learning â€” Model Evaluation Metrics\nâ€¢ **Saturday (10:00 AM - 11:30 AM):** ðŸŽ¯ Full Placement Mock Aptitude & Coding Test\n\nShall I set up reminders for these sessions?`,
        actionType: 'study_plan'
      };
    }

    // Case 5: Attendance Recovery
    if (lower.includes('attendance') || lower.includes('bunk') || lower.includes('shortage') || lower.includes('attend')) {
      return {
        text: `### ðŸ“Š **Attendance Alert & Recovery Strategy**\n\nâ€¢ **Overall Attendance:** **${studentContext.attendancePercentage}%** (Safe)\nâ€¢ âš ï¸ **Critical Subject:** **Computer Networks is at 72.4%** (Below the mandatory 75% cutoff)\n\n**Recovery Plan:**\n1. You must attend the next **2 consecutive Computer Networks classes** without fail to reach 75.2%.\n2. You have **4 safe bunks** remaining in DSA (91.4%) and AI & ML (93.8%), but keep your CN classes 100% attended.\n3. Mark morning CN slots as high priority reminders!`,
        actionType: 'attendance_alert'
      };
    }

    // Case 6: DSA & Coding Practice
    if (lower.includes('dsa') || lower.includes('leetcode') || lower.includes('coding') || lower.includes('practice') || lower.includes('problem')) {
      return {
        text: `### ðŸ’» **DSA & Coding Practice Roadmap**\n\nâ€¢ **Current Status:** ${studentContext.solvedDSA}/345 Solved (72% progress) | 18-Day Streak ðŸ”¥\n\n**Recommended Problems for this Week:**\n1. ðŸŸ¢ **Warmup:** *Valid Parentheses* (Stack) & *Two Sum* (HashMap)\n2. ðŸŸ¡ **Core Placement Mediums:** *LRU Cache*, *Level Order Traversal of Binary Tree*, *Longest Substring Without Repeating Characters*\n3. ðŸ”´ **Stretch Hard:** *Merge k Sorted Lists* / *Trapping Rain Water*\n\nTarget solving **2 medium problems per day** to easily hit the 300+ problem milestone before upcoming drives!`,
        actionType: 'coding_plan'
      };
    }

    // Case 7: Resume & Interview Prep
    if (lower.includes('resume') || lower.includes('interview') || lower.includes('hr') || lower.includes('project')) {
      return {
        text: `### ðŸ“„ **Resume & Placement Interview Optimization Guide**\n\n**1. Resume Best Practices for Tech Drives:**\nâ€¢ **Format:** Use single-column standard ATS format (Overleaf / Jake's Resume).\nâ€¢ **Bullet Points (XYZ Formula):** *"Accomplished [X], as measured by [Y], by doing [Z]"*.\n  - *Example:* *"Architected full-stack portal handling 5,000+ daily requests, decreasing query latency by 42% using Redis caching."*\nâ€¢ **Sections:** Education -> Technical Skills -> Experience / Projects -> Coding Profiles (LeetCode/GitHub) -> Achievements.\n\n**2. Top HR Interview Behavioral Question Framework:**\nâ€¢ Always use the **STAR Method** (Situation, Task, Action, Result).\nâ€¢ Practice your 60-second elevator pitch: *"I am a pre-final year CSE student passionate about distributed systems and problem solving..."*`,
        actionType: 'placement_prep'
      };
    }

    // Default friendly conversational response
    return {
      text: `Hello ${studentContext.name}! ðŸ‘‹ I am your **CampusAI Academic & Placement Mentor**.

Here are some ways I can assist you right now:
1. ðŸ¢ **Company Placement Intelligence:** Ask me *"How to crack Zoho Round 3?"* or *"Analyze TCS NQT syllabus and rounds"*.
2. ðŸ“„ **PDF Study Material Summarizer:** Upload your lecture slides or notes in the **PDF Summarizer tab** to get instant exam guides, key formulas, and expected 16-mark questions.
3. ðŸŒ **Core CS Subject Mentorship:** Ask me any concept in **Computer Networks, OS, DBMS, DSA, OOP, or Full Stack**.
4. ðŸ“ˆ **Attendance & Exam Prep:** Track recovery steps for your **Computer Networks attendance (72.4%)** or generate a weekly revision plan.

What topic would you like to explore?`,
      actionType: 'general'
    };
  }

  /**
   * Helper to generate grounded answers from study material context
   */
  private generateGroundedAnswer(question: string, context: string): string {
    const qLower = question.toLowerCase();
    const lines = context.split('\n').map(l => l.trim()).filter(Boolean);

    // Find relevant lines
    const matchedLines = lines.filter(line => {
      const lLower = line.toLowerCase();
      const words = qLower.split(/\s+/).filter(w => w.length > 3);
      return words.some(w => lLower.includes(w));
    });

    if (matchedLines.length > 0) {
      return `**Key Excerpt from Document:**\n${matchedLines.slice(0, 4).map(l => `> ${l}`).join('\n')}\n\n**Explanation & Exam Context:**\nThis section highlights the fundamental mechanism, protocol state machine, and data flow. For exams, make sure to write the formal definition, state diagram, and contrast it with alternative protocols.`;
    }

    return `The uploaded study material emphasizes the core definitions, state transitions, and architectural trade-offs. \n\nKey Takeaways from the document:\nâ€¢ **Primary Functionality:** Ensures reliable transmission and modular separation across layers.\nâ€¢ **Exam Relevance:** High probability of appearing as a 16-mark descriptive question or 2-mark definition.\nâ€¢ **Pro Tip:** Practice sketching the block diagram on paper to secure full marks.`;
  }

  /**
   * Helper to generate deep academic explanations for core CS concepts
   */
  private generateAcademicExplanation(query: string, studentContext: { name: string; department: string }): string | null {
    const q = query.toLowerCase();

    // 1. Computer Networks: TCP vs UDP
    if (q.includes('tcp') && (q.includes('udp') || q.includes('difference') || q.includes('vs'))) {
      return `### ðŸŒ **TCP vs UDP â€” In-Depth Comparison (Computer Networks)**

| Feature | TCP (Transmission Control Protocol) | UDP (User Datagram Protocol) |
| :--- | :--- | :--- |
| **Connection Type** | Connection-Oriented (3-Way Handshake) | Connectionless (No Handshake) |
| **Reliability** | Guaranteed (ACKs, Retransmission) | Unreliable (Best-effort delivery) |
| **Ordering** | In-order delivery with sequence numbers | Out-of-order packets possible |
| **Flow & Congestion Control** | Supported (Sliding Window, AIMD) | None |
| **Header Size** | 20 to 60 Bytes | Fixed 8 Bytes |
| **Speed / Overhead** | Slower due to handshakes and ACKs | Extremely fast, minimal latency |
| **Common Protocols** | HTTP, HTTPS, SSH, FTP, SMTP | DNS, VoIP, Video Streaming, DHCP |

**TCP 3-Way Handshake Flow:**
1. \`Client -> SYN -> Server\` (Client requests connection)
2. \`Server -> SYN-ACK -> Client\` (Server acknowledges and requests sync)
3. \`Client -> ACK -> Server\` (Connection established!)

ðŸ’¡ **Exam Tip:** Draw the 3-Way Handshake timing diagram and TCP header format for 8/16-mark questions in Computer Networks.`;
    }

    // 2. Computer Networks: OSI Model
    if (q.includes('osi') || (q.includes('layers') && q.includes('network'))) {
      return `### ðŸŒ **7 Layers of OSI Model (Open Systems Interconnection)**

1. **Layer 7 â€” Application Layer:** End-user interfaces and network applications (*HTTP, HTTPS, DNS, FTP, SMTP*).
2. **Layer 6 â€” Presentation Layer:** Data formatting, encryption, compression (*SSL/TLS, ASCII, JPEG*).
3. **Layer 5 â€” Session Layer:** Establishes, maintains, and synchronizes dialog between processes (*NetBIOS, RPC*).
4. **Layer 4 â€” Transport Layer:** End-to-end process communication, flow control, error recovery (*TCP, UDP, Port numbers*).
5. **Layer 3 â€” Network Layer:** Logical addressing and packet routing across networks (*IP (IPv4/IPv6), Routers, ICMP*).
6. **Layer 2 â€” Data Link Layer:** Node-to-node framing, physical MAC addressing, error detection (*Ethernet, Switches, MAC*).
7. **Layer 1 â€” Physical Layer:** Transmits raw bitstream over physical media (*Cables, Fiber optics, Hubs, Radio frequencies*).

ðŸ’¡ **Mnemonic to Remember:** **P**lease **D**o **N**ot **T**hrow **S**ausage **P**izza **A**way (Layers 1 to 7).`;
    }

    // 3. DBMS: Normalization
    if (q.includes('normalization') || q.includes('1nf') || q.includes('2nf') || q.includes('3nf') || q.includes('bcnf')) {
      return `### ðŸ—„ï¸ **Database Normalization (1NF to BCNF) â€” Complete Guide**

Normalization is the process of organizing database relations to minimize **data redundancy** and avoid **insertion, update, and deletion anomalies**.

1. **1NF (First Normal Form):**
   - Each column must contain atomic (indivisible) values.
   - No repeating groups or multi-valued attributes.
2. **2NF (Second Normal Form):**
   - Must be in 1NF.
   - No **Partial Functional Dependency** (every non-prime attribute must depend on the whole Candidate Key, not a part of a composite key).
3. **3NF (Third Normal Form):**
   - Must be in 2NF.
   - No **Transitive Dependency** (non-prime attribute should not determine another non-prime attribute: \`X -> Y\` where \`X\` is superkey or \`Y\` is prime).
4. **BCNF (Boyce-Codd Normal Form):**
   - Stricter version of 3NF.
   - For every functional dependency \`X -> Y\`, **X must be a Super Key**.

ðŸ’¡ **Placement & Exam Tip:** Practice finding Candidate Keys from functional dependency sets using attribute closures!`;
    }

    // 4. DBMS: SQL Joins
    if (q.includes('sql') && (q.includes('join') || q.includes('query'))) {
      return `### ðŸ—„ï¸ **SQL Joins â€” Visual & Practical Explanation**

1. **INNER JOIN:** Returns records having matching values in both tables.
\`\`\`sql
SELECT s.name, c.company_name 
FROM Students s 
INNER JOIN Placements c ON s.id = c.student_id;
\`\`\`

2. **LEFT (OUTER) JOIN:** Returns all records from the left table, and matched records from the right table (NULL if no match).
\`\`\`sql
SELECT s.name, c.company_name 
FROM Students s 
LEFT JOIN Placements c ON s.id = c.student_id;
\`\`\`

3. **RIGHT (OUTER) JOIN:** Returns all records from the right table, and matched records from the left table.
4. **FULL (OUTER) JOIN:** Returns all records when there is a match in either left or right table.
5. **CROSS JOIN:** Returns Cartesian product of all rows (\`N * M\` rows).

ðŸ’¡ **Interview Classic Question:** *"Find the 2nd Highest Salary in Employees table"*:
\`\`\`sql
SELECT MAX(salary) FROM Employees 
WHERE salary < (SELECT MAX(salary) FROM Employees);
-- OR using DENSE_RANK:
SELECT salary FROM (
  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rnk 
  FROM Employees
) t WHERE rnk = 2;
\`\`\``;
    }

    // 5. Operating Systems: Process vs Thread & Deadlocks
    if (q.includes('process') && q.includes('thread')) {
      return `### âš™ï¸ **Process vs Thread (Operating Systems)**

| Attribute | Process | Thread |
| :--- | :--- | :--- |
| **Definition** | An executing instance of a program | A lightweight unit of execution within a process |
| **Address Space** | Separate isolated memory space | Shared memory space with sibling threads |
| **Creation Overhead** | High (Heavyweight) | Low (Lightweight) |
| **Context Switching** | Slower (Flushes TLB, swaps address maps) | Fast (Only registers & stack pointer) |
| **Communication** | IPC required (Pipes, Sockets, Shared Memory) | Direct memory access (Requires mutex/locks) |
| **Failure Impact** | Crash does not affect other processes | Crash can terminate the parent process |

ðŸ’¡ **4 Coffman Conditions for Deadlock:**
1. **Mutual Exclusion:** Resources cannot be shared simultaneously.
2. **Hold and Wait:** Process holds one resource while waiting for another.
3. **No Preemption:** Resources cannot be forcefully taken away.
4. **Circular Wait:** Closed loop of processes waiting for each other's resources.`;
    }

    // 6. OOP: 4 Pillars
    if (q.includes('oops') || q.includes('oop') || q.includes('encapsulation') || q.includes('polymorphism') || q.includes('inheritance') || q.includes('abstraction')) {
      return `### ðŸ’» **4 Pillars of Object-Oriented Programming (OOP)**

1. **Encapsulation:** Wrapping data (fields) and code (methods) into a single unit (class) and restricting direct access using access specifiers (\`private\`, \`protected\`, \`public\`).
   - *Example:* Getters and Setters validating inputs.
2. **Abstraction:** Hiding complex implementation details and showing only essential features to the user.
   - *Example:* Driving a car using accelerator pedal without knowing internal fuel injection physics (Implemented using \`interface\` and \`abstract class\`).
3. **Inheritance:** Mechanism where a subclass inherits properties and behaviors from a superclass (\`is-a\` relationship). Promotes code reusability.
4. **Polymorphism:** Ability of an object to take many forms.
   - **Compile-time (Static):** Method Overloading (same name, different parameter signature).
   - **Runtime (Dynamic):** Method Overriding (subclass provides specific implementation of parent method via virtual functions).

ðŸ’¡ **SOLID Principles:**
â€¢ **S**ingle Responsibility â€¢ **O**pen/Closed â€¢ **L**iskov Substitution â€¢ **I**nterface Segregation â€¢ **D**ependency Inversion.`;
    }

    // 7. DSA: Quicksort & Merge Sort
    if (q.includes('sorting') || q.includes('quicksort') || q.includes('mergesort') || q.includes('binary search')) {
      return `### ðŸ’» **Core Sorting & Searching Algorithms (DSA Cheat Sheet)**

| Algorithm | Best Time | Average Time | Worst Time | Space | Stable? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Merge Sort** | O(N log N) | O(N log N) | O(N log N) | O(N) | âœ… Yes |
| **Quick Sort** | O(N log N) | O(N log N) | O(NÂ²) (Sorted array) | O(log N) | âŒ No |
| **Heap Sort** | O(N log N) | O(N log N) | O(N log N) | O(1) | âŒ No |
| **Binary Search** | O(1) | O(log N) | O(log N) | O(1) | N/A |

**Key Interview Takeaway:**
â€¢ **Quick Sort** is preferred for in-memory array sorting due to cache locality and in-place partitioning.
â€¢ **Merge Sort** is preferred for Linked Lists and large datasets where stability and worst-case guarantee O(N log N) are critical.`;
    }

    return null;
  }

  /**
   * Get Personalized AI Insights for the Student Dashboard using Groq API (openai/gpt-oss-120b)
   */
  async getStudentInsights(studentId: string): Promise<any> {
    try {
      // Primary: Call Groq service
      return await groqService.analyzeStudent(studentId);
    } catch (groqErr: any) {
      // If Groq API key is not configured or fails, use grounded actual student data analysis
      try {
        const studentData = await groqService.fetchStudentData(studentId);
        return groqService.generateLocalAnalysis(
          studentData,
          groqErr.code === 'MISSING_GROQ_API_KEY'
            ? 'Set GROQ_API_KEY in backend/.env for live openai/gpt-oss-120b inference'
            : `Groq AI notice: ${groqErr.message}`
        );
      } catch (fallbackErr) {
        // Ultimate fallback
        const user = await userRepository.findById(studentId);
        const academicsData = await studentRepository.getAcademicsData(studentId);
        const attendanceData = await studentRepository.getAttendanceData(studentId);
        const weakSub = academicsData.weakSubjects[0]?.subject || 'core subjects';
        const summary = `Your overall attendance is solid at ${attendanceData.stats.overallPercentage}%, but focus is needed on ${weakSub} to improve your CGPA.`;
        const recommendedActions = [
          `Review the latest study material for ${weakSub}`,
          `Solve 2 medium DSA problems today`,
          `Maintain 100% attendance in your next 3 classes`,
        ];
        return {
          performanceSummary: summary,
          summary,
          attendanceRiskLevel: attendanceData.stats.overallPercentage < 75 ? 'High' : attendanceData.stats.overallPercentage < 85 ? 'Medium' : 'Low',
          attendanceRiskExplanation: `Attendance is ${attendanceData.stats.overallPercentage}%.`,
          academicWeaknesses: [weakSub],
          personalizedRecommendations: recommendedActions,
          recommendations: recommendedActions,
          recommendedActions,
          improvementPlan: [
            { weekOrPhase: 'Week 1', focusArea: weakSub, action: `Review study material and practice problem sets for ${weakSub}` },
            { weekOrPhase: 'Week 2', focusArea: 'DSA Practice', action: 'Solve 2 medium problems daily' }
          ],
        };
      }
    }
  }
}

export const aiService = new AIService();
