import { NextResponse } from 'next/server';
import { fetchPracticeSetDistributions } from '../../../../lib/practice';

export async function GET() {
  try {
    const distributions = await fetchPracticeSetDistributions();
    return NextResponse.json({ sets: distributions });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load practice set distribution', details: error.message },
      { status: 500 }
    );
  }
}
