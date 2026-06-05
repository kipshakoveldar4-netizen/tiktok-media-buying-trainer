import type { Question } from "@/data/questions";

export const ACCESS_CODE = "TIKTOK2026";
export const ACCESS_STORAGE_KEY = "tiktok-media-buying-trainer:access";
export const ACCESS_EVENT = "tiktok-media-buying-trainer:access-updated";
export const DEMO_QUESTION_LIMIT = 20;

export const DEMO_LEARNING_TOPICS = [
  "TikTok Business Center",
  "TikTok Ads Manager",
  "Creative Center",
] as const;

export const DEMO_CHAT_TOPICS = [
  "TikTok Business Center",
  "Spark Ads",
  "Advertising Policy",
] as const;

export type AccessState = {
  isFullAccess: boolean;
  unlockedAt?: string;
};

export function createDemoAccessState(): AccessState {
  return {
    isFullAccess: false,
  };
}

export function readAccessState(): AccessState {
  if (typeof window === "undefined") {
    return createDemoAccessState();
  }

  try {
    const rawValue = window.localStorage.getItem(ACCESS_STORAGE_KEY);

    if (!rawValue) {
      return createDemoAccessState();
    }

    const parsedValue = JSON.parse(rawValue) as Partial<AccessState>;

    return {
      isFullAccess: parsedValue.isFullAccess === true,
      unlockedAt:
        typeof parsedValue.unlockedAt === "string"
          ? parsedValue.unlockedAt
          : undefined,
    };
  } catch {
    return createDemoAccessState();
  }
}

export function hasFullAccess() {
  return readAccessState().isFullAccess;
}

export function unlockFullAccess(code: string) {
  if (typeof window === "undefined") {
    return false;
  }

  if (code.trim().toUpperCase() !== ACCESS_CODE) {
    return false;
  }

  const nextState: AccessState = {
    isFullAccess: true,
    unlockedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(ACCESS_STORAGE_KEY, JSON.stringify(nextState));
  window.dispatchEvent(new Event(ACCESS_EVENT));

  return true;
}

export function lockToDemoAccess() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ACCESS_STORAGE_KEY);
  window.dispatchEvent(new Event(ACCESS_EVENT));
}

export function getDemoQuestions<TQuestion extends Pick<Question, "id" | "topic">>(
  sourceQuestions: TQuestion[],
) {
  const questionsByTopic = new Map<string, TQuestion[]>();

  sourceQuestions.forEach((question) => {
    const topicQuestions = questionsByTopic.get(question.topic) ?? [];
    topicQuestions.push(question);
    questionsByTopic.set(question.topic, topicQuestions);
  });

  const selectedQuestions: TQuestion[] = [];
  let roundIndex = 0;

  while (selectedQuestions.length < DEMO_QUESTION_LIMIT) {
    let addedOnRound = false;

    questionsByTopic.forEach((topicQuestions) => {
      const question = topicQuestions[roundIndex];

      if (question && selectedQuestions.length < DEMO_QUESTION_LIMIT) {
        selectedQuestions.push(question);
        addedOnRound = true;
      }
    });

    if (!addedOnRound) {
      break;
    }

    roundIndex += 1;
  }

  return selectedQuestions;
}

export function filterQuestionsByAccess<TQuestion extends Pick<Question, "id" | "topic">>(
  sourceQuestions: TQuestion[],
  isFullAccess: boolean,
) {
  return isFullAccess ? sourceQuestions : getDemoQuestions(sourceQuestions);
}

export function isDemoLearningTopic(topic: string) {
  return DEMO_LEARNING_TOPICS.includes(topic as (typeof DEMO_LEARNING_TOPICS)[number]);
}

export function isDemoChatTopic(topic: string) {
  return DEMO_CHAT_TOPICS.includes(topic as (typeof DEMO_CHAT_TOPICS)[number]);
}
