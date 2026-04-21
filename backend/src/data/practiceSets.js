const practiceSets = [
  {
    id: 'practice-1',
    name: 'Practice 1',
    questions: [
      {
        id: 'q1',
        questionText: 'What are the three main levels of government in Canada?',
        options: [
          'Federal, provincial, municipal',
          'National, local, indigenous',
          'Royal, provincial, city',
          'Federal, territorial, borough'
        ],
        correctAnswer: 'Federal, provincial, municipal',
        explanation: "Canada's three levels are federal, provincial or territorial, and municipal.",
        topic: 'Government'
      },
      {
        id: 'q2',
        questionText: "Who is Canada's Head of State?",
        options: ['The Prime Minister', 'The Governor General', 'The King', 'The Premier'],
        correctAnswer: 'The King',
        explanation: 'Canada is a constitutional monarchy. The monarch is Head of State.',
        topic: 'Government'
      },
      {
        id: 'q3',
        questionText: 'What is the highest court in Canada?',
        options: ['Federal Court', 'Supreme Court of Canada', 'Court of Appeal', 'Parliament Court'],
        correctAnswer: 'Supreme Court of Canada',
        explanation: 'The Supreme Court of Canada is the final court of appeal.',
        topic: 'Law'
      }
    ]
  },
  {
    id: 'practice-2',
    name: 'Practice 2',
    questions: [
      {
        id: 'q4',
        questionText: 'What do you promise when taking the Oath of Citizenship?',
        options: [
          'Loyalty to Canada and to obey Canadian laws',
          'To vote in every election',
          'To serve in the military',
          'To move to Ottawa'
        ],
        correctAnswer: 'Loyalty to Canada and to obey Canadian laws',
        explanation: 'The oath includes allegiance to Canada and faithful observance of its laws.',
        topic: 'Citizenship'
      },
      {
        id: 'q5',
        questionText: 'Which leaf is on the Canadian flag?',
        options: ['Maple leaf', 'Oak leaf', 'Pine leaf', 'Cedar leaf'],
        correctAnswer: 'Maple leaf',
        explanation: 'The national flag features a stylized red maple leaf.',
        topic: 'Symbols'
      },
      {
        id: 'q6',
        questionText: 'What are the two official languages of Canada?',
        options: ['English and French', 'English and Spanish', 'French and German', 'English and Cree'],
        correctAnswer: 'English and French',
        explanation: 'Canada has two official languages at the federal level: English and French.',
        topic: 'Identity'
      }
    ]
  }
];

module.exports = { practiceSets };
