import type { Question } from "@/data/questions";
import type { QuizMode, StoredQuizResult } from "@/lib/results";

export const USER_PROGRESS_STORAGE_KEY =
  "tiktok-media-buying-trainer:user-progress";
export const USER_PROGRESS_EVENT = "tiktok-media-buying-trainer:progress-updated";

export type WeakTopicProgress = {
  topic: string;
  mistakes: number;
};

export type TopicAttemptProgress = {
  type: "topic";
  topic: string;
  percent: number;
  correct: number;
  total: number;
  submittedAt: string;
  weakTopics: WeakTopicProgress[];
};

export type TopicResultProgress = {
  attempts: number;
  bestPercent: number;
  lastPercent: number;
  lastAttemptAt: string;
  bestAttemptAt: string;
  history: TopicAttemptProgress[];
};

export type ExamAttemptProgress = {
  type: "exam";
  percent: number;
  correct: number;
  total: number;
  submittedAt: string;
  weakTopics: WeakTopicProgress[];
};

export type UserProgress = {
  version: 2;
  studiedTopics: string[];
  topicResults: Record<string, TopicResultProgress>;
  topicAttempts: TopicAttemptProgress[];
  examAttempts: ExamAttemptProgress[];
  bestExam?: ExamAttemptProgress;
  lastExam?: ExamAttemptProgress;
  totalTestsCompleted: number;
  totalTopicTestsCompleted: number;
  totalExamsCompleted: number;
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

type LegacyExamProgress = {
  percent?: number;
  correct?: number;
  total?: number;
  submittedAt?: string;
  weakTopics?: WeakTopicProgress[];
  type?: QuizMode;
};

export function createEmptyProgress(): UserProgress {
  return {
    version: 2,
    studiedTopics: [],
    topicResults: {},
    topicAttempts: [],
    examAttempts: [],
    totalTestsCompleted: 0,
    totalTopicTestsCompleted: 0,
    totalExamsCompleted: 0,
    savedAttemptIds: [],
    mistakeCountsByTopic: {},
  };
}

function normalizeWeakTopics(value: unknown): WeakTopicProgress[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (
      item &&
      typeof item === "object" &&
      "topic" in item &&
      "mistakes" in item &&
      typeof item.topic === "string" &&
      typeof item.mistakes === "number"
    ) {
      return [
        {
          topic: item.topic,
          mistakes: item.mistakes,
        },
      ];
    }

    return [];
  });
}

function normalizeExamAttempt(value: LegacyExamProgress | undefined) {
  if (
    !value ||
    typeof value.percent !== "number" ||
    typeof value.correct !== "number" ||
    typeof value.total !== "number" ||
    typeof value.submittedAt !== "string"
  ) {
    return undefined;
  }

  return {
    type: "exam" as const,
    percent: value.percent,
    correct: value.correct,
    total: value.total,
    submittedAt: value.submittedAt,
    weakTopics: normalizeWeakTopics(value.weakTopics),
  };
}

