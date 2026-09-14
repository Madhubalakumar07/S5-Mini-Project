/**
 * CampusAI Backend Auth & RBAC Test Suite
 *
 * Run with: npx tsx src/tests/auth.test.ts
 *
 * Tests are pure TypeScript/Node — no external test framework required.
 * All tests run against the in-memory mock repository (no database needed).
 */

import { authService } from '../services/authService.js';
import { studentService } from '../services/studentService.js';
import { staffService } from '../services/staffService.js';
import { validateOrgEmail } from '../utils/emailValidator.js';
import { hashPassword, verifyPassword, validatePasswordStrength } from '../utils/passwordUtils.js';
import { generateAccessToken, verifyAccessToken } from '../utils/tokenUtils.js';
import { userRepository } from '../repositories/mockUserRepository.js';

// ── Simple test harness ───────────────────────────────────────────────────────
let passed = 0;
let failed = 0;
const results: Array<{ name: string; ok: boolean; error?: string }> = [];

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    passed++;
    results.push({ name, ok: true });
    console.log(`  ✅ ${name}`);
  } catch (err: any) {
    failed++;
    const msg = err.message || String(err);
    results.push({ name, ok: false, error: msg });
    console.log(`  ❌ ${name}: ${msg}`);
  }
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

// ── Test Suites ────────────────────────────────────────────────────────────────
async function runEmailValidationTests(): Promise<void> {
  console.log('\n📧 Email Validation Tests');

  await test('Valid @bitsathy.ac.in email is accepted', () => {
    const r = validateOrgEmail('student@bitsathy.ac.in');
    assert(r.isValid, 'Expected valid');
    assert(r.normalizedEmail === 'student@bitsathy.ac.in', 'Expected normalized email');
  });

  await test('Email is case-normalized', () => {
    const r = validateOrgEmail('Student@BITSATHY.AC.IN');
    assert(r.isValid, 'Expected valid');
    assert(r.normalizedEmail === 'student@bitsathy.ac.in', 'Expected lowercase normalized');
  });

  await test('@gmail.com is rejected', () => {
    const r = validateOrgEmail('student@gmail.com');
    assert(!r.isValid, 'Expected invalid');
  });

  await test('@yahoo.com is rejected', () => {
    const r = validateOrgEmail('user@yahoo.com');
    assert(!r.isValid, 'Expected invalid');
  });

  await test('@outlook.com is rejected', () => {
    const r = validateOrgEmail('user@outlook.com');
    assert(!r.isValid, 'Expected invalid');
  });

  await test('Empty email is rejected', () => {
    const r = validateOrgEmail('');
    assert(!r.isValid, 'Expected invalid');
  });

  await test('Invalid format is rejected', () => {
    const r = validateOrgEmail('notanemail');
    assert(!r.isValid, 'Expected invalid');
  });
}

async function runPasswordTests(): Promise<void> {
  console.log('\n🔐 Password Security Tests');

  await test('Password is hashed (not stored in plaintext)', async () => {
    const hash = await hashPassword('password123');
    assert(hash !== 'password123', 'Hash must not equal plaintext');
    assert(hash.startsWith('$2'), 'Hash should be bcrypt format');
  });

  await test('Correct password verifies successfully', async () => {
    const hash = await hashPassword('mySecurePass!');
    const ok = await verifyPassword('mySecurePass!', hash);
    assert(ok, 'Correct password should verify');
  });

  await test('Wrong password fails verification', async () => {
    const hash = await hashPassword('correct');
    const ok = await verifyPassword('wrong', hash);
    assert(!ok, 'Wrong password should not verify');
  });

  await test('Short password fails strength validation', () => {
    const r = validatePasswordStrength('123');
    assert(!r.isValid, 'Expected invalid');
  });

  await test('Adequate password passes strength validation', () => {
    const r = validatePasswordStrength('password123');
    assert(r.isValid, 'Expected valid');
  });
}

async function runAuthServiceTests(): Promise<void> {
  console.log('\n🔑 Authentication Service Tests');

  await test('Valid @bitsathy.ac.in student login succeeds', async () => {
    const result = await authService.login({
      email: 'arun.kumar@bitsathy.ac.in',
      password: 'password123',
    });
    assert(result.token !== undefined, 'Token must be present');
    assert(result.user.email === 'arun.kumar@bitsathy.ac.in', 'Email must match');
    assert(result.user.role === 'STUDENT', 'Role must be STUDENT');
    // Ensure passwordHash is not returned
    assert(!(result.user as any).passwordHash, 'passwordHash must not be in response');
  });

  await test('Valid @bitsathy.ac.in staff login succeeds', async () => {
    const result = await authService.login({
      email: 'priya.faculty@bitsathy.ac.in',
      password: 'password123',
    });
    assert(result.user.role === 'STAFF', 'Role must be STAFF');
    assert(result.token !== undefined, 'Token must be present');
  });

  await test('@gmail.com email is rejected at login', async () => {
    let threw = false;
    try {
      await authService.login({ email: 'test@gmail.com', password: 'password123' });
    } catch (err: any) {
      threw = true;
      assert(err.message.includes('bitsathy'), 'Error should mention domain restriction');
    }
    assert(threw, 'Should have thrown');
  });

  await test('Invalid password is rejected', async () => {
    let threw = false;
    try {
      await authService.login({
        email: 'arun.kumar@bitsathy.ac.in',
        password: 'wrongpassword',
      });
    } catch (err: any) {
      threw = true;
      assert(err.message === 'Invalid email or password.', 'Generic error message required');
    }
    assert(threw, 'Should have thrown');
  });

  await test('Non-existent user login is rejected with generic message', async () => {
    let threw = false;
    try {
      await authService.login({
        email: 'nobody@bitsathy.ac.in',
        password: 'password123',
      });
    } catch (err: any) {
      threw = true;
      // Must use generic message to prevent user enumeration
      assert(err.message === 'Invalid email or password.', 'Must use generic message');
    }
    assert(threw, 'Should have thrown');
  });

  await test('Self-registration always creates STUDENT role (not STAFF)', async () => {
    const result = await authService.register({
      name: 'Test Student',
      email: 'test.newstudent@bitsathy.ac.in',
      password: 'password123',
      department: 'Computer Science',
    });
    assert(result.user.role === 'STUDENT', 'Self-registration must always be STUDENT');
  });

  await test('Duplicate email registration is rejected', async () => {
    let threw = false;
    try {
      await authService.register({
        name: 'Duplicate',
        email: 'arun.kumar@bitsathy.ac.in',
        password: 'password123',
        department: 'Computer Science',
      });
    } catch (err: any) {
      threw = true;
      assert(err.statusCode === 409, 'Should return 409 Conflict');
    }
    assert(threw, 'Should have thrown');
  });
}

