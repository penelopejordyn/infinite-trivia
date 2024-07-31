import { getUserStats } from '../../lib/db'; // Adjust the path if necessary
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const user = await getUserStats(email);
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch user stats:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
