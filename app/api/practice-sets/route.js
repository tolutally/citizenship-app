import { NextResponse } from 'next/server';
import { fetchPracticeSets } from '../../../lib/practice';

export async function GET() {
  try {
    const practiceSets = await fetchPracticeSets();
    return NextResponse.json(practiceSets);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load practice sets', details: error.message },
      { status: 500 }
    );
  }
}