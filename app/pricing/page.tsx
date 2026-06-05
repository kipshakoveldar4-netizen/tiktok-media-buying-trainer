import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  GraduationCap,
  KeyRound,
  MessageCircle,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

const insideItems = [
  {
    title: "Обучение по 11 темам",
    description: "Короткие конспекты по ключевым блокам TikTok Media Buying.",
    icon: BookOpenCheck,
  },
  {
    title: "120 вопросов",
    description: "Ситуационные вопросы, инструменты, политики, аналитика и креативы.",
    icon: ClipboardCheck,
  },
  {
    title: "Экзаменационный режим",
    description: "20 смешанных вопросов для проверки готовности.",
    icon: GraduationCap,
  },
  {
    title: "Разбор ошибок",
    description: "Правильные ответы, объяснения и темы для повторения.",
    icon: Target,
  },
  {
    title: "AI-чат по базе знаний",
    description: "Локальный помощник отвечает по конспектам без внешнего API.",
    icon: Bot,
  },
  {
    title: "Сохранение прогресса",
    description: "Изученные темы, результаты и слабые места сохраняются в браузере.",
    icon: CheckCircle2,
  },
];

const audienceItems = [
  "Таргетологам",
  "SMM-специалистам",
  "Владельцам агентств",
  "Начинающим TikTok Ads специалистам",
];

export default function PricingPage() {
  return (
    <div className="space-y-7">
      <section className="grid gap-6 rounded-lg border border-white/10 bg-tiktok-panel p-5 shadow-neon sm:p-7 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-md border border-tiktok-cyan/30 bg-tiktok-cyan/10 px-3 py-2 text-xs font-black uppercase text-tiktok-cyan">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Полный доступ
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight text-white sm:text-5xl">
            Подготовься к TikTok Media Buying Certification быстрее
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-tiktok-muted sm:text-lg">
            Тренажёр для таргетологов, SMM-специалистов и медиабайеров: обучение,
            120 вопросов, экзамен, разбор ошибок, AI-чат и прогресс.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#payment"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-tiktok-cyan px-5 text-sm font-black text-tiktok-black transition hover:bg-white"
            >
              Получить доступ
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/topics"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-tiktok-red bg-tiktok-red/10 px-5 text-sm font-black text-white transition hover:bg-tiktok-red"
            >
              Попробовать демо
            </Link>
            <Link
              href="/access"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/10 px-5 text-sm font-black text-white transition hover:border-tiktok-cyan hover:bg-white/10"
            >
              <KeyRound className="h-4 w-4" aria-hidden="true" />
              Ввести код
            </Link>
          </div>
        </div>

        <aside className="rounded-lg border border-white/10 bg-tiktok-black p-5">
          <p className="text-xs font-black uppercase text-tiktok-red">Цена</p>
          <h2 className="mt-3 text-3xl font-black text-white">
            Полный доступ
          </h2>
          <p className="mt-4 text-5xl font-black leading-none text-tiktok-cyan">
            9 900 ₸
          </p>
          <p className="mt-4 text-sm leading-6 text-tiktok-muted">
            После оплаты вы получаете код, который открывает весь тренажёр в этом браузере.
          </p>
        </aside>
      </section>

      <section className="rounded-lg border border-white/10 bg-tiktok-panel p-5 shadow-red sm:p-7">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-tiktok-cyan text-tiktok-black">
            <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-black uppercase text-tiktok-cyan">
              Что внутри
            </p>
            <h2 className="text-2xl font-black text-white">Все для тренировки перед экзаменом</h2>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {insideItems.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="rounded-lg border border-white/10 bg-tiktok-black p-4"
              >
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-white text-tiktok-black">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-black text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-tiktok-muted">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="rounded-lg border border-white/10 bg-tiktok-panel p-5 shadow-neon sm:p-7">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-tiktok-red text-white">
              <Users className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-black uppercase text-tiktok-red">
                Кому подходит
              </p>
              <h2 className="text-2xl font-black text-white">
                Для специалистов, которые работают с рекламой
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {audienceItems.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-tiktok-black p-4"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-tiktok-cyan" aria-hidden="true" />
                <span className="text-sm font-black text-white">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <aside
          id="payment"
          className="rounded-lg border border-tiktok-cyan/30 bg-tiktok-panel p-5 shadow-red lg:sticky lg:top-24 lg:h-fit"
        >
          <span className="grid h-12 w-12 place-items-center rounded-lg bg-tiktok-cyan text-tiktok-black">
            <CreditCard className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="mt-5 text-xs font-black uppercase text-tiktok-cyan">
            Инструкция оплаты
          </p>
          <h2 className="mt-2 text-2xl font-black text-white">
            Оплата через Kaspi
          </h2>
          <p className="mt-3 text-sm leading-6 text-tiktok-muted">
            После оплаты напишите в WhatsApp и получите код доступа. Онлайн-оплата
            на сайте пока не подключена.
          </p>

          <div className="mt-5 grid gap-3">
            <Link
              href="#payment"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-tiktok-cyan px-5 text-sm font-black text-tiktok-black transition hover:bg-white"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Получить доступ
            </Link>
            <Link
              href="/access"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-tiktok-red bg-tiktok-red/10 px-5 text-sm font-black text-white transition hover:bg-tiktok-red"
            >
              <KeyRound className="h-4 w-4" aria-hidden="true" />
              Ввести код
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
}
