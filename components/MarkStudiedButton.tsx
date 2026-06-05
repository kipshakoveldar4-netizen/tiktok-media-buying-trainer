"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";
import {
  markTopicAsStudied,
  readUserProgress,
  unmarkTopicAsStudied,
  USER_PROGRESS_EVENT,
} from "@/lib/progress";

type MarkStudiedButtonProps = {
  topic: string;
};

export function MarkStudiedButton({ topic }: MarkStudiedButtonProps) {
  const [isStudied, setIsStudied] = useState(false);

  useEffect(() => {
    function syncProgress() {
      setIsStudied(readUserProgress().studiedTopics.includes(topic));
    }

    syncProgress();
    window.addEventListener(USER_PROGRESS_EVENT, syncProgress);

    return () => {
      window.removeEventListener(USER_PROGRESS_EVENT, syncProgress);
    };
  }, [topic]);

  function toggleStudied() {
    if (isStudied) {
      unmarkTopicAsStudied(topic);
      return;
    }

    markTopicAsStudied(topic);
  }

  return (
    <button
      type="button"
      onClick={toggleStudied}
      className={[
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-5 text-sm font-black transition",
        isStudied
          ? "border border-white/10 bg-white/[0.04] text-white hover:border-tiktok-red hover:bg-tiktok-red"
          : "bg-tiktok-red text-white hover:bg-white hover:text-tiktok-black",
      ].join(" ")}
    >
      {isStudied ? (
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
      ) : (
        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
      )}
      {isStudied ? "Снять отметку" : "Отметить тему как изученную"}
    </button>
  );
}