function isExamAttempt(value: ExamAttemptProgress | undefined): value is ExamAttemptProgress {
  return Boolean(value);
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
    const emptyProgress = createEmptyProgress();
    const migratedBestExam = normalizeExamAttempt(
      parsedProgress.bestExam as LegacyExamProgress | undefined,
    );
    const migratedLastExam = normalizeExamAttempt(
      parsedProgress.lastExam as LegacyExamProgress | undefined,
    );
    const examAttempts =
      parsedProgress.examAttempts
        ?.map((item) => normalizeExamAttempt(item))
        .filter(isExamAttempt) ??
      [];
    const normalizedExamAttempts =
      examAttempts.length > 0
        ? examAttempts
        : migratedBestExam
          ? [migratedBestExam]
          : [];
    const lastExam =
      migratedLastExam ??
      normalizedExamAttempts[normalizedExamAttempts.length - 1] ??
      undefined;
    const bestExam =
      migratedBestExam ??
      normalizedExamAttempts.reduce<ExamAttemptProgress | undefined>(
        (best, attempt) =>
          !best || attempt.percent > best.percent ? attempt : best,
        undefined,
      );
    const topicAttempts = parsedProgress.topicAttempts ?? [];
    const topicResults = parsedProgress.topicResults ?? {};
    const totalExamsCompleted =
      parsedProgress.totalExamsCompleted ?? normalizedExamAttempts.length;
    const totalTopicTestsCompleted =
      parsedProgress.totalTopicTestsCompleted ??
      (topicAttempts.length > 0
        ? topicAttempts.length
        : Object.values(topicResults).reduce(
            (sum, topicResult) => sum + (topicResult?.attempts ?? 0),
            0,
          ));

    return {
      ...emptyProgress,
      ...parsedProgress,
      version: 2,
      studiedTopics: parsedProgress.studiedTopics ?? [],
      topicResults,
      topicAttempts,
      examAttempts: normalizedExamAttempts,
      bestExam,
      lastExam,
      totalTestsCompleted:
        parsedProgress.totalTestsCompleted ??
        totalExamsCompleted + totalTopicTestsCompleted,
      totalTopicTestsCompleted,
      totalExamsCompleted,
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

export function resetUserProgress() {
  writeUserProgress(createEmptyProgress());
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

export function getWeakTopicsFromRows(rows: ResultRowForProgress[]) {
  const mistakesByTopic: Record<string, number> = {};

  rows.forEach((row) => {
    if (!row.isCorrect) {
      const topic = row.question.topic;
      mistakesByTopic[topic] = (mistakesByTopic[topic] ?? 0) + 1;
    }
  });

  return Object.entries(mistakesByTopic)
    .sort((left, right) => right[1] - left[1])
    .map(([topic, mistakes]) => ({
      topic,
      mistakes,
    }));
}

export function saveQuizResultToProgress(
  result: StoredQuizResult,
  score: ScoreForProgress,
) {
  const progress = readUserProgress();
  const attemptId = `${result.mode}:${result.submittedAt}`;

  if (
    progress.savedAttemptIds.includes(attemptId) ||
    progress.savedAttemptIds.includes(result.submittedAt)
  ) {
    return progress;
  }

  const attemptWeakTopics = getWeakTopicsFromRows(score.rows);
  const mistakeCountsByTopic = { ...progress.mistakeCountsByTopic };

  attemptWeakTopics.forEach((item) => {
    mistakeCountsByTopic[item.topic] =
      (mistakeCountsByTopic[item.topic] ?? 0) + item.mistakes;
  });

  const nextProgress: UserProgress = {
    ...progress,
    mistakeCountsByTopic,
    totalTestsCompleted: progress.totalTestsCompleted + 1,
    savedAttemptIds: [...progress.savedAttemptIds, attemptId],
  };

  if (result.mode === "topic" && result.topic) {
    const topicAttempt: TopicAttemptProgress = {
      type: "topic",
      topic: result.topic,
      percent: score.percent,
      correct: score.correct,
      total: score.total,
      submittedAt: result.submittedAt,
      weakTopics: attemptWeakTopics,
    };
    const previousTopicResult = progress.topicResults[result.topic];
    const isBest =
      !previousTopicResult || score.percent > previousTopicResult.bestPercent;

    nextProgress.totalTopicTestsCompleted =
      progress.totalTopicTestsCompleted + 1;
    nextProgress.topicAttempts = [...progress.topicAttempts, topicAttempt];
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
        history: [...(previousTopicResult?.history ?? []), topicAttempt],
      },
    };
  }

  if (result.mode === "exam") {
    const examAttempt: ExamAttemptProgress = {
      type: "exam",
      percent: score.percent,
      correct: score.correct,
      total: score.total,
      submittedAt: result.submittedAt,
      weakTopics: attemptWeakTopics,
    };

    nextProgress.totalExamsCompleted = progress.totalExamsCompleted + 1;
    nextProgress.examAttempts = [...progress.examAttempts, examAttempt];
    nextProgress.lastExam = examAttempt;

    if (!progress.bestExam || score.percent > progress.bestExam.percent) {
      nextProgress.bestExam = examAttempt;
    }
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
