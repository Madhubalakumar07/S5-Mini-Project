import { studentRepository } from './repositories/studentRepository.js';
import { userRepository } from './repositories/userRepository.js';
import { testDbConnection } from './config/db.js';
import { initDb } from './config/initDb.js';

async function main() {
  const connected = await testDbConnection();
  if (connected) {
    await initDb();
  }
  const user = await userRepository.findByEmail('farhana.yasmin@bitsathy.ac.in');
  console.log('User found from DB:', user?.name, user?.id, user?.role);
  if (user) {
    const dash = await studentRepository.getDashboardData(user.id);
    const att = await studentRepository.getAttendanceData(user.id);
    const acad = await studentRepository.getAcademicsData(user.id);
    const place = await studentRepository.getPlacementData(user.id);
    console.log('✅ studentRepository verified for Farhana Yasmin:');
    console.log(' - Dashboard academics CGPA:', dash?.academics.cgpa);
    console.log(' - Dashboard attendance:', dash?.attendance.percentage);
    console.log(' - Attendance subjects count:', att.subjects.length, att.subjects.map(s => `${s.subject}: ${s.percentage}%`));
    console.log(' - Academics subject scores:', acad.subjectScores.map(s => `${s.subject}: ${s.score}`));
    console.log(' - Placement score & status:', place.placementScore.score, place.placementScore.status);
    console.log(' - Skills:', place.resumeChecklist.find(r => r.label.includes('Technical Skills'))?.label);
  }
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
