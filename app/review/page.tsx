"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, RotateCcw, TriangleAlert } from "lucide-react";
import { questions } from "@/data/questions";
import {
  calculateScore,
  RESULT_STORAGE_KEY,
} from "@/lib/results";
import type { StoredQuizResult } from "@/lib/results";

export default function ReviewPage() {
  const [result, setResult] = useState<StoredQuizResult | null>(null);

  useEffect(() => {
    const rawResult = window.localStorage.getItem(RESULT_STORAGE_KEY);

    if (rawResult) {
      setResult(JSON.parse(rawResult) as StoredQuizResult);
    }
  }, []);

  const score = useMemo(() => {
    if (!result) {
      return null;
    }

    return calculateScore(result, questions);
  }, [result]);

  if (!result || !score) {
    return (
      <section className="rounded-lg border border-white/10 bg-tiktok-panel p-6 shadow-neon">
        <p className="text-xs font-black uppercase text-tiktok-red">Разбор недоступен</p>
        <h1 className="mt-3 text-3xl font-black text-white">Сначала завершите попытку</h1>
        <Link
          href="/topics"
          className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-tiktok-cyan px-5 text-sm font-black text-tiktok-black transition hover:bg-white"
        >
          К темам
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>
    );
  }

  const retryHref =
    result.mode === "topic" && result.topic
      ? `/test?topic=${encodeURIComponent(result.topic)}`
      : "/exam";

  if (score.mistakes.length === 0) {
    return (
      <section className="rounded-lg border border-white/10 bg-tiktok-panel p-6 shadow-neon">
        <span className="grid h-12 w-12 place-items-center rounded-lg bg-tiktok-cyan text-tiktok-black">
          <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
        </span>
        <p className="mt-5 text-xs font-black uppercase text-tiktok-cyan">Без ошибок</p>
        <h1 className="mt-3 text-3xl font-black text-white">Отличная попытка</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-tiktok-muted">
          Все ответы верные. Можно пройти экзамен заново с новой выборкой вопросов.
        </p>
        <Link
          href="/exam"
          className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-tiktok-red px-5 text-sm font-black text-white transition hover:bg-white hover:text-tiktok-black"
        >
          Новый экзамен
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-white/10 bg-tiktok-panel p-5 shadow-neon sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase text-tiktok-red">Разбор ошибок</p>
            <h1 className="mt-2 text-3xl font-black text-white">
              Ошибок: {score.mistakes.length}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-tiktok-muted">
              Сфокусируйтесь на объяснениях и правильных вариантах, затем повторите
              попытку в том же режиме.
            </p>
          </div>
          <Link
            href={retryHref}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-tiktok-cyan px-5 text-sm font-black text-tiktok-black transition hover:bg-white"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Пройти заново
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        {score.mistakes.map(({ question, selectedAnswer }) => (
          <article
            key={question.id}
            className="rounded-lg border border-tiktok-red/40 bg-tiktok-panel p-4 shadow-red sm:p-5"
          >
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-tiktok-red text-white">
                <TriangleAlert className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-black uppercase text-tiktok-muted">
                  {question.topic} · вопрос #{question.id}
                </p>
                <h2 className="mt-2 text-lg font-black leading-tight text-white">
                  {question.question}
                </h2>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-tiktok-red/35 bg-tiktok-red/10 p-4">
                <p className="text-xs font-black uppercase text-tiktok-red">Ваш ответ</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-white">
                  {question.options[selectedAnswer] ?? "Ответ не выбран"}
                </p>
              </div>
              <div className="rounded-lg border border-tiktok-cyan/35 bg-tiktok-cyan/10 p-4">
                <p className="text-xs font-black uppercase text-tiktok-cyan">
                  Правильный ответ
                </p>
                <p className="mt-2 text-sm font-semibold leading-6 text-white">
                  {question.options[question.correctAnswer]}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs font-black uppercase text-tiktok-muted">Объяснение</p>
              <p className="mt-2 text-sm leading-6 text-white">{question.explanation}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
