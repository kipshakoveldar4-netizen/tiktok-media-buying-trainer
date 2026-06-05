"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ClipboardCheck,
  GraduationCap,
  RotateCcw,
  Trophy,
} from "lucide-react";
import { questions, topics } from "@/data/questions";
import { AccessRestrictionCard } from "@/components/AccessRestrictionCard";
import {
  calculateScore,
  RESULT_STORAGE_KEY,
} from "@/lib/results";
import type { QuizMode, StoredQuizResult } from "@/lib/results";
import { saveQuizResultToProgress } from "@/lib/progress";
import {
  ACCESS_EVENT,
  filterQuestionsByAccess,
  readAccessState,
} from "@/lib/access";
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
  const [isFullAccess, setIsFullAccess] = useState(false);
  const [isAccessLoaded, setIsAccessLoaded] = useState(false);
  const [examQuestionIds, setExamQuestionIds] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isCompletionVisible, setIsCompletionVisible] = useState(false);

  useEffect(() => {
    function syncAccessState() {
      setIsFullAccess(readAccessState().isFullAccess);
      setIsAccessLoaded(true);
    }

    syncAccessState();
    window.addEventListener(ACCESS_EVENT, syncAccessState);
    window.addEventListener("storage", syncAccessState);

    return () => {
      window.removeEventListener(ACCESS_EVENT, syncAccessState);
      window.removeEventListener("storage", syncAccessState);
    };
  }, []);

  const availableQuestions = useMemo(
    () => filterQuestionsByAccess(questions, isFullAccess),
    [isFullAccess],
  );

  useEffect(() => {
    if (mode === "exam") {
      setExamQuestionIds(
        shuffle(availableQuestions)
          .slice(0, 20)
          .map((question) => question.id),
      );
    }
  }, [availableQuestions, mode]);

  const quizQuestions = useMemo(() => {
    if (mode === "exam") {
      const byId = new Map(availableQuestions.map((question) => [question.id, question]));
      return examQuestionIds.flatMap((id) => {
        const question = byId.get(id);
        return question ? [question] : [];
      });
    }

    return availableQuestions.filter((question) => question.topic === topic);
  }, [availableQuestions, examQuestionIds, mode, topic]);

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
    setIsCompletionVisible(false);

    if (mode === "exam") {
      setExamQuestionIds(
        shuffle(availableQuestions)
          .slice(0, 20)
          .map((question) => question.id),
      );
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
    saveQuizResultToProgress(result, calculateScore(result, questions));
    router.push("/result");
  }

  function finishQuiz() {
    if (mode === "exam") {
      setIsCompletionVisible(true);
      return;
    }

    submitQuiz();
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
    if (isAccessLoaded && !isFullAccess) {
      return (
        <AccessRestrictionCard
          title="В демо нет вопросов для этого набора"
          description="Демо-режим использует ограниченную выборку из 20 вопросов. Откройте полный доступ, чтобы тренироваться по всей базе."
        />
      );
    }

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

  if (mode === "exam" && isCompletionVisible) {
    return (
      <section className="rounded-lg border border-white/10 bg-tiktok-panel p-5 shadow-neon sm:p-7">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-center">
          <div>
            <span className="grid h-14 w-14 place-items-center rounded-lg bg-tiktok-cyan text-tiktok-black shadow-neon">
              <Trophy className="h-7 w-7" aria-hidden="true" />
            </span>
            <p className="mt-6 text-xs font-black uppercase text-tiktok-cyan">
              Экзамен завершен
            </p>
            <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
              20 вопросов пройдены
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-tiktok-muted">
              Ответы сохранены для расчета результата. На следующем экране вы
              увидите процент, правильные ответы, слабые темы и рекомендации для
              повторения.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-tiktok-black p-4">
                <p className="text-3xl font-black text-tiktok-cyan">
                  {answeredCount}
                </p>
                <p className="mt-1 text-xs font-black uppercase text-tiktok-muted">
                  Отвечено
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-tiktok-black p-4">
                <p className="text-3xl font-black text-tiktok-red">
                  {quizQuestions.length}
                </p>
                <p className="mt-1 text-xs font-black uppercase text-tiktok-muted">
                  Вопросов
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-tiktok-black p-4">
                <p className="text-3xl font-black text-white">100%</p>
                <p className="mt-1 text-xs font-black uppercase text-tiktok-muted">
                  Готово
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={submitQuiz}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-tiktok-cyan px-5 text-sm font-black text-tiktok-black transition hover:bg-white"
              >
                Показать результат
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setIsCompletionVisible(false)}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/10 px-5 text-sm font-black text-white transition hover:bg-white/10"
              >
                Вернуться к вопросам
              </button>
              <button
                type="button"
                onClick={resetQuiz}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-tiktok-red bg-tiktok-red/10 px-5 text-sm font-black text-white transition hover:bg-tiktok-red"
              >
                Новый экзамен
                <GraduationCap className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-tiktok-black p-5">
            <ProgressBar value={100} label="Прогресс экзамена" />
            <p className="mt-5 text-sm leading-6 text-tiktok-muted">
              Совет: после результата откройте разбор ошибок и повторите темы,
              где накопилось больше всего промахов.
            </p>
          </div>
        </div>
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
        <p className="mt-3 text-xs leading-5 text-tiktok-muted">
          Выберите один вариант ответа. Номера справа помогают быстро вернуться к
          любому вопросу перед завершением.
        </p>
        {isAccessLoaded && !isFullAccess ? (
          <div className="mt-3 flex flex-col gap-3 rounded-md border border-tiktok-red/30 bg-tiktok-red/10 p-3 text-xs font-bold leading-5 text-white sm:flex-row sm:items-center sm:justify-between">
            <p>
              Демо-режим: тесты используют ограниченную выборку из 20 вопросов.
              Полный доступ открывает все 120 вопросов.
            </p>
            <Link
              href="/access"
              className="inline-flex min-h-9 shrink-0 items-center justify-center rounded-md bg-tiktok-cyan px-3 text-xs font-black text-tiktok-black transition hover:bg-white"
            >
              Открыть полный доступ
            </Link>
          </div>
        ) : null}

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
              onClick={finishQuiz}
              disabled={answeredCount !== quizQuestions.length}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-tiktok-red px-5 text-sm font-black text-white transition hover:bg-white hover:text-tiktok-black disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Check className="h-4 w-4" aria-hidden="true" />
              {mode === "exam" ? "Завершить экзамен" : "Завершить"}
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
        {!hasCurrentAnswer ? (
          <p className="mt-3 text-xs leading-5 text-tiktok-muted">
            Ответьте на текущий вопрос, чтобы перейти дальше.
          </p>
        ) : null}
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
        {answeredCount !== quizQuestions.length ? (
          <p className="mt-3 rounded-md border border-white/10 bg-white/[0.03] p-3 text-xs leading-5 text-tiktok-muted">
            Осталось ответить: {quizQuestions.length - answeredCount}
          </p>
        ) : (
          <p className="mt-3 rounded-md border border-tiktok-cyan/30 bg-tiktok-cyan/10 p-3 text-xs font-bold leading-5 text-white">
            Все вопросы отвечены. Можно завершать попытку.
          </p>
        )}
      </aside>
    </section>
  );
}
