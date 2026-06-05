"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import {
  DEMO_QUESTION_LIMIT,
  readAccessState,
  unlockFullAccess,
} from "@/lib/access";

export default function AccessPage() {
  const [code, setCode] = useState("");
  const [isFullAccess, setIsFullAccess] = useState(false);
  const [error, setError] = useState("");
  const [isCodeVisible, setIsCodeVisible] = useState(false);

  useEffect(() => {
    setIsFullAccess(readAccessState().isFullAccess);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const isUnlocked = unlockFullAccess(code);

    if (!isUnlocked) {
      setError("Неверный код доступа");
      return;
    }

    setError("");
    setIsFullAccess(true);
    setCode("");
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-white/10 bg-tiktok-panel p-5 shadow-neon sm:p-7">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase text-tiktok-cyan">Доступ</p>
            <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
              Открыть полный доступ
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-tiktok-muted">
              По умолчанию приложение работает в демо-режиме. Введите код доступа,
              чтобы открыть все 120 вопросов, все конспекты и полный локальный AI-чат.
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-tiktok-black p-4">
            <p className="text-xs font-black uppercase text-tiktok-red">Демо-режим</p>
            <p className="mt-2 text-3xl font-black text-white">
              {DEMO_QUESTION_LIMIT}
            </p>
            <p className="mt-1 text-xs font-bold uppercase text-tiktok-muted">
              вопросов доступно без кода
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="rounded-lg border border-white/10 bg-tiktok-panel p-5 shadow-neon sm:p-6">
          {isFullAccess ? (
            <div>
              <span className="grid h-14 w-14 place-items-center rounded-lg bg-tiktok-cyan text-tiktok-black shadow-neon">
                <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
              </span>
              <p className="mt-5 text-xs font-black uppercase text-tiktok-cyan">
                Полный доступ открыт
              </p>
              <h2 className="mt-2 text-3xl font-black text-white">
                Можно тренироваться без ограничений
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-tiktok-muted">
                Состояние доступа сохранено в localStorage этого браузера. При
                следующем открытии приложения полный режим останется активным.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/topics"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-tiktok-cyan px-5 text-sm font-black text-tiktok-black transition hover:bg-white"
                >
                  Перейти к темам
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/learning"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-tiktok-red bg-tiktok-red/10 px-5 text-sm font-black text-white transition hover:bg-tiktok-red"
                >
                  Открыть обучение
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <span className="grid h-14 w-14 place-items-center rounded-lg bg-tiktok-red text-white shadow-red">
                <KeyRound className="h-7 w-7" aria-hidden="true" />
              </span>
              <p className="mt-5 text-xs font-black uppercase text-tiktok-cyan">
                Ввод кода
              </p>
              <h2 className="mt-2 text-3xl font-black text-white">
                Введите код доступа
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-tiktok-muted">
                Код проверяется локально, без базы данных и без отправки на сервер.
              </p>

              <label className="mt-6 block">
                <span className="text-xs font-black uppercase text-tiktok-muted">
                  Код доступа
                </span>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                  <input
                    type={isCodeVisible ? "text" : "password"}
                    value={code}
                    onChange={(event) => {
                      setCode(event.target.value);
                      setError("");
                    }}
                    placeholder="Введите код доступа"
                    className="min-h-12 flex-1 rounded-md border border-white/10 bg-tiktok-black px-4 text-sm font-black tracking-[0.08em] text-white outline-none transition placeholder:normal-case placeholder:tracking-normal placeholder:text-tiktok-muted focus:border-tiktok-cyan"
                  />
                  <button
                    type="button"
                    onClick={() => setIsCodeVisible((current) => !current)}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/10 px-4 text-sm font-black text-white transition hover:border-tiktok-cyan hover:bg-white/10"
                    aria-label={isCodeVisible ? "Скрыть код" : "Показать код"}
                  >
                    {isCodeVisible ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                    {isCodeVisible ? "Скрыть код" : "Показать код"}
                  </button>
                </div>
              </label>

              {error ? (
                <p className="mt-3 rounded-md border border-tiktok-red/30 bg-tiktok-red/10 p-3 text-sm font-bold text-white">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-tiktok-cyan px-5 text-sm font-black text-tiktok-black transition hover:bg-white sm:w-auto"
              >
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Открыть полный доступ
              </button>
            </form>
          )}
        </div>

        <aside className="rounded-lg border border-white/10 bg-tiktok-panel p-5 shadow-red lg:sticky lg:top-24 lg:h-fit">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-white text-tiktok-black">
              <LockKeyhole className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-sm font-black text-white">Что ограничено</h2>
              <p className="text-xs font-semibold text-tiktok-muted">
                До ввода кода
              </p>
            </div>
          </div>

          <ul className="mt-5 space-y-3">
            {[
              "Тесты используют только 20 демо-вопросов.",
              "Обучение показывает только часть конспектов.",
              "AI-чат отвечает только по ограниченному набору тем.",
              "Полный доступ открывает весь банк из 120 вопросов.",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-tiktok-muted">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-tiktok-cyan" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </div>
  );
}
