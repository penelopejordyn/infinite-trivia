import { updateGameStats } from '../../lib/db'; // Adjust the path if necessary
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { correctAnswers, incorrectAnswers, gameDuration } = await request.json();
    const user = await updateGameStats(correctAnswers, incorrectAnswers, gameDuration);
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Failed to update game stats:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
