import { config } from '../config/index.js';
import { pool } from '../config/db.js';
import { studentRepository } from '../repositories/studentRepository.js';
import { userRepository } from '../repositories/userRepository.js';

export interface StudentAIAnalysis {
  performanceSummary: string;
  summary: string; // Dashboard alias
  attendanceRiskLevel: 'Low' | 'Medium' | 'High';
  attendanceRiskExplanation: string;
  academicWeaknesses: string[];
  personalizedRecommendations: string[];
  recommendations: string[]; // Dashboard alias
  recommendedActions: string[]; // Dashboard alias
  improvementPlan: Array<{
    weekOrPhase: string;
    focusArea: string;
    action: string;
  }>;
  analyzedAt: string;
  modelUsed: string;
  student: {
    id: string;
    name: string;
    department: string;
    rollNumber?: string;
    attendancePercentage: number;
    cgpa: number;
    averageInternal: number;
    averageAssignmentScore: number;
  };
}

export interface StudentActualData {
  studentId: string;
  name: string;
  email: string;
  department: string;
  rollNumber?: string;
  year?: number;
  semester?: number;
  attendance: {
    overallPercentage: number;
    classesAttended: number;
    totalClasses: number;
    safeBunksAvailable: number;
    subjects: Array<{
      subject: string;
      percentage: number;
      attended: number;
      total: number;
      status: string;
    }>;
  };
  academics: {
    cgpa: number;
    averageInternal: number;
    subjectScores: Array<{
      subject: string;
      score: number;
      maxScore: number;
      trend: string;
    }>;
  };
  assignments: {
    averageScore: number;
    breakdown: Record<string, number>;
  };
  previousPerformance: {
    semesterHistory: Array<{
      semester: string;
      gpa: number;
    }>;
    progressionTrend: string;
  };
}

export class GroqService {
  public get model(): string {
    return config.groqModel || 'openai/gpt-oss-120b';
  }
  public readonly apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

