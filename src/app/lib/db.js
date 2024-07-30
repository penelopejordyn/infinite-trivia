import { PrismaClient } from '@prisma/client';
import { getSession } from '@auth0/nextjs-auth0';

const prisma = new PrismaClient();

export async function updateGameStats(correctAnswers, incorrectAnswers, gameDuration) {
  const session = await getSession(); // Ensure correct context
  if (!session) {
    throw new Error('No session found');
  }
  const user = session.user;

  const puser = await prisma.user.findUnique({
    where: { email: user.email },
    include: { stats: true },
  });

  if (!puser) {
    throw new Error('User not found');
  }

  const updatedStats = await prisma.stats.upsert({
    where: { userId: puser.id },
    update: {
      questionsRight: (puser.stats.questionsRight || 0) + (correctAnswers || 0),
      questionsWrong: (puser.stats.questionsWrong || 0) + (incorrectAnswers || 0),
      longestGame: Math.max(puser.stats.longestGame || 0, gameDuration || 0),
    },
    create: {
      userId: puser.id,
      questionsRight: correctAnswers || 0,
      questionsWrong: incorrectAnswers || 0,
      longestGame: gameDuration || 0,
    },
  });

  console.log(updatedStats);
  return updatedStats;
}
