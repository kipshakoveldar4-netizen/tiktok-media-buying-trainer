import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, FileText } from "lucide-react";
import { knowledgeBase } from "@/data/knowledgeBase";
import { MarkStudiedButton } from "@/components/MarkStudiedButton";

export default function LearningPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-white/10 bg-tiktok-panel p-5 shadow-neon sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase text-tiktok-cyan">Обучение</p>
            <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
              Конспекты по темам сертификации
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-tiktok-muted">
              Изучите ключевые идеи, экзаменационные подсказки и типичные ошибки
              перед тематическим тестом или экзаменом.
            </p>
          </div>
          <Link
            href="/topics"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-tiktok-red px-5 text-sm font-black text-white transition hover:bg-white hover:text-tiktok-black"
          >
            К темам
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {knowledgeBase.map((topic) => (
          <article
            key={topic.title}
            className="flex min-h-64 flex-col rounded-lg border border-white/10 bg-tiktok-panel p-5 shadow-red"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-tiktok-cyan text-tiktok-black">
                <FileText className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-xs font-black uppercase text-tiktok-muted">
                Конспект
              </span>
            </div>

            <h2 className="mt-5 text-xl font-black leading-tight text-white">
              {topic.title}
            </h2>
            <p className="mt-3 flex-1 text-sm leading-6 text-tiktok-muted">
              {topic.shortSummary}
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase text-tiktok-muted">
              <CheckCircle2 className="h-4 w-4 text-tiktok-cyan" aria-hidden="true" />
              <span>{topic.keyPoints.length} ключевых пункта</span>
            </div>

            <div className="mt-5 grid gap-3">
              <Link
                href={`/learning/${encodeURIComponent(topic.title)}`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-tiktok-cyan bg-tiktok-cyan/10 px-4 text-sm font-black text-white transition hover:bg-tiktok-cyan hover:text-tiktok-black"
              >
                Изучить тему
                <BookOpen className="h-4 w-4" aria-hidden="true" />
              </Link>
              <MarkStudiedButton topic={topic.title} />
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
