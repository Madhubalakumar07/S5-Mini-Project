import { aiService } from '../src/services/aiService.js';
import { userRepository } from '../src/repositories/mockUserRepository.js';

async function testInsights() {
  console.log("Testing Student 1 (Arun Kumar)");
  const insight1 = await aiService.getStudentInsights('student_1');
  console.log(insight1);

  console.log("Testing Student 2 (Priya Sharma)");
  const insight2 = await aiService.getStudentInsights('student_2');
  console.log(insight2);
}

testInsights().catch(console.error);
