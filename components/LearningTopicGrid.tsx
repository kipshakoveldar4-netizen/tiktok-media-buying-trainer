"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, CheckCircle2, FileText } from "lucide-react";
import type { KnowledgeTopic } from "@/data/knowledgeBase";
import { MarkStudiedButton } from "@/components/MarkStudiedButton";
import { AccessRestrictionCard } from "@/components/AccessRestrictionCard";
import {
  ACCESS_EVENT,
  DEMO_LEARNING_TOPICS,
  isDemoLearningTopic,
  readAccessState,
} from "@/lib/access";

type LearningTopicGridProps = {
  topics: KnowledgeTopic[];
};

export function LearningTopicGrid({ topics }: LearningTopicGridProps) {
  const [isFullAccess, setIsFullAccess] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    function syncAccessState() {
      setIsFullAccess(readAccessState().isFullAccess);
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

  const visibleTopics =
    isFullAccess || !isLoaded
      ? topics
      : topics.filter((topic) => isDemoLearningTopic(topic.title));

  return (
    <div className="space-y-4">
      {isLoaded && !isFullAccess ? (
        <AccessRestrictionCard
          title="Обучение ограничено"
          description={`В демо открыты ${DEMO_LEARNING_TOPICS.length} конспекта. Полный доступ откроет все темы обучения и тесты по полной базе.`}
          note="Можно изучить доступные темы сейчас или ввести код доступа."
        />
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleTopics.map((topic) => (
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
              <span>{topic.keyPoints.length} ключевых пунктов</span>
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
