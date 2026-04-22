import { NextResponse } from 'next/server';
import { fetchPracticeSetById } from '../../../../lib/practice';

export async function GET(_request, { params: paramsPromise }) {
  try {
    const { setId } = await paramsPromise;
    const set = await fetchPracticeSetById(setId);

    if (!set) {
      return NextResponse.json({ error: 'Practice set not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: set.id,
      name: set.name,
      questions: set.questions.map((question) => ({
        id: question.id,
        questionText: question.questionText,
        options: question.options,
        topic: question.topic,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation
      }))
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load practice set', details: error.message },
      { status: 500 }
    );
  }
}