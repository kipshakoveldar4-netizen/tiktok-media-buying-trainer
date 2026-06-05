"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  RotateCcw,
  Target,
  XCircle,
} from "lucide-react";
import { questions } from "@/data/questions";
import {
  calculateScore,
  RESULT_STORAGE_KEY,
} from "@/lib/results";
import type { StoredQuizResult } from "@/lib/results";
import { ProgressBar } from "@/components/ProgressBar";
import {
  createEmptyProgress,
  getWeakTopics,
  saveQuizResultToProgress,
} from "@/lib/progress";
import type { UserProgress } from "@/lib/progress";

export default function ResultPage() {
  const [result, setResult] = useState<StoredQuizResult | null>(null);
  const [progress, setProgress] = useState<UserProgress>(() =>
    createEmptyProgress(),
  );
  const [isProgressSaved, setIsProgressSaved] = useState(false);

  useEffect(() => {
    const rawResult = window.localStorage.getItem(RESULT_STORAGE_KEY);

    if (rawResult) {
      try {
        setResult(JSON.parse(rawResult) as StoredQuizResult);
      } catch {
        window.localStorage.removeItem(RESULT_STORAGE_KEY);
        setResult(null);
      }
    }
  }, []);

  const score = useMemo(() => {
    if (!result) {
      return null;
    }

    return calculateScore(result, questions);
  }, [result]);

  useEffect(() => {
    if (!result || !score) {
      return;
    }

    setProgress(saveQuizResultToProgress(result, score));
    setIsProgressSaved(true);
  }, [result, score]);

  if (!result || !score) {
    return (
      <section className="rounded-lg border border-white/10 bg-tiktok-panel p-6 shadow-neon">
        <p className="text-xs font-black uppercase text-tiktok-red">Нет результата</p>
        <h1 className="mt-3 text-3xl font-black text-white">Сначала пройдите тест</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-tiktok-muted">
          После завершения тематического теста или экзамена здесь появится процент,
          список ответов и ссылка на разбор ошибок.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/topics"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-tiktok-cyan px-5 text-sm font-black text-tiktok-black transition hover:bg-white"
          >
            К темам
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/exam"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-tiktok-red bg-tiktok-red/10 px-5 text-sm font-black text-white transition hover:bg-tiktok-red"
          >
            Экзамен
            <ClipboardList className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    );
  }

  const retryHref =
    result.mode === "topic" && result.topic
      ? `/test?topic=${encodeURIComponent(result.topic)}`
      : "/exam";
  const weakTopics = getWeakTopics(progress, 4);

  return (
    <div className="space-y-6">
      <section className="grid gap-5 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <div className="rounded-lg border border-white/10 bg-tiktok-panel p-5 shadow-neon">
          <p className="text-xs font-black uppercase text-tiktok-cyan">
            {result.mode === "exam" ? "Экзамен" : "Тематический тест"}
          </p>
          <h1 className="mt-3 text-3xl font-black text-white">Результат</h1>
          <div className="mt-6 grid aspect-square place-items-center rounded-lg border border-white/10 bg-tiktok-black">
            <div className="text-center">
              <p className="text-6xl font-black text-white">{score.percent}%</p>
              <p className="mt-2 text-sm font-bold text-tiktok-muted">
                {score.correct} из {score.total} правильно
              </p>
            </div>
          </div>
          <div className="mt-5">
            <ProgressBar value={score.percent} label="Точность" />
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-tiktok-panel p-5 shadow-red">
          <h2 className="text-2xl font-black text-white">
            {result.topic ?? "Смешанная проверка по всем темам"}
          </h2>
          <p className="mt-3 text-sm leading-6 text-tiktok-muted">
            Ниже показаны правильные и неправильные ответы. Для фокусной подготовки
            откройте разбор ошибок или пройдите попытку заново.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href={retryHref}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-tiktok-cyan px-5 text-sm font-black text-tiktok-black transition hover:bg-white"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Пройти заново
            </Link>
            <Link
              href="/review"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-tiktok-red bg-tiktok-red/10 px-5 text-sm font-black text-white transition hover:bg-tiktok-red"
            >
              Разбор ошибок
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {isProgressSaved ? (
            <p className="mt-5 rounded-md border border-tiktok-cyan/30 bg-tiktok-cyan/10 p-3 text-sm font-bold leading-6 text-white">
              {result.mode === "exam"
                ? "Экзамен сохранён в разделе «Мой прогресс»."
                : "Тематический тест сохранён отдельно как результат по теме."}
            </p>
          ) : null}
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-tiktok-panel p-5 shadow-neon sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase text-tiktok-red">
              Слабые темы
            </p>
            <h2 className="mt-2 text-2xl font-black text-white">
              Что повторить после этой попытки
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-tiktok-muted">
              Прогресс сохранен в браузере. Слабые темы считаются по накопленным
              ошибкам в тестах и экзаменах.
            </p>
          </div>
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-tiktok-red text-white">
            <Target className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>

        {weakTopics.length > 0 ? (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {weakTopics.map((item) => (
              <Link
                key={item.topic}
                href={`/learning/${encodeURIComponent(item.topic)}`}
                className="rounded-lg border border-white/10 bg-tiktok-black p-4 transition hover:border-tiktok-cyan hover:bg-white/[0.04]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-black text-white">{item.topic}</h3>
                    <p className="mt-2 text-sm leading-6 text-tiktok-muted">
                      Повторите конспект и затем пройдите тематический тест заново.
                    </p>
                  </div>
                  <span className="rounded-md bg-tiktok-red px-2 py-1 text-xs font-black text-white">
                    {item.mistakes}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-5 rounded-lg border border-white/10 bg-tiktok-black p-4 text-sm leading-6 text-tiktok-muted">
            Ошибок пока нет. Продолжайте проходить тематические тесты и экзамен,
            чтобы система подсказала приоритеты для повторения.
          </p>
        )}
      </section>

      <section className="space-y-3">
        {score.rows.map(({ question, selectedAnswer, isCorrect }) => (
          <article
            key={question.id}
            className="rounded-lg border border-white/10 bg-tiktok-panel p-4 shadow-red sm:p-5"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase text-tiktok-muted">
                  {question.topic} · вопрос #{question.id}
                </p>
                <h2 className="mt-2 text-lg font-black leading-tight text-white">
                  {question.question}
                </h2>
              </div>
              <span
                className={[
                  "inline-flex min-h-9 items-center justify-center gap-2 rounded-md px-3 text-xs font-black uppercase",
                  isCorrect
                    ? "bg-tiktok-cyan text-tiktok-black"
                    : "bg-tiktok-red text-white",
                ].join(" ")}
              >
                {isCorrect ? (
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <XCircle className="h-4 w-4" aria-hidden="true" />
                )}
                {isCorrect ? "Верно" : "Ошибка"}
              </span>
            </div>

            <div className="mt-4 grid gap-2">
              {question.options.map((option, index) => {
                const isCorrectOption = index === question.correctAnswer;
                const isSelectedOption = index === selectedAnswer;

                return (
                  <div
                    key={option}
                    className={[
                      "rounded-md border p-3 text-sm font-semibold",
                      isCorrectOption
                        ? "border-tiktok-cyan bg-tiktok-cyan/10 text-white"
                        : isSelectedOption
                          ? "border-tiktok-red bg-tiktok-red/10 text-white"
                          : "border-white/10 bg-white/[0.03] text-tiktok-muted",
                    ].join(" ")}
                  >
                    {option}
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
