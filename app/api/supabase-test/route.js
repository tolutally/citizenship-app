import { NextResponse } from 'next/server';
import { testSupabaseConnection } from '../../../lib/practice';

export async function GET() {
  try {
    return NextResponse.json(await testSupabaseConnection());
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Supabase connection test failed',
        details: error.message
      },
      { status: 500 }
    );
  }
}