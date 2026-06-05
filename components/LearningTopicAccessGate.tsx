"use client";

import { ReactNode, useEffect, useState } from "react";
import { AccessRestrictionCard } from "@/components/AccessRestrictionCard";
import {
  ACCESS_EVENT,
  isDemoLearningTopic,
  readAccessState,
} from "@/lib/access";

type LearningTopicAccessGateProps = {
  topic: string;
  children: ReactNode;
};

export function LearningTopicAccessGate({
  topic,
  children,
}: LearningTopicAccessGateProps) {
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

  if (isLoaded && !isFullAccess && !isDemoLearningTopic(topic)) {
    return (
      <AccessRestrictionCard
        title="Этот конспект закрыт в демо"
        description="В демо-режиме открыта только часть обучения. Введите код доступа, чтобы изучить эту тему полностью."
      />
    );
  }

  return <>{children}</>;
}
