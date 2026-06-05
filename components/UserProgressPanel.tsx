"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  RotateCcw,
  Target,
  Trophy,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { knowledgeBase } from "@/data/knowledgeBase";
import {
  createEmptyProgress,
  getWeakTopics,
  readUserProgress,
  resetUserProgress,
  USER_PROGRESS_EVENT,
} from "@/lib/progress";
import type { UserProgress } from "@/lib/progress";
import { RESULT_STORAGE_KEY } from "@/lib/results";

export function UserProgressPanel() {
  const [progress, setProgress] = useState<UserProgress>(() =>
    createEmptyProgress(),
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  useEffect(() => {
    function syncProgress() {
      setProgress(readUserProgress());
      setIsLoaded(true);
    }

    syncProgress();
    window.addEventListener(USER_PROGRESS_EVENT, syncProgress);
    window.addEventListener("storage", syncProgress);

    return () => {
      window.removeEventListener(USER_PROGRESS_EVENT, syncProgress);
      window.removeEventListener("storage", syncProgress);
    };
  }, []);

  const weakTopics = useMemo(() => getWeakTopics(progress, 4), [progress]);
  const studiedCount = progress.studiedTopics.length;
  const bestExam = progress.bestExam ? `${progress.bestExam.percent}%` : "Нет";
  const hasAnyProgress =
    studiedCount > 0 ||
    progress.totalTestsCompleted > 0 ||
    Boolean(progress.bestExam) ||
    weakTopics.length > 0;

  function confirmResetProgress() {
    window.localStorage.removeItem(RESULT_STORAGE_KEY);
    resetUserProgress();
    setProgress(createEmptyProgress());
    setIsResetConfirmOpen(false);
  }

  return (
    <section className="rounded-lg border border-white/10 bg-tiktok-panel p-5 shadow-neon sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase text-tiktok-cyan">Мой прогресс</p>
          <h2 className="mt-2 text-3xl font-black text-white">Личная статистика</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-tiktok-muted">
            Прогресс сохраняется локально в браузере: изученные темы, попытки,
            лучший экзамен и слабые темы по ошибкам.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            disabled={!hasAnyProgress}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-tiktok-red bg-tiktok-red/10 px-5 text-sm font-black text-white transition hover:bg-tiktok-red disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Сбросить прогресс
          </button>
          <Link
            href="/learning"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-tiktok-cyan px-5 text-sm font-black text-tiktok-black transition hover:bg-white"
          >
            Продолжить обучение
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ProgressStatCard
          title="Изучено тем"
          value={isLoaded ? `${studiedCount}/${knowledgeBase.length}` : "0"}
          icon={BookOpenCheck}
          accent="cyan"
        />
        <ProgressStatCard
          title="Лучший экзамен"
          value={bestExam}
          icon={Trophy}
          accent="red"
        />
        <ProgressStatCard
          title="Пройдено тестов"
          value={String(progress.totalTestsCompleted)}
          icon={BarChart3}
          accent="cyan"
        />
        <ProgressStatCard
          title="Слабых тем"
          value={String(weakTopics.length)}
          icon={Target}
          accent="red"
        />
      </div>

      <div className="mt-5 rounded-lg border border-white/10 bg-tiktok-black p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-black text-white">Слабые темы</p>
            <p className="mt-1 text-xs leading-5 text-tiktok-muted">
              Список строится по накопленным ошибкам в тестах и экзаменах.
            </p>
          </div>
          <Link
            href="/topics"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-tiktok-red bg-tiktok-red/10 px-4 text-xs font-black text-white transition hover:bg-tiktok-red"
          >
            Повторить
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {weakTopics.length > 0 ? (
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {weakTopics.map((item) => (
              <Link
                key={item.topic}
                href={`/learning/${encodeURIComponent(item.topic)}`}
                className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-white/[0.03] p-3 text-sm font-bold text-white transition hover:border-tiktok-cyan hover:bg-white/10"
              >
                <span>{item.topic}</span>
                <span className="rounded-md bg-tiktok-red px-2 py-1 text-xs font-black text-white">
                  {item.mistakes}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-md border border-white/10 bg-white/[0.03] p-3 text-sm leading-6 text-tiktok-muted">
            Слабые темы появятся после первых ошибок в тестах или экзамене.
          </p>
        )}
      </div>

      {progress.totalTestsCompleted === 0 && studiedCount === 0 ? (
        <div className="mt-5 rounded-lg border border-tiktok-cyan/30 bg-tiktok-cyan/10 p-4">
          <p className="text-sm font-black text-white">Пока нет результатов</p>
          <p className="mt-2 text-sm leading-6 text-tiktok-muted">
            Начните с конспекта или тематического теста. После первой попытки здесь
            появятся личные метрики и рекомендации.
          </p>
        </div>
      ) : null}

      {isResetConfirmOpen ? (
        <div className="fixed inset-0 z-40 grid place-items-center bg-tiktok-black/80 px-4 backdrop-blur">
          <div className="w-full max-w-md rounded-lg border border-white/10 bg-tiktok-panel p-5 shadow-neon">
            <div className="flex items-start justify-between gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-tiktok-red text-white">
                <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              </span>
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-md border border-white/10 text-white transition hover:bg-white/10"
                aria-label="Закрыть подтверждение"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <h3 className="mt-5 text-2xl font-black text-white">
              Сбросить прогресс?
            </h3>
            <p className="mt-3 text-sm leading-6 text-tiktok-muted">
              Будут очищены изученные темы, история тестов, лучший экзамен,
              слабые темы и последний результат. Это действие нельзя отменить.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/10 px-5 text-sm font-black text-white transition hover:bg-white/10"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={confirmResetProgress}
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-tiktok-red px-5 text-sm font-black text-white transition hover:bg-white hover:text-tiktok-black"
              >
                Да, сбросить
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

type ProgressStatCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  accent: "cyan" | "red";
};

function ProgressStatCard({
  title,
  value,
  icon: Icon,
  accent,
}: ProgressStatCardProps) {
  const isCyan = accent === "cyan";

  return (
    <article className="rounded-lg border border-white/10 bg-tiktok-black p-4">
      <div className="flex items-center justify-between gap-3">
        <span
          className={[
            "grid h-10 w-10 place-items-center rounded-lg",
            isCyan ? "bg-tiktok-cyan text-tiktok-black" : "bg-tiktok-red text-white",
          ].join(" ")}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="text-3xl font-black text-white">{value}</p>
      </div>
      <p className="mt-3 text-xs font-black uppercase text-tiktok-muted">{title}</p>
    </article>
  );
}
