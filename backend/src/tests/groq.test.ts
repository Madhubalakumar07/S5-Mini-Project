import assert from 'assert';
import { groqService } from '../services/groqService.js';
import { config } from '../config/index.js';

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void> | void) {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (err: any) {
    console.error(`  ❌ ${name}: ${err.message}`);
    failed++;
  }
}

async function runGroqTests() {
  console.log('\n═══════════════════════════════════════════════════');
  console.log('  CampusAI Backend — Groq AI Integration Test Suite');
  console.log('═══════════════════════════════════════════════════\n');

  console.log('🤖 Model & Configuration Requirements');
  await test('Groq service uses the required openai/gpt-oss-120b model', () => {
    assert.strictEqual(
      groqService.model,
      'openai/gpt-oss-120b',
      'Must use model openai/gpt-oss-120b as specified in requirement 1'
    );
    assert.strictEqual(
      groqService.apiUrl,
      'https://api.groq.com/openai/v1/chat/completions',
      'Must target Groq chat completions endpoint'
    );
  });

  await test('Config loads GROQ_API_KEY from backend environment', () => {
    assert(
      typeof config.groqApiKey === 'string',
      'Config must expose groqApiKey from .env'
    );
  });

  console.log('\n📊 Database Student Data Extraction (No Hardcoded Data)');
  await test('Fetches actual student data including attendance, academics, assignments, and previous history', async () => {
    const studentData = await groqService.fetchStudentData('usr_student_1');

    // Identity check
    assert(studentData.name, 'Student name must be fetched');
    assert(studentData.department, 'Student department must be fetched');

    // 1. Attendance percentage
    assert(
      typeof studentData.attendance.overallPercentage === 'number',
      'Overall attendance percentage must be extracted'
    );
    assert(studentData.attendance.overallPercentage > 0, 'Attendance should be positive');
    assert(Array.isArray(studentData.attendance.subjects), 'Subject attendance must be an array');
    assert(studentData.attendance.subjects.length > 0, 'Subject attendance must contain actual subjects');

    // 2. Academic marks/performance
    assert(
      typeof studentData.academics.cgpa === 'number',
      'Academic CGPA must be extracted'
    );
    assert(Array.isArray(studentData.academics.subjectScores), 'Subject scores must be an array');
    assert(studentData.academics.subjectScores.length > 0, 'Subject scores must contain records');

    // 3. Assignment performance
    assert(
      typeof studentData.assignments.averageScore === 'number',
      'Assignment performance score must be extracted'
    );

    // 4. Previous academic performance
    assert(
      Array.isArray(studentData.previousPerformance.semesterHistory),
      'Previous semester history must be extracted'
    );
    assert(
      studentData.previousPerformance.semesterHistory.length > 0,
      'Previous semester history must contain records'
    );
  });

  console.log('\n🛡️ Error Handling Tests');
  await test('Rejects empty or invalid student ID with 400 error', async () => {
    try {
      await groqService.fetchStudentData('');
      assert.fail('Should have thrown an error for empty student ID');
    } catch (err: any) {
      assert.strictEqual(err.statusCode, 400);
      assert(err.message.includes('Invalid student data'));
    }
  });

  await test('Rejects non-existent student profile with 404 error', async () => {
    try {
      await groqService.fetchStudentData('non_existent_student_99999');
      assert.fail('Should have thrown 404 for non-existent student');
    } catch (err: any) {
      assert.strictEqual(err.statusCode, 404);
      assert(err.message.includes('No student profile found'));
    }
  });

  await test('Catches missing or placeholder API key and throws 503 MISSING_GROQ_API_KEY', async () => {
    // When GROQ_API_KEY is 'your_api_key' or empty, analyzeStudent must throw descriptive error
    const currentKey = config.groqApiKey;
    try {
      (config as any).groqApiKey = 'your_api_key';
      try {
        await groqService.analyzeStudent('usr_student_1');
        assert.fail('Should have thrown MISSING_GROQ_API_KEY error');
      } catch (err: any) {
        assert.strictEqual(err.statusCode, 503);
        assert.strictEqual(err.code, 'MISSING_GROQ_API_KEY');
        assert(err.message.includes('GROQ_API_KEY'));
      }
    } finally {
      (config as any).groqApiKey = currentKey;
    }
  });

  console.log('\n🎯 Analysis Output Schema Tests (Requirement 6 & 8)');
  await test('Generates all 5 required elements: summary, risk level, weaknesses, recommendations, and improvement plan', async () => {
    const studentData = await groqService.fetchStudentData('usr_student_1');
    const analysis = groqService.generateLocalAnalysis(studentData);

    // 1. Performance summary
    assert(typeof analysis.performanceSummary === 'string', 'performanceSummary must be string');
    assert(analysis.performanceSummary.length > 20, 'performanceSummary must be substantial');

    // 2. Attendance risk level
    assert(['Low', 'Medium', 'High'].includes(analysis.attendanceRiskLevel), 'attendanceRiskLevel must be Low/Medium/High');
    assert(typeof analysis.attendanceRiskExplanation === 'string', 'attendanceRiskExplanation must explain risk');

    // 3. Academic weaknesses
    assert(Array.isArray(analysis.academicWeaknesses), 'academicWeaknesses must be an array');
    assert(analysis.academicWeaknesses.length > 0, 'academicWeaknesses must contain items');

    // 4. Personalized recommendations
    assert(Array.isArray(analysis.personalizedRecommendations), 'personalizedRecommendations must be an array');
    assert(analysis.personalizedRecommendations.length >= 2, 'personalizedRecommendations must have at least 2 items');

    // 5. Improvement plan
    assert(Array.isArray(analysis.improvementPlan), 'improvementPlan must be an array');
    assert(analysis.improvementPlan.length > 0, 'improvementPlan must have steps');
    assert(analysis.improvementPlan[0].weekOrPhase, 'improvementPlan steps have weekOrPhase');
    assert(analysis.improvementPlan[0].action, 'improvementPlan steps have action');

    // Compatibility aliases for existing student dashboard
    assert.strictEqual(analysis.summary, analysis.performanceSummary, 'summary alias matches performanceSummary');
    assert.deepStrictEqual(analysis.recommendedActions, analysis.personalizedRecommendations, 'recommendedActions matches personalizedRecommendations');
  });

  console.log('\n═══════════════════════════════════════════════════');
  console.log(`  Results: ${passed} passed, ${failed} failed`);
  console.log('═══════════════════════════════════════════════════\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runGroqTests().catch(err => {
  console.error('Test runner error:', err);
  process.exit(1);
});
