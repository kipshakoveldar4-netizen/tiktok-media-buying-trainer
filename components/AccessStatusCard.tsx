"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, KeyRound, LockKeyhole } from "lucide-react";
import {
  ACCESS_EVENT,
  DEMO_QUESTION_LIMIT,
  readAccessState,
} from "@/lib/access";
import type { AccessState } from "@/lib/access";

export function AccessStatusCard() {
  const [accessState, setAccessState] = useState<AccessState>(() => ({
    isFullAccess: false,
  }));
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    function syncAccessState() {
      setAccessState(readAccessState());
      setIsLoaded(true);
    }

    syncAccessState();
    window.addEventListener(ACCESS_EVENT, syncAccessState);
    window.addEventListener("storage", syncAccessState);

    return () => {
      window.removeEventListener(ACCESS_EVENT, syncAccessState);
      window.removeEventListener("storage", syncAccessState);
    };
  }, []);

  const isFullAccess = isLoaded && accessState.isFullAccess;

  return (
    <section className="rounded-lg border border-white/10 bg-tiktok-panel p-5 shadow-red sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-4">
          <span
            className={[
              "grid h-12 w-12 shrink-0 place-items-center rounded-lg",
              isFullAccess
                ? "bg-tiktok-cyan text-tiktok-black"
                : "bg-tiktok-red text-white",
            ].join(" ")}
          >
            {isFullAccess ? (
              <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
            ) : (
              <LockKeyhole className="h-6 w-6" aria-hidden="true" />
            )}
          </span>
          <div>
            <p className="text-xs font-black uppercase text-tiktok-cyan">
              Доступ к тренажеру
            </p>
            <h2 className="mt-2 text-2xl font-black text-white">
              {isFullAccess ? "Полный доступ открыт" : "Сейчас включен демо-режим"}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-tiktok-muted">
              {isFullAccess
                ? "Доступны все 120 вопросов, все конспекты и полный локальный AI-чат по базе знаний."
                : `В демо доступна выборка из ${DEMO_QUESTION_LIMIT} вопросов, несколько конспектов и ограниченный AI-чат.`}
            </p>
          </div>
        </div>

        {isFullAccess ? (
          <Link
            href="/topics"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-tiktok-cyan px-5 text-sm font-black text-tiktok-black transition hover:bg-white"
          >
            Перейти к темам
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        ) : (
          <Link
            href="/access"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-tiktok-cyan px-5 text-sm font-black text-tiktok-black transition hover:bg-white"
          >
            <KeyRound className="h-4 w-4" aria-hidden="true" />
            Открыть полный доступ
          </Link>
        )}
      </div>
    </section>
  );
}
