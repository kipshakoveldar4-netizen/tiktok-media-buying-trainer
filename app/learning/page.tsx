import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { knowledgeBase } from "@/data/knowledgeBase";
import { LearningTopicGrid } from "@/components/LearningTopicGrid";

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

      <LearningTopicGrid topics={knowledgeBase} />
    </div>
  );
}
