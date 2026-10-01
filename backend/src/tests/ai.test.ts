import assert from 'assert';
import { aiService } from '../services/aiService.js';
import { COMPANY_PROFILES, getAllCompanyProfiles, analyzeStudentForCompany } from '../data/companyPlacementData.js';

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

async function runAITests() {
  console.log('\n═══════════════════════════════════════════════════');
  console.log('  CampusAI Backend — AI & Placement Test Suite');
  console.log('═══════════════════════════════════════════════════\n');

  console.log('🏢 Company Placement Intelligence Tests');
  await test('Company database contains key target companies', () => {
    const companies = getAllCompanyProfiles();
    assert(companies.length >= 4, 'Should contain at least 4 company profiles');
    assert(COMPANY_PROFILES.zoho, 'Zoho profile should exist');
    assert(COMPANY_PROFILES.tcs, 'TCS profile should exist');
    assert(COMPANY_PROFILES.accenture, 'Accenture profile should exist');
    assert(COMPANY_PROFILES.infosys, 'Infosys profile should exist');
  });

  await test('Zoho profile contains multi-stage recruitment breakdown with sample questions', () => {
    const zoho = COMPANY_PROFILES.zoho;
    assert(zoho.stages.length >= 4, 'Zoho should have multiple stages');
    assert(zoho.stages.some(s => s.name.includes('Round 3') || s.name.includes('Advanced Programming')), 'Round 3 advanced programming exists');
    assert(zoho.previousYearQuestions.coding.length > 0, 'Previous year coding questions exist');
  });

  await test('Student company analysis correctly flags eligibility and skill matches', () => {
    const studentStats = {
      name: 'Arun Kumar',
      department: 'Computer Science',
      cgpa: 8.4,
      skills: ['React', 'Node.js', 'Python', 'DSA', 'SQL'],
      codingProblemsSolved: 248,
      placementScore: 78,
    };

    const analysis = analyzeStudentForCompany('zoho', studentStats);
    assert(analysis.isCgpaEligible === true, 'Student CGPA 8.4 is >= Zoho min CGPA 6.5');
    assert(analysis.estimatedReadiness > 50, 'Estimated readiness should be calculated');
    assert(analysis.recommendations.length > 0, 'Targeted recommendations generated');
  });

  console.log('\n📄 Study Material / PDF Summarizer Tests');
  await test('Summarizer parses lecture text into structured exam study guide', async () => {
    const sampleText = `
      Computer Networks Unit 3: Transport Layer Protocols.
      The Transmission Control Protocol (TCP) provides reliable, ordered, and error-checked delivery of a stream of octets between applications.
      TCP uses a three-way handshake: SYN, SYN-ACK, ACK to establish connections.
      Flow control is managed using sliding window protocol.
      Congestion control uses Slow Start, Congestion Avoidance, Fast Retransmit, and Fast Recovery algorithms.
      UDP is a connectionless and lightweight transport protocol without reliability guarantees, suitable for video streaming.
    `;

    const summary = await aiService.summarizeStudyMaterial(sampleText, 'CN_Unit_3_Transport_Layer.pdf', 'Computer Networks');
    assert(summary.title === 'CN_Unit_3_Transport_Layer.pdf', 'Title preserved');
    assert(summary.executiveSummary.length > 10, 'Executive summary created');
    assert(summary.topExamQuestions.length >= 2, 'Top exam questions generated');
    assert(summary.quickRevisionPoints.length > 0, 'Quick revision bullets generated');
  });

  console.log('\n💬 AI Chat & Mentorship Tests');
  await test('Chatbot provides company-specific recruitment procedures when asked about a company', async () => {
    const response = await aiService.processChat('usr_student_1', 'Can you explain the Zoho recruitment process and rounds?');
    assert(response.actionType === 'company_guidance', 'Action type is company_guidance');
    assert(response.text.includes('Zoho'), 'Response mentions Zoho');
    assert(response.text.includes('Round 1') || response.text.includes('Recruitment'), 'Response includes recruitment stages');
  });

  await test('Chatbot delivers attendance recovery advice for low attendance subjects', async () => {
    const response = await aiService.processChat('usr_student_1', 'How do I improve my attendance?');
    assert(response.text.includes('Computer Networks') || response.text.includes('attendance'), 'Identifies at-risk subjects');
  });

  await test('Chatbot answers academic CS questions (e.g. TCP vs UDP, Normalization, OOP)', async () => {
    const response = await aiService.processChat('usr_student_1', 'What is the difference between TCP and UDP?');
    assert(response.actionType === 'academic_guidance', 'Action type is academic_guidance');
    assert(response.text.includes('3-Way Handshake') || response.text.includes('Connection'), 'Explains TCP vs UDP');
  });

  await test('Chatbot answers questions grounded in active PDF study material context', async () => {
    const context = `Computer Networks Unit 3: Transport Layer Protocols.
    TCP uses Congestion Control with Slow Start, Congestion Avoidance, Fast Retransmit, and Fast Recovery.
    UDP is connectionless with an 8-byte header.`;

    const response = await aiService.processChat('usr_student_1', 'How does congestion control work in this material?', [], undefined, context);
    assert(response.actionType === 'pdf_qa', 'Action type is pdf_qa');
    assert(response.text.includes('Uploaded Study Material') || response.text.includes('Document'), 'References study material');
  });

  console.log('\n═══════════════════════════════════════════════════');
  console.log(`  Results: ${passed} passed, ${failed} failed`);
  console.log('═══════════════════════════════════════════════════\n');

  if (failed > 0) process.exit(1);
}

runAITests().catch(console.error);

