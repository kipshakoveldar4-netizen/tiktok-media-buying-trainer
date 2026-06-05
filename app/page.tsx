import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { questions, topics } from "@/data/questions";

const features = [
  {
    title: "Тематические тесты",
    description: "Короткая практика по Business Center, Ads Manager, Spark Ads, политике и оптимизации.",
    icon: BookOpenCheck,
  },
  {
    title: "Экзамен на 20 вопросов",
    description: "Смешанный режим с вопросами из разных разделов для проверки готовности.",
    icon: GraduationCap,
  },
  {
    title: "Разбор ответов",
    description: "Процент результата, правильные варианты и объяснение по каждому вопросу.",
    icon: BarChart3,
  },
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="grid min-h-[calc(100svh-9rem)] items-center gap-7 py-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-md border border-tiktok-cyan/30 bg-tiktok-cyan/10 px-3 py-2 text-xs font-black uppercase text-tiktok-cyan">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            MVP без AI-чата
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-none text-white sm:text-5xl lg:text-6xl">
            TikTok Media Buying Trainer
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-tiktok-muted sm:text-lg">
            Тренажер для подготовки к TikTok Media Buying Certification:
            выбирайте тему, проходите тесты, запускайте экзаменационный режим и
            разбирайте ошибки сразу после результата.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/topics"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-tiktok-cyan px-5 text-sm font-black text-tiktok-black transition hover:bg-white"
            >
              Выбрать тему
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/exam"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-tiktok-red bg-tiktok-red/10 px-5 text-sm font-black text-white transition hover:bg-tiktok-red"
            >
              Экзамен
              <GraduationCap className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-tiktok-panel p-4 shadow-neon">
          <div className="noise-panel rounded-lg border border-white/10 bg-tiktok-black p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase text-tiktok-cyan">Training snapshot</p>
                <h2 className="mt-2 text-2xl font-black text-white">
                  {questions.length} демо-вопросов
                </h2>
              </div>
              <span className="grid h-12 w-12 place-items-center rounded-lg bg-white text-lg font-black text-tiktok-black">
                TT
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <p className="text-3xl font-black text-tiktok-cyan">{topics.length}</p>
                <p className="mt-1 text-xs font-bold uppercase text-tiktok-muted">Тем</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <p className="text-3xl font-black text-tiktok-red">20</p>
                <p className="mt-1 text-xs font-bold uppercase text-tiktok-muted">В экзамене</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {["Campaign Setup", "Spark Ads", "Data Connections"].map((label, index) => (
                <div key={label} className="flex items-center gap-3 rounded-lg bg-white/[0.04] p-3">
                  <CheckCircle2
                    className={index === 1 ? "h-5 w-5 text-tiktok-red" : "h-5 w-5 text-tiktok-cyan"}
                    aria-hidden="true"
                  />
                  <span className="text-sm font-bold text-white">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <article key={feature.title} className="rounded-lg border border-white/10 bg-tiktok-panel p-5 shadow-red">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-white text-tiktok-black">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-lg font-black text-white">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-tiktok-muted">{feature.description}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