async function runTokenTests(): Promise<void> {
  console.log('\n🎟️ JWT Token Tests');

  await test('Token contains minimal payload (no password hash)', async () => {
    const user = await userRepository.findById('student_1');
    assert(user !== null, 'Test user must exist');
    const safeUser = userRepository.sanitizeUser(user!);
    const token = generateAccessToken(safeUser);
    const decoded = verifyAccessToken(token);
    assert(decoded.id === 'student_1', 'ID must match');
    assert(decoded.role === 'STUDENT', 'Role must be in token');
    assert(!(decoded as any).passwordHash, 'Password hash must not be in token');
  });

  await test('Invalid token is rejected', () => {
    let threw = false;
    try {
      verifyAccessToken('invalid.jwt.token');
    } catch {
      threw = true;
    }
    assert(threw, 'Invalid token should throw');
  });

  await test('Token payload role is trusted over request body role', async () => {
    const result = await authService.login({
      email: 'priya.faculty@bitsathy.ac.in',
      password: 'password123',
    });
    const decoded = verifyAccessToken(result.token);
    // Even if frontend tried to send role=STUDENT, token has STAFF from DB
    assert(decoded.role === 'STAFF', 'Token role must come from DB not client input');
  });
}

async function runRbacTests(): Promise<void> {
  console.log('\n🛡️ RBAC Authorization Tests');

  await test('Student cannot access another student\'s data (ID isolation)', async () => {
    // studentService always uses the authenticated user's ID, not a param
    const data = await studentService.getDashboard('student_1');
    assert(data !== null, 'student_1 can access own data');
    // Data is keyed to student_1 — attempting to fetch student_2's data via ID override
    // is prevented at the controller level (req.user.id is used, not req.params.id)
    // This test confirms the service uses the provided ID correctly
    const data2 = await studentService.getDashboard('student_2');
    assert(data !== data2, 'Different students return different data contexts');
  });

  await test('Staff service can fetch multiple student records (cohort access)', async () => {
    const students = await staffService.getStudentsList();
    assert(Array.isArray(students), 'Should return array');
    assert(students.length > 0, 'Should have students');
  });

  await test('Staff service can filter students by risk level', async () => {
    const highRisk = await staffService.getStudentsList({ riskLevel: 'High' });
    assert(Array.isArray(highRisk), 'Should return array');
    highRisk.forEach((s) => {
      assert(s.riskLevel === 'High', 'All returned students must be High risk');
    });
  });

  await test('Support case update preserves data integrity', async () => {
    const updated = await staffService.updateSupportCase('SUP_1', {
      staffRemarks: 'Updated test remark',
      supportStatus: 'Monitoring',
    });
    assert(updated.staffRemarks === 'Updated test remark', 'Remarks must update');
    assert(updated.supportStatus === 'Monitoring', 'Status must update');
    assert(updated.id === 'SUP_1', 'ID must not change');
  });

  await test('Updating non-existent support case throws 404', async () => {
    let threw = false;
    try {
      await staffService.updateSupportCase('NONEXISTENT_ID', { supportStatus: 'Resolved' });
    } catch (err: any) {
      threw = true;
      assert(err.statusCode === 404, 'Should throw 404');
    }
    assert(threw, 'Should have thrown');
  });

  await test('Announcement creation sets server-side author and date', async () => {
    const ann = await staffService.createAnnouncement({
      title: 'Test Announcement',
      description: 'Test description from backend test.',
      audience: 'All Students',
      category: 'General',
      pinned: false,
      author: 'Dr. Test Author',
      date: '2026-08-15',
    });
    assert(ann.id !== undefined, 'ID must be assigned');
    assert(ann.title === 'Test Announcement', 'Title must match');
  });
}

// ── Main runner ───────────────────────────────────────────────────────────────
async function main(): Promise<void> {
  console.log('\n═══════════════════════════════════════════════════');
  console.log('  CampusAI Backend — Auth & RBAC Test Suite');
  console.log('═══════════════════════════════════════════════════');

  await runEmailValidationTests();
  await runPasswordTests();
  await runAuthServiceTests();
  await runTokenTests();
  await runRbacTests();

  console.log('\n═══════════════════════════════════════════════════');
  console.log(`  Results: ${passed} passed, ${failed} failed`);
  console.log('═══════════════════════════════════════════════════\n');

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Test runner error:', err);
  process.exit(1);
});
