import Link from "next/link";
import { ArrowRight, BookOpen, BookOpenCheck, Layers3 } from "lucide-react";
import { questions, topics } from "@/data/questions";

export default function TopicsPage() {
  const topicStats = topics.map((topic) => ({
    topic,
    count: questions.filter((question) => question.topic === topic).length,
  }));

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-white/10 bg-tiktok-panel p-5 shadow-neon sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase text-tiktok-cyan">Темы сертификации</p>
            <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
              Выберите раздел для тренировки
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-tiktok-muted">
              Каждый тематический тест берет вопросы только из выбранного блока.
              Для смешанной проверки запустите экзамен на 20 вопросов.
            </p>
          </div>
          <Link
            href="/exam"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-tiktok-red px-5 text-sm font-black text-white transition hover:bg-white hover:text-tiktok-black"
          >
            Экзамен
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topicStats.map(({ topic, count }) => (
          <article
            key={topic}
            className="flex min-h-52 flex-col rounded-lg border border-white/10 bg-tiktok-panel p-5 shadow-red"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-tiktok-cyan text-tiktok-black">
                <Layers3 className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-xs font-black uppercase text-tiktok-muted">
                {count} вопроса
              </span>
            </div>

            <h2 className="mt-5 text-xl font-black leading-tight text-white">{topic}</h2>
            <p className="mt-3 flex-1 text-sm leading-6 text-tiktok-muted">
              Проверьте базовые понятия, сценарии запуска и типовые решения для этого раздела.
            </p>

            <div className="mt-5 grid gap-3">
              <Link
                href={`/learning/${encodeURIComponent(topic)}`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-tiktok-cyan px-4 text-sm font-black text-tiktok-black transition hover:bg-white"
              >
                Изучить тему
                <BookOpen className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href={`/test?topic=${encodeURIComponent(topic)}`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-tiktok-cyan bg-tiktok-cyan/10 px-4 text-sm font-black text-white transition hover:bg-tiktok-cyan hover:text-tiktok-black"
              >
                Начать тест
                <BookOpenCheck className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
