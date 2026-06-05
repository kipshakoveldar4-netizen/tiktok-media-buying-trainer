import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpenCheck,
  CheckCircle2,
  Lightbulb,
  Target,
  TriangleAlert,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getKnowledgeTopic, knowledgeBase } from "@/data/knowledgeBase";

type LearningTopicPageProps = {
  params: Promise<{
    topic: string;
  }>;
};

export function generateStaticParams() {
  return knowledgeBase.map((topic) => ({
    topic: topic.title,
  }));
}

export default async function LearningTopicPage({ params }: LearningTopicPageProps) {
  const { topic: rawTopic } = await params;
  const topicTitle = decodeURIComponent(rawTopic);
  const topic = getKnowledgeTopic(topicTitle);

  if (!topic) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-white/10 bg-tiktok-panel p-5 shadow-neon sm:p-7">
        <Link
          href="/learning"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-white/10 px-4 text-sm font-bold text-white transition hover:border-tiktok-cyan hover:bg-tiktok-cyan hover:text-tiktok-black"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Обучение
        </Link>

        <p className="mt-6 text-xs font-black uppercase text-tiktok-cyan">
          Конспект темы
        </p>
        <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
          {topic.title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-tiktok-muted">
          {topic.shortSummary}
        </p>

        <Link
          href={`/test?topic=${encodeURIComponent(topic.title)}`}
          className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-tiktok-cyan px-5 text-sm font-black text-tiktok-black transition hover:bg-white"
        >
          Пройти тест по этой теме
          <BookOpenCheck className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <StudyCard
          title="Ключевые идеи"
          icon={CheckCircle2}
          accent="cyan"
          items={topic.keyPoints}
        />
        <StudyCard
          title="Подсказки для экзамена"
          icon={Lightbulb}
          accent="red"
          items={topic.examTips}
        />
        <StudyCard
          title="Типичные ошибки"
          icon={TriangleAlert}
          accent="red"
          items={topic.commonMistakes}
        />
        <StudyCard
          title="Фокус перед тестом"
          icon={Target}
          accent="cyan"
          items={[
            "Сравните ключевые идеи с вопросами по теме.",
            "Проверьте, понимаете ли вы назначение инструментов, а не только их названия.",
            "После конспекта сразу пройдите тематический тест и разберите ошибки.",
          ]}
        />
      </section>
    </div>
  );
}

type StudyCardProps = {
  title: string;
  icon: LucideIcon;
  accent: "cyan" | "red";
  items: string[];
};

function StudyCard({ title, icon: Icon, accent, items }: StudyCardProps) {
  const isCyan = accent === "cyan";

  return (
    <article className="rounded-lg border border-white/10 bg-tiktok-panel p-5 shadow-red">
      <div className="flex items-center gap-3">
        <span
          className={[
            "grid h-11 w-11 place-items-center rounded-lg",
            isCyan ? "bg-tiktok-cyan text-tiktok-black" : "bg-tiktok-red text-white",
          ].join(" ")}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <h2 className="text-xl font-black text-white">{title}</h2>
      </div>

      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-tiktok-muted">
            <span
              className={[
                "mt-2 h-2 w-2 shrink-0 rounded-full",
                isCyan ? "bg-tiktok-cyan" : "bg-tiktok-red",
              ].join(" ")}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
