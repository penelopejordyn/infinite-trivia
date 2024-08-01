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

  if (!puser.stats) {
    // Create a new stats record if it doesn't exist
    const newStats = await prisma.stats.create({
      data: {
        userId: puser.id,
        questionsRight: correctAnswers || 0,
        questionsWrong: incorrectAnswers || 0,
        longestGame: gameDuration || 0,
      },
    });
    return newStats;
  }

  const updatedStats = await prisma.stats.update({
    where: { userId: puser.id },
    data: {
      questionsRight: (puser.stats.questionsRight || 0) + (correctAnswers || 0),
      questionsWrong: (puser.stats.questionsWrong || 0) + (incorrectAnswers || 0),
      longestGame: Math.max(puser.stats.longestGame || 0, gameDuration || 0),
    },
  });
  
  return updatedStats;
}

export async function getUserStats(email) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { stats: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
}
