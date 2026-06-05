import type { Question } from "@/data/questions";
import type { StoredQuizResult } from "@/lib/results";

export const USER_PROGRESS_STORAGE_KEY =
  "tiktok-media-buying-trainer:user-progress";
export const USER_PROGRESS_EVENT = "tiktok-media-buying-trainer:progress-updated";

export type TopicResultProgress = {
  attempts: number;
  bestPercent: number;
  lastPercent: number;
  lastAttemptAt: string;
  bestAttemptAt: string;
  history: TopicAttemptProgress[];
};

export type TopicAttemptProgress = {
  percent: number;
  correct: number;
  total: number;
  submittedAt: string;
};

export type ExamBestProgress = {
  percent: number;
  correct: number;
  total: number;
  submittedAt: string;
};

export type UserProgress = {
  version: 1;
  studiedTopics: string[];
  topicResults: Record<string, TopicResultProgress>;
  bestExam?: ExamBestProgress;
  totalTestsCompleted: number;
  savedAttemptIds: string[];
  mistakeCountsByTopic: Record<string, number>;
  lastUpdatedAt?: string;
};

export type ResultRowForProgress = {
  question: Question;
  isCorrect: boolean;
};

export type ScoreForProgress = {
  percent: number;
  correct: number;
  total: number;
  rows: ResultRowForProgress[];
};

export function createEmptyProgress(): UserProgress {
  return {
    version: 1,
    studiedTopics: [],
    topicResults: {},
    totalTestsCompleted: 0,
    savedAttemptIds: [],
    mistakeCountsByTopic: {},
  };
}

export function readUserProgress(): UserProgress {
  if (typeof window === "undefined") {
    return createEmptyProgress();
  }

  const rawProgress = window.localStorage.getItem(USER_PROGRESS_STORAGE_KEY);

  if (!rawProgress) {
    return createEmptyProgress();
  }

  try {
    const parsedProgress = JSON.parse(rawProgress) as Partial<UserProgress>;

    return {
      ...createEmptyProgress(),
      ...parsedProgress,
      version: 1,
      studiedTopics: parsedProgress.studiedTopics ?? [],
      topicResults: parsedProgress.topicResults ?? {},
      totalTestsCompleted: parsedProgress.totalTestsCompleted ?? 0,
      savedAttemptIds: parsedProgress.savedAttemptIds ?? [],
      mistakeCountsByTopic: parsedProgress.mistakeCountsByTopic ?? {},
    };
  } catch {
    return createEmptyProgress();
  }
}

export function writeUserProgress(progress: UserProgress) {
  if (typeof window === "undefined") {
    return;
  }

  const nextProgress = {
    ...progress,
    lastUpdatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(
    USER_PROGRESS_STORAGE_KEY,
    JSON.stringify(nextProgress),
  );
  window.dispatchEvent(new Event(USER_PROGRESS_EVENT));
}

export function markTopicAsStudied(topic: string) {
  const progress = readUserProgress();

  if (!progress.studiedTopics.includes(topic)) {
    writeUserProgress({
      ...progress,
      studiedTopics: [...progress.studiedTopics, topic],
    });
  }
}

export function unmarkTopicAsStudied(topic: string) {
  const progress = readUserProgress();

  writeUserProgress({
    ...progress,
    studiedTopics: progress.studiedTopics.filter((item) => item !== topic),
  });
}

export function saveQuizResultToProgress(
  result: StoredQuizResult,
  score: ScoreForProgress,
) {
  const progress = readUserProgress();
  const attemptId = result.submittedAt;

  if (progress.savedAttemptIds.includes(attemptId)) {
    return progress;
  }

  const mistakeCountsByTopic = { ...progress.mistakeCountsByTopic };

  for (const row of score.rows) {
    if (!row.isCorrect) {
      const topic = row.question.topic;
      mistakeCountsByTopic[topic] = (mistakeCountsByTopic[topic] ?? 0) + 1;
    }
  }

  const nextProgress: UserProgress = {
    ...progress,
    mistakeCountsByTopic,
    totalTestsCompleted: progress.totalTestsCompleted + 1,
    savedAttemptIds: [...progress.savedAttemptIds, attemptId],
  };

  if (result.mode === "topic" && result.topic) {
    const previousTopicResult = progress.topicResults[result.topic];
    const isBest =
      !previousTopicResult || score.percent > previousTopicResult.bestPercent;

    nextProgress.topicResults = {
      ...progress.topicResults,
      [result.topic]: {
        attempts: (previousTopicResult?.attempts ?? 0) + 1,
        bestPercent: isBest
          ? score.percent
          : (previousTopicResult?.bestPercent ?? score.percent),
        lastPercent: score.percent,
        lastAttemptAt: result.submittedAt,
        bestAttemptAt: isBest
          ? result.submittedAt
          : (previousTopicResult?.bestAttemptAt ?? result.submittedAt),
        history: [
          ...(previousTopicResult?.history ?? []),
          {
            percent: score.percent,
            correct: score.correct,
            total: score.total,
            submittedAt: result.submittedAt,
          },
        ],
      },
    };
  }

  if (
    result.mode === "exam" &&
    (!progress.bestExam || score.percent > progress.bestExam.percent)
  ) {
    nextProgress.bestExam = {
      percent: score.percent,
      correct: score.correct,
      total: score.total,
      submittedAt: result.submittedAt,
    };
  }

  writeUserProgress(nextProgress);

  return nextProgress;
}

export function getWeakTopics(progress: UserProgress, limit = 4) {
  return Object.entries(progress.mistakeCountsByTopic)
    .filter(([, mistakes]) => mistakes > 0)
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
    .map(([topic, mistakes]) => ({
      topic,
      mistakes,
    }));
}
