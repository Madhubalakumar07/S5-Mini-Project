import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories/userRepository.js';
import { testDbConnection } from '../config/db.js';
import { config } from '../config/index.js';

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log(`
Usage:
  npx tsx src/scripts/addUser.ts <name> <email> [role: STUDENT|STAFF] [department] [rollNumber/staffId]

Examples:
  npx tsx src/scripts/addUser.ts "Ravi Chandran" "ravi.c@bitsathy.ac.in" STUDENT "Computer Science" "21CS099"
  npx tsx src/scripts/addUser.ts "Dr. Uma Maheshwari" "uma.m@bitsathy.ac.in" STAFF "Information Technology" "STF-IT-099"
`);
    process.exit(1);
  }

  const [name, rawEmail, rawRole = 'STUDENT', department = 'Computer Science', idNumber = ''] = args;
  const email = rawEmail.trim().toLowerCase();
  const role = rawRole.toUpperCase() === 'STAFF' ? 'STAFF' : 'STUDENT';

  if (!email.endsWith(`@${config.orgEmailDomain}`)) {
    console.error(`❌ Error: Email must end with @${config.orgEmailDomain}`);
    process.exit(1);
  }

  const connected = await testDbConnection();
  if (!connected) {
    console.error('❌ Could not connect to PostgreSQL');
    process.exit(1);
  }

  const existing = await userRepository.findByEmail(email);
  if (existing) {
    console.warn(`⚠️ User already exists in database: ${existing.email} (Role: ${existing.role})`);
    process.exit(0);
  }

  const defaultPassword = 'password123';
  const defaultPasswordHash = await bcrypt.hash(defaultPassword, 10);

  const newUser = await userRepository.create({
    name: name.trim(),
    email,
    passwordHash: defaultPasswordHash,
    role,
    department,
    rollNumber: role === 'STUDENT' ? (idNumber || undefined) : undefined,
    staffId: role === 'STAFF' ? (idNumber || undefined) : undefined,
    designation: role === 'STAFF' ? 'Faculty' : undefined,
  });

  console.log('✅ User registered successfully in database:');
  console.log(` - ID: ${newUser.id}`);
  console.log(` - Name: ${newUser.name}`);
  console.log(` - Email: ${newUser.email}`);
  console.log(` - Role: ${newUser.role}`);
  console.log(` - Department: ${newUser.department}`);
  console.log(` - Default Password: ${defaultPassword}`);
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Error creating user:', err.message || err);
  process.exit(1);
});
