"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ClipboardCheck,
  RotateCcw,
} from "lucide-react";
import { questions, topics } from "@/data/questions";
import {
  RESULT_STORAGE_KEY,
} from "@/lib/results";
import type { QuizMode, StoredQuizResult } from "@/lib/results";
import { ProgressBar } from "@/components/ProgressBar";

type QuizRunnerProps = {
  mode: QuizMode;
  topic?: string;
};

function shuffle<T>(items: T[]) {
  return [...items]
    .map((item) => ({ item, sort: Math.random() }))
    .sort((left, right) => left.sort - right.sort)
    .map(({ item }) => item);
}

export function QuizRunner({ mode, topic }: QuizRunnerProps) {
  const router = useRouter();
  const [examQuestionIds, setExamQuestionIds] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  useEffect(() => {
    if (mode === "exam") {
      setExamQuestionIds(shuffle(questions).slice(0, 20).map((question) => question.id));
    }
  }, [mode]);

  const quizQuestions = useMemo(() => {
    if (mode === "exam") {
      const byId = new Map(questions.map((question) => [question.id, question]));
      return examQuestionIds.flatMap((id) => {
        const question = byId.get(id);
        return question ? [question] : [];
      });
    }

    return questions.filter((question) => question.topic === topic);
  }, [examQuestionIds, mode, topic]);

  const selectedTopicExists = !topic || topics.includes(topic as (typeof topics)[number]);
  const currentQuestion = quizQuestions[activeIndex];
  const answeredCount = quizQuestions.filter(
    (question) => answers[question.id] !== undefined,
  ).length;
  const progress =
    quizQuestions.length === 0
      ? 0
      : Math.round(((activeIndex + 1) / quizQuestions.length) * 100);
  const isLastQuestion = activeIndex === quizQuestions.length - 1;
  const hasCurrentAnswer =
    currentQuestion && answers[currentQuestion.id] !== undefined;

  function resetQuiz() {
    setActiveIndex(0);
    setAnswers({});

    if (mode === "exam") {
      setExamQuestionIds(shuffle(questions).slice(0, 20).map((question) => question.id));
    }
  }

  function submitQuiz() {
    if (quizQuestions.length === 0) {
      return;
    }

    const result: StoredQuizResult = {
      mode,
      topic: mode === "topic" ? topic : undefined,
      submittedAt: new Date().toISOString(),
      questionIds: quizQuestions.map((question) => question.id),
      answers,
    };

    window.localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(result));
    router.push("/result");
  }

  if (mode === "topic" && (!topic || !selectedTopicExists)) {
    return (
      <section className="rounded-lg border border-white/10 bg-tiktok-panel p-6 shadow-neon">
        <p className="text-sm font-bold uppercase text-tiktok-cyan">Тема не выбрана</p>
        <h1 className="mt-3 text-3xl font-black text-white">Выберите тему для тренировки</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-tiktok-muted">
          Перейдите на страницу тем и запустите короткий тест по нужному разделу.
        </p>
        <Link
          href="/topics"
          className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-tiktok-cyan px-5 text-sm font-black text-tiktok-black transition hover:bg-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          К темам
        </Link>
      </section>
    );
  }

  if (mode === "exam" && quizQuestions.length === 0) {
    return (
      <section className="rounded-lg border border-white/10 bg-tiktok-panel p-6 shadow-neon">
        <p className="text-sm font-bold uppercase text-tiktok-red">Экзамен</p>
        <h1 className="mt-3 text-3xl font-black text-white">Готовим 20 вопросов</h1>
        <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-tiktok-cyan" />
        </div>
      </section>
    );
  }

  if (!currentQuestion) {
    return (
      <section className="rounded-lg border border-white/10 bg-tiktok-panel p-6 shadow-neon">
        <p className="text-sm font-bold uppercase text-tiktok-red">Пока пусто</p>
        <h1 className="mt-3 text-3xl font-black text-white">В этой теме нет вопросов</h1>
        <Link
          href="/topics"
          className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-tiktok-cyan px-5 text-sm font-black text-tiktok-black transition hover:bg-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Вернуться к темам
        </Link>
      </section>
    );
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="rounded-lg border border-white/10 bg-tiktok-panel p-4 shadow-neon sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase text-tiktok-cyan">
              {mode === "exam" ? "Экзаменационный режим" : "Тренировка по теме"}
            </p>
            <h1 className="mt-2 text-2xl font-black text-white sm:text-3xl">
              {mode === "exam" ? "Экзамен на 20 вопросов" : topic}
            </h1>
          </div>
          <button
            type="button"
            onClick={resetQuiz}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-white/10 px-4 text-sm font-bold text-white transition hover:border-tiktok-cyan hover:bg-tiktok-cyan hover:text-tiktok-black"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Сбросить
          </button>
        </div>

        <div className="mt-6">
          <ProgressBar value={progress} label={`Вопрос ${activeIndex + 1} из ${quizQuestions.length}`} />
        </div>

        <div className="mt-7 rounded-lg border border-white/10 bg-tiktok-black p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase text-tiktok-muted">
            <span className="rounded-md bg-white/10 px-2 py-1">
              {currentQuestion.topic}
            </span>
            <span className="rounded-md bg-tiktok-red/15 px-2 py-1 text-tiktok-red">
              #{currentQuestion.id}
            </span>
          </div>

          <h2 className="mt-4 text-xl font-black leading-tight text-white sm:text-2xl">
            {currentQuestion.question}
          </h2>

          <div className="mt-5 grid gap-3">
            {currentQuestion.options.map((option, optionIndex) => {
              const isSelected = answers[currentQuestion.id] === optionIndex;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    setAnswers((current) => ({
                      ...current,
                      [currentQuestion.id]: optionIndex,
                    }))
                  }
                  className={[
                    "flex min-h-14 items-center gap-3 rounded-lg border p-3 text-left text-sm font-semibold leading-5 transition sm:text-base",
                    isSelected
                      ? "border-tiktok-cyan bg-tiktok-cyan text-tiktok-black shadow-neon"
                      : "border-white/10 bg-white/[0.03] text-white hover:border-tiktok-red hover:bg-white/10",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "grid h-8 w-8 shrink-0 place-items-center rounded-md border text-xs font-black",
                      isSelected
                        ? "border-tiktok-black/20 bg-tiktok-black text-white"
                        : "border-white/10 bg-white/5 text-tiktok-muted",
                    ].join(" ")}
                  >
                    {optionIndex + 1}
                  </span>
                  <span>{option}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setActiveIndex((index) => Math.max(index - 1, 0))}
            disabled={activeIndex === 0}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 px-5 text-sm font-bold text-white transition hover:border-white/25 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Назад
          </button>

          {isLastQuestion ? (
            <button
              type="button"
              onClick={submitQuiz}
              disabled={answeredCount !== quizQuestions.length}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-tiktok-red px-5 text-sm font-black text-white transition hover:bg-white hover:text-tiktok-black disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Check className="h-4 w-4" aria-hidden="true" />
              Завершить
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                setActiveIndex((index) => Math.min(index + 1, quizQuestions.length - 1))
              }
              disabled={!hasCurrentAnswer}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-tiktok-cyan px-5 text-sm font-black text-tiktok-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Далее
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <aside className="rounded-lg border border-white/10 bg-tiktok-panel p-4 shadow-red lg:sticky lg:top-24 lg:h-fit">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-tiktok-red text-white">
            <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-black text-white">Статус</p>
            <p className="text-xs font-semibold text-tiktok-muted">
              {answeredCount} из {quizQuestions.length} отвечено
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-5 gap-2">
          {quizQuestions.map((question, index) => {
            const isActive = index === activeIndex;
            const isAnswered = answers[question.id] !== undefined;

            return (
              <button
                key={question.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={[
                  "grid aspect-square place-items-center rounded-md border text-xs font-black transition",
                  isActive
                    ? "border-tiktok-cyan bg-tiktok-cyan text-tiktok-black"
                    : isAnswered
                      ? "border-tiktok-red bg-tiktok-red text-white"
                      : "border-white/10 bg-white/[0.03] text-tiktok-muted hover:border-white/25 hover:text-white",
                ].join(" ")}
                aria-label={`Перейти к вопросу ${index + 1}`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>

        <p className="mt-5 text-xs leading-5 text-tiktok-muted">
          В конце тренажер покажет процент, все ответы и отдельный разбор ошибок.
        </p>
      </aside>
    </section>
  );
}
