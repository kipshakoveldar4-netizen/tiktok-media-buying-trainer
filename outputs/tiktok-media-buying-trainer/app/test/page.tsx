import { QuizRunner } from "@/components/QuizRunner";

type TestPageProps = {
  searchParams: Promise<{
    topic?: string | string[];
  }>;
};

export default async function TestPage({ searchParams }: TestPageProps) {
  const params = await searchParams;
  const topic = Array.isArray(params.topic) ? params.topic[0] : params.topic;

  return <QuizRunner mode="topic" topic={topic} />;
}
