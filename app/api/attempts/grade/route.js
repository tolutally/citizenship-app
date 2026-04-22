import { NextResponse } from 'next/server';
import { buildSummary, fetchPracticeSetById } from '../../../../lib/practice';

export async function POST(request) {
  try {
    const body = await request.json();
    const set = await fetchPracticeSetById(body.setId);

    if (!set) {
      return NextResponse.json({ error: 'Practice set not found' }, { status: 404 });
    }

    return NextResponse.json(buildSummary(set, body.answers || {}));
  } catch (error) {
    const status = error instanceof SyntaxError ? 400 : 500;
    const payload =
      status === 400
        ? { error: 'Invalid JSON body' }
        : { error: 'Failed to grade attempt', details: error.message };

    return NextResponse.json(payload, { status });
  }
}