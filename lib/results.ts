import type { Question } from "@/data/questions";

export type QuizMode = "topic" | "exam";

export type StoredQuizResult = {
  mode: QuizMode;
  topic?: string;
  submittedAt: string;
  questionIds: number[];
  answers: Record<number, number>;
};

export const RESULT_STORAGE_KEY = "tiktok-media-buying-trainer:last-result";

export function calculateScore(result: StoredQuizResult, questions: Question[]) {
  const byId = new Map(questions.map((question) => [question.id, question]));
  const rows = result.questionIds.flatMap((id) => {
    const question = byId.get(id);

    if (!question) {
      return [];
    }

    const selectedAnswer = result.answers[id];
    const isCorrect = selectedAnswer === question.correctAnswer;

    return [
      {
        question,
        selectedAnswer,
        isCorrect,
      },
    ];
  });

  const correct = rows.filter((row) => row.isCorrect).length;
  const total = rows.length;
  const percent = total === 0 ? 0 : Math.round((correct / total) * 100);

  return {
    rows,
    correct,
    total,
    percent,
    mistakes: rows.filter((row) => !row.isCorrect),
  };
}
