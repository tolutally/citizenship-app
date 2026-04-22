import QuizApp from '../../../components/quiz-app';

export default function PracticePage({ params }) {
  return <QuizApp setId={params.setId} />;
}