  /**
   * Fetches the logged-in student's actual data from PostgreSQL database.
   * Does NOT use hardcoded data.
   */
  public async fetchStudentData(studentId: string): Promise<StudentActualData> {
    if (!studentId || typeof studentId !== 'string' || studentId.trim() === '') {
      const err = new Error('Invalid student data: A valid student ID is required.');
      (err as any).statusCode = 400;
      throw err;
    }

    // 1. Fetch user from repository/PostgreSQL users table
    const user = await userRepository.findById(studentId);

    // 2. Query PostgreSQL students table directly
    let studentRow: any = null;
    try {
      const res = await pool.query(
        `SELECT * FROM students WHERE user_id::text = $1 OR id::text = $1 OR register_number = $1 LIMIT 1`,
        [studentId]
      );
      studentRow = res.rows[0] || null;
    } catch (dbErr: any) {
      console.warn('[GroqService DB Notice]: Direct students query fallback -', dbErr.message);
    }

    // 3. Fetch domain aggregates from student repository
    const [dashboardData, attendanceData, academicsData] = await Promise.all([
      studentRepository.getDashboardData(studentId),
      studentRepository.getAttendanceData(studentId),
      studentRepository.getAcademicsData(studentId),
    ]);

    if (!user && !studentRow && !dashboardData) {
      const err = new Error(`Invalid student data: No student profile found for ID "${studentId}".`);
      (err as any).statusCode = 404;
      throw err;
    }

    // Extract student identity
    const name = studentRow?.name || user?.name || dashboardData?.student.name || 'Student';
    const email = studentRow?.email || user?.email || dashboardData?.student.email || '';
    const department = studentRow?.department || user?.department || dashboardData?.student.department || 'Computer Science';
    const rollNumber = studentRow?.register_number || user?.rollNumber || dashboardData?.student.rollNumber || undefined;
    const year = studentRow?.year || user?.year || 3;
    const semester = studentRow?.semester || 5;

    // Attendance data
    const overallAttendance = Number(
      studentRow?.attendance ?? attendanceData.stats.overallPercentage ?? dashboardData?.attendance.percentage ?? 0
    );
    const classesAttended = Number(
      attendanceData.stats.classesAttended ?? dashboardData?.attendance.classesAttended ?? 0
    );
    const totalClasses = Number(
      attendanceData.stats.totalClasses ?? 200
    );
    const safeBunks = Number(attendanceData.stats.safeBunksAvailable ?? 0);

    const subjectsAttendance = attendanceData.subjects.map(s => ({
      subject: s.subject,
      percentage: Number(s.percentage),
      attended: Number(s.attended),
      total: Number(s.total),
      status: s.status,
    }));

    // Academic scores
    const cgpa = Number(studentRow?.cgpa ?? user?.cgpa ?? dashboardData?.academics.cgpa ?? 0);
    const avgInternal = Number(studentRow?.academic_score ?? dashboardData?.academics.avgInternal ?? 0);
    const subjectScores = academicsData.subjectScores.map(s => ({
      subject: s.subject,
      score: Number(s.score),
      maxScore: Number(s.maxScore),
      trend: s.trend,
    }));

    // Assignment performance
    const assignmentEntry = academicsData.performanceTrend.find(p =>
      p.assessment.toLowerCase().includes('assignment')
    );
    const assignmentBreakdown: Record<string, number> = {};
    let assignmentSum = 0;
    let assignmentCount = 0;

    if (assignmentEntry) {
      const keys = ['dataStructures', 'dbms', 'os', 'cn', 'aiml'] as const;
      keys.forEach(k => {
        if (typeof (assignmentEntry as any)[k] === 'number') {
          const val = (assignmentEntry as any)[k];
          assignmentBreakdown[k] = val;
          assignmentSum += val;
          assignmentCount++;
        }
      });
    }

    const avgAssignment = assignmentCount > 0
      ? Math.round((assignmentSum / assignmentCount) * 10) / 10
      : Math.round(avgInternal);

    // Previous academic history
    const semesterHistory = academicsData.semesterHistory.map(h => ({
      semester: h.semester,
      gpa: Number(h.gpa),
    }));

    let progressionTrend = 'Stable';
    if (semesterHistory.length >= 2) {
      const first = semesterHistory[0].gpa;
      const last = semesterHistory[semesterHistory.length - 1].gpa;
      const diff = last - first;
      if (diff > 0.3) progressionTrend = `Upward growth (+${diff.toFixed(2)} CGPA)`;
      else if (diff < -0.3) progressionTrend = `Declining (${diff.toFixed(2)} CGPA)`;
      else progressionTrend = 'Consistent steady performance';
    }

    return {
      studentId,
      name,
      email,
      department,
      rollNumber,
      year,
      semester,
      attendance: {
        overallPercentage: overallAttendance,
        classesAttended,
        totalClasses,
        safeBunksAvailable: safeBunks,
        subjects: subjectsAttendance,
      },
      academics: {
        cgpa,
        averageInternal: avgInternal,
        subjectScores,
      },
      assignments: {
        averageScore: avgAssignment,
        breakdown: assignmentBreakdown,
      },
      previousPerformance: {
        semesterHistory,
        progressionTrend,
      },
    };
  }

