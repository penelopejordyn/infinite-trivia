import { getUserStats } from '../../lib/db'; // Adjust the path if necessary
import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';


export async function GET(request) {
  try {
    const { user } = await getSession();
    const email = (user.email);

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const auser = await getUserStats(email);
    return NextResponse.json(auser, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch user stats:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
