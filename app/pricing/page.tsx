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

const KASPI_PAYMENT_URL = "https://pay.kaspi.kz/pay/kywr0xv7";
const WHATSAPP_RECEIPT_URL =
  "https://wa.me/77475064295?text=Здравствуйте,%20я%20оплатил%20доступ%20к%20TikTok%20Media%20Buying%20Trainer.%20Отправляю%20чек.";

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

const fullAccessIncludes = [
  "120 вопросов",
  "обучение по 11 темам",
  "экзаменационный режим",
  "разбор ошибок",
  "AI-чат",
  "сохранение прогресса",
];

const paymentSteps = [
  'Нажмите "Оплатить через Kaspi"',
  'После оплаты нажмите "Отправить чек в WhatsApp"',
  "Отправьте чек",
  "Получите код полного доступа",
  'Введите код на странице "Доступ"',
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
            <a
              href={KASPI_PAYMENT_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-tiktok-cyan px-5 text-sm font-black text-tiktok-black transition hover:bg-white"
            >
              Оплатить через Kaspi
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
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
            Полный доступ — 9 900 ₸
          </h2>
          <p className="mt-4 text-sm leading-6 text-tiktok-muted">
            Оплата проходит через Kaspi. После оплаты отправьте чек в WhatsApp,
            и мы отправим вам код полного доступа.
          </p>
          <a
            href={KASPI_PAYMENT_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-tiktok-cyan px-5 text-sm font-black text-tiktok-black transition hover:bg-white"
          >
            <CreditCard className="h-4 w-4" aria-hidden="true" />
            Оплатить через Kaspi
          </a>
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
            <h2 className="text-2xl font-black text-white">
              Все для тренировки перед экзаменом
            </h2>
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
        <div className="space-y-5">
          <article className="rounded-lg border border-white/10 bg-tiktok-panel p-5 shadow-neon sm:p-7">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-tiktok-red text-white">
                <CreditCard className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-black uppercase text-tiktok-red">
                  Полный доступ
                </p>
                <h2 className="text-2xl font-black text-white">
                  Полный доступ — 9 900 ₸
                </h2>
              </div>
            </div>

            <h3 className="mt-6 text-sm font-black uppercase text-white">
              Что входит:
            </h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {fullAccessIncludes.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 rounded-lg border border-white/10 bg-tiktok-black p-3 text-sm font-bold text-white"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-tiktok-cyan" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={KASPI_PAYMENT_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-tiktok-cyan px-5 text-sm font-black text-tiktok-black transition hover:bg-white"
              >
                <CreditCard className="h-4 w-4" aria-hidden="true" />
                Оплатить через Kaspi
              </a>
              <a
                href={WHATSAPP_RECEIPT_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-tiktok-red bg-tiktok-red/10 px-5 text-sm font-black text-white transition hover:bg-tiktok-red"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Отправить чек в WhatsApp
              </a>
            </div>
          </article>

          <article className="rounded-lg border border-white/10 bg-tiktok-panel p-5 shadow-red sm:p-7">
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
          </article>
        </div>

        <aside
          id="payment"
          className="rounded-lg border border-tiktok-cyan/30 bg-tiktok-panel p-5 shadow-red lg:sticky lg:top-24 lg:h-fit"
        >
          <span className="grid h-12 w-12 place-items-center rounded-lg bg-tiktok-cyan text-tiktok-black">
            <MessageCircle className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="mt-5 text-xs font-black uppercase text-tiktok-cyan">
            Как получить код
          </p>
          <h2 className="mt-2 text-2xl font-black text-white">
            Оплата через Kaspi и чек в WhatsApp
          </h2>

          <ol className="mt-5 space-y-3">
            {paymentSteps.map((step, index) => (
              <li key={step} className="flex gap-3 text-sm leading-6 text-tiktok-muted">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-tiktok-black text-xs font-black text-tiktok-cyan">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          <div className="mt-6 grid gap-3">
            <a
              href={KASPI_PAYMENT_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-tiktok-cyan px-5 text-sm font-black text-tiktok-black transition hover:bg-white"
            >
              <CreditCard className="h-4 w-4" aria-hidden="true" />
              Оплатить через Kaspi
            </a>
            <a
              href={WHATSAPP_RECEIPT_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-tiktok-red bg-tiktok-red/10 px-5 text-sm font-black text-white transition hover:bg-tiktok-red"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Отправить чек в WhatsApp
            </a>
            <Link
              href="/access"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/10 px-5 text-sm font-black text-white transition hover:border-tiktok-cyan hover:bg-white/10"
            >
              <KeyRound className="h-4 w-4" aria-hidden="true" />
              Ввести код доступа
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
}