  /**
   * Calls Groq API with model `openai/gpt-oss-120b` to generate AI-powered student analysis.
   */
  public async analyzeStudent(studentId: string): Promise<StudentAIAnalysis> {
    // Step 1: Fetch actual student data from database
    const studentData = await this.fetchStudentData(studentId);

    // Step 2: Validate Groq API key
    const apiKey = (config.groqApiKey || process.env.GROQ_API_KEY || '').replace(/^["']|["']$/g, '').trim();
    const isMissingKey = !apiKey || apiKey === 'your_api_key' || apiKey === 'undefined' || apiKey === 'null';

    if (isMissingKey) {
      const err = new Error(
        'Groq API key is missing or not configured. Please store your valid key in backend/.env as GROQ_API_KEY=your_api_key'
      );
      (err as any).statusCode = 503;
      (err as any).code = 'MISSING_GROQ_API_KEY';
      throw err;
    }

    // Step 3: Build analysis prompt
    const prompt = this.buildPrompt(studentData);

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content:
                'You are an elite Academic Performance Advisor and Dean of Studies AI for an engineering college. ' +
                'You analyze actual student metrics from the database (attendance percentage, academic marks, assignment scores, and previous semester history). ' +
                'You must generate an accurate, objective, actionable analysis in strictly valid JSON format matching the requested schema. ' +
                'Do not wrap your response in markdown code blocks or backticks. Return raw JSON only.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 1500,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        let parsedMessage = errorText;
        try {
          const errJson = JSON.parse(errorText);
          parsedMessage = errJson?.error?.message || errJson?.message || errorText;
        } catch {}

        console.error(`[Groq API Error] HTTP ${response.status}: ${parsedMessage}`);

        const apiErr = new Error(`Groq API failed (${response.status}): ${parsedMessage}`);
        (apiErr as any).statusCode = response.status === 401 ? 401 : response.status === 429 ? 429 : 502;
        (apiErr as any).code = 'GROQ_API_FAILURE';
        throw apiErr;
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;

      if (!content || typeof content !== 'string') {
        const emptyErr = new Error('Groq API returned an empty or invalid response.');
        (emptyErr as any).statusCode = 502;
        throw emptyErr;
      }

      const parsedAnalysis = this.parseGroqJson(content, studentData);
      return parsedAnalysis;
    } catch (err: any) {
      // Re-throw if already formatted
      if (err.code === 'MISSING_GROQ_API_KEY' || err.statusCode) {
        throw err;
      }
      console.error('[Groq AI Connection Error]:', err.message);
      const networkErr = new Error(`Failed to communicate with Groq API (${this.model}): ${err.message}`);
      (networkErr as any).statusCode = 502;
      (networkErr as any).code = 'GROQ_NETWORK_ERROR';
      throw networkErr;
    }
  }

  /**
   * Deterministic local analysis engine fallback when Groq API key is not configured or offline.
   * Analyzes actual student data from the database using identical schema.
   */
  public generateLocalAnalysis(studentData: StudentActualData, note?: string): StudentAIAnalysis {
    const attPct = studentData.attendance.overallPercentage;
    const cgpa = studentData.academics.cgpa;
    const avgAssignment = studentData.assignments.averageScore;
    const avgInternal = studentData.academics.averageInternal;

    // 1. Attendance risk level
    let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
    let riskExplanation = '';
    if (attPct < 75) {
      riskLevel = 'High';
      riskExplanation = `Attendance is ${attPct}%, which is below the statutory 75% university eligibility requirement.`;
    } else if (attPct < 85) {
      riskLevel = 'Medium';
      riskExplanation = `Attendance is ${attPct}%, which meets statutory limit but offers narrow safety margin for upcoming exams.`;
    } else {
      riskLevel = 'Low';
      riskExplanation = `Attendance is strong at ${attPct}%, well above the 85% honor standing threshold.`;
    }

    // 2. Academic weaknesses
    const weakSubjects = studentData.academics.subjectScores
      .filter(s => s.score < 75 || s.trend === 'down')
      .map(s => `${s.subject} (Score: ${s.score}/100, Trend: ${s.trend})`);

    const lowAttendanceSubjects = studentData.attendance.subjects
      .filter(s => s.percentage < 75)
      .map(s => `${s.subject} attendance (${s.percentage}%)`);

    const weaknesses = [
      ...weakSubjects,
      ...lowAttendanceSubjects,
    ];

    if (weaknesses.length === 0) {
      weaknesses.push('None identified — maintaining consistent distinction across subjects.');
    }

    // 3. Performance summary
    const summary = `${studentData.name} (${studentData.department}) maintains a CGPA of ${cgpa.toFixed(2)} with an overall attendance of ${attPct}%. ` +
      `Assignment score average is ${avgAssignment}% with an internal assessment mean of ${avgInternal}%. ` +
      `Historical progression indicates ${studentData.previousPerformance.progressionTrend.toLowerCase()}. ` +
      (note ? `[${note}]` : '');

    // 4. Recommendations
    const recommendations: string[] = [];
    if (attPct < 75) {
      recommendations.push(`Attend the next 10 consecutive lectures without absent days to recover to >= 75% attendance.`);
    } else {
      recommendations.push(`Maintain current attendance rhythm to retain ${studentData.attendance.safeBunksAvailable} available buffer classes.`);
    }

    if (studentData.academics.subjectScores.some(s => s.score < 75)) {
      const lowest = [...studentData.academics.subjectScores].sort((a, b) => a.score - b.score)[0];
      recommendations.push(`Focus targeted revision on ${lowest.subject} (current marks: ${lowest.score}) through textbook review and solved papers.`);
    } else {
      recommendations.push('Attempt advanced competitive mock tests to sustain distinction grade.');
    }

    if (avgAssignment < 80) {
      recommendations.push(`Complete lab and assignment submissions early to improve the current ${avgAssignment}% assignment average.`);
    } else {
      recommendations.push(`Leverage high assignment performance (${avgAssignment}%) by mentoring peer study circles.`);
    }

    // 5. Improvement plan
    const improvementPlan = [
      {
        weekOrPhase: 'Week 1',
        focusArea: 'Attendance & Assignment Catch-up',
        action: 'Submit all pending assignments and secure 100% attendance in all scheduled classes.',
      },
      {
        weekOrPhase: 'Week 2',
        focusArea: 'Targeted Subject Revision',
        action: 'Review weakest subject units and solve previous 3 years semester question papers.',
      },
      {
        weekOrPhase: 'Week 3',
        focusArea: 'Mock Assessment & Code Practice',
        action: 'Take internal model test and practice 2 DSA problems daily on LeetCode/HackerRank.',
      },
      {
        weekOrPhase: 'Week 4',
        focusArea: 'Final Semester Readiness Review',
        action: 'Verify CGPA target alignment and review faculty feedback on lab coursework.',
      },
    ];

    return {
      performanceSummary: summary,
      summary,
      attendanceRiskLevel: riskLevel,
      attendanceRiskExplanation: riskExplanation,
      academicWeaknesses: weaknesses,
      personalizedRecommendations: recommendations,
      recommendations,
      recommendedActions: recommendations,
      improvementPlan,
      analyzedAt: new Date().toISOString(),
      modelUsed: 'local-analytics-engine',
      student: {
        id: studentData.studentId,
        name: studentData.name,
        department: studentData.department,
        rollNumber: studentData.rollNumber,
        attendancePercentage: attPct,
        cgpa,
        averageInternal: avgInternal,
        averageAssignmentScore: avgAssignment,
      },
    };
  }

  /**
   * Constructs the structured analytical prompt for Groq API.
   */
  private buildPrompt(data: StudentActualData): string {
    return `Analyze the following real student performance data from our university database and return a structured assessment.

=== STUDENT PROFILE ===
Name: ${data.name}
Department: ${data.department}
Roll Number: ${data.rollNumber || 'N/A'}
Year / Semester: Year ${data.year || 3}, Sem ${data.semester || 5}

=== ATTENDANCE METRICS ===
Overall Attendance: ${data.attendance.overallPercentage}%
Classes Attended: ${data.attendance.classesAttended} / ${data.attendance.totalClasses}
Safe Bunks Available: ${data.attendance.safeBunksAvailable}
Subject-wise Attendance:
${data.attendance.subjects.map(s => `- ${s.subject}: ${s.percentage}% (${s.attended}/${s.total} attended) [${s.status}]`).join('\n')}

=== ACADEMIC MARKS & PERFORMANCE ===
Current CGPA: ${data.academics.cgpa}
Average Internal Assessment: ${data.academics.averageInternal}%
Subject Assessment Scores:
${data.academics.subjectScores.map(s => `- ${s.subject}: ${s.score}/${s.maxScore} (Trend: ${s.trend})`).join('\n')}

=== ASSIGNMENT PERFORMANCE ===
Average Assignment Score: ${data.assignments.averageScore}%
Assignment Breakdown:
${Object.entries(data.assignments.breakdown).map(([k, v]) => `- ${k}: ${v}%`).join('\n') || '- General assignment average: ' + data.assignments.averageScore + '%'}

=== PREVIOUS ACADEMIC PERFORMANCE (SEMESTER HISTORY) ===
${data.previousPerformance.semesterHistory.map(h => `- ${h.semester}: ${h.gpa} GPA`).join('\n')}
Progression Trend: ${data.previousPerformance.progressionTrend}

=== OUTPUT REQUIREMENTS ===
You must return a valid JSON object strictly matching this schema:
{
  "performanceSummary": "A concise, professional 2-3 sentence summary evaluating attendance momentum, academic standing, and assignment progress.",
  "attendanceRiskLevel": "Low" | "Medium" | "High",
  "attendanceRiskExplanation": "Specific rationale based on statutory 75% limit and subject attendance.",
  "academicWeaknesses": [
    "Specific subject or topic area where student scores are lagging"
  ],
  "personalizedRecommendations": [
    "Actionable, personalized recommendation 1",
    "Actionable, personalized recommendation 2",
    "Actionable, personalized recommendation 3"
  ],
  "improvementPlan": [
    {
      "weekOrPhase": "Week 1",
      "focusArea": "Core topic or metric",
      "action": "Concrete step for student"
    },
    {
      "weekOrPhase": "Week 2",
      "focusArea": "Core topic or metric",
      "action": "Concrete step for student"
    },
    {
      "weekOrPhase": "Week 3",
      "focusArea": "Core topic or metric",
      "action": "Concrete step for student"
    },
    {
      "weekOrPhase": "Week 4",
      "focusArea": "Core topic or metric",
      "action": "Concrete step for student"
    }
  ]
}

Return ONLY valid JSON. No conversational text, no markdown backticks.`;
  }

  /**
   * Safely parses JSON returned by Groq and attaches student metadata and backward-compatible aliases.
   */
  private parseGroqJson(content: string, studentData: StudentActualData): StudentAIAnalysis {
    const sanitized = content
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    let json: any;
    try {
      json = JSON.parse(sanitized);
    } catch (parseErr) {
      console.warn('[GroqService] Failed to parse raw response, trying extraction:', parseErr);
      const jsonMatch = sanitized.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        json = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Groq model response was not valid JSON.');
      }
    }

    const performanceSummary =
      typeof json.performanceSummary === 'string' && json.performanceSummary.trim()
        ? json.performanceSummary.trim()
        : `${studentData.name} has a CGPA of ${studentData.academics.cgpa} with ${studentData.attendance.overallPercentage}% attendance.`;

    const rawRisk = (json.attendanceRiskLevel || '').toString().toLowerCase();
    const attendanceRiskLevel: 'Low' | 'Medium' | 'High' =
      rawRisk.includes('high') ? 'High' : rawRisk.includes('med') ? 'Medium' : 'Low';

    const attendanceRiskExplanation =
      typeof json.attendanceRiskExplanation === 'string'
        ? json.attendanceRiskExplanation
        : `Attendance stands at ${studentData.attendance.overallPercentage}%.`;

    const academicWeaknesses: string[] = Array.isArray(json.academicWeaknesses)
      ? json.academicWeaknesses.filter((w: any) => typeof w === 'string')
      : [];

    const personalizedRecommendations: string[] = Array.isArray(json.personalizedRecommendations)
      ? json.personalizedRecommendations.filter((r: any) => typeof r === 'string')
      : Array.isArray(json.recommendations)
      ? json.recommendations.filter((r: any) => typeof r === 'string')
      : [];

    let improvementPlan: any[] = [];
    if (Array.isArray(json.improvementPlan)) {
      improvementPlan = json.improvementPlan.map((step: any, idx: number) => {
        if (typeof step === 'string') {
          return {
            weekOrPhase: `Week ${idx + 1}`,
            focusArea: 'Academic Improvement',
            action: step,
          };
        }
        return {
          weekOrPhase: step.weekOrPhase || `Week ${idx + 1}`,
          focusArea: step.focusArea || 'Target Area',
          action: step.action || step.description || 'Focus on coursework',
        };
      });
    }

    return {
      performanceSummary,
      summary: performanceSummary,
      attendanceRiskLevel,
      attendanceRiskExplanation,
      academicWeaknesses,
      personalizedRecommendations,
      recommendations: personalizedRecommendations,
      recommendedActions: personalizedRecommendations,
      improvementPlan,
      analyzedAt: new Date().toISOString(),
      modelUsed: this.model,
      student: {
        id: studentData.studentId,
        name: studentData.name,
        department: studentData.department,
        rollNumber: studentData.rollNumber,
        attendancePercentage: studentData.attendance.overallPercentage,
        cgpa: studentData.academics.cgpa,
        averageInternal: studentData.academics.averageInternal,
        averageAssignmentScore: studentData.assignments.averageScore,
      },
    };
  }
}

export const groqService = new GroqService();
