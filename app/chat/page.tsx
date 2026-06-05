"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BookOpenCheck,
  MessageCircle,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import { knowledgeBase } from "@/data/knowledgeBase";
import type { KnowledgeTopic } from "@/data/knowledgeBase";

type ChatMessage =
  | {
      id: number;
      role: "user";
      text: string;
    }
  | {
      id: number;
      role: "assistant";
      text?: string;
      answer?: ChatAnswer;
    };

type ChatAnswer = {
  topic: KnowledgeTopic;
  explanation: string;
  keyPoints: string[];
  examTip: string;
};

const fallbackText = "Эта тема пока не добавлена в базу знаний.";

const topicExplanations: Record<string, string> = {
  "TikTok Business Center":
    "Business Center нужен для управления ролями, доступами, партнерами и бизнес-активами: рекламными аккаунтами, пикселями, аудиториями и каталогами.",
  "Creative Center":
    "Creative Center помогает искать инструменты и инсайты для креативов: Top Ads, тренды, популярные форматы, звуки и идеи для creative refresh.",
  "Creative Codes":
    "Creative Codes описывают принципы TikTok-first creative: сильный хук, вертикальный формат, нативная подача, звук, captions и понятный CTA.",
  "Spark Ads":
    "Spark Ads позволяют продвигать органические посты бренда или автора, сохраняя нативный вид, социальный контекст и вовлеченность поста.",
  "Advertising Policy":
    "Advertising Policy объясняет, почему объявления могут отклоняться: вводящие в заблуждение claims, нерелевантный лендинг, запрещенные категории или проблемы с правами.",
  "Data Connections":
    "Pixel, Events API и App Events передают события для измерения, оптимизации, ремаркетинга и построения аудиторий.",
  "Campaign Setup":
    "Campaign Setup связывает бизнес-цель, objective, структуру кампании, бюджет, learning phase, событие оптимизации и pre-launch проверки.",
  "Targeting Strategy":
    "Targeting Strategy помогает выбрать broad, Custom, Lookalike, exclusions и Smart Targeting в зависимости от цели и качества сигналов.",
  "TikTok Ads Manager":
    "TikTok Ads Manager используется для создания и управления кампаниями, ad groups, ads, objective, placements, бюджетами и delivery-настройками.",
  "Bidding & Optimization":
    "Bidding & Optimization помогает выбрать стратегию ставок, событие оптимизации и баланс между объемом, CPA, learning phase и масштабированием.",
  "Reporting & Measurement":
    "Reporting & Measurement помогает анализировать CTR, CPA, CVR, ROAS, attribution windows, creative fatigue и качество событий после клика.",
};

const keywordRules = [
  {
    topic: "Spark Ads",
    keywords: [
      "spark",
      "спарк",
      "creator",
      "креатор",
      "автор",
      "органический пост",
      "органическ",
      "authorization code",
      "код авторизации",
      "пост автора",
    ],
  },
  {
    topic: "Advertising Policy",
    keywords: [
      "policy",
      "политик",
      "модерац",
      "отклон",
      "reject",
      "rejected",
      "ad review",
      "appeal",
      "claim",
      "claims",
      "лендинг",
      "landing",
      "запрещ",
      "наруш",
      "disclosure",
    ],
  },
  {
    topic: "TikTok Business Center",
    keywords: [
      "business center",
      "бизнес центр",
      "роли",
      "роль",
      "доступ",
      "права",
      "permission",
      "permissions",
      "партнер",
      "partner",
      "актив",
      "assets",
      "пользователь",
      "billing",
    ],
  },
  {
    topic: "Creative Center",
    keywords: [
      "creative center",
      "креатив центр",
      "top ads",
      "топ ads",
      "тренд",
      "trend",
      "commercial music",
      "music library",
      "creative tool",
      "video insights",
      "insights",
      "референс",
    ],
  },
  {
    topic: "Creative Codes",
    keywords: [
      "creative codes",
      "tiktok-first",
      "tik tok first",
      "хук",
      "hook",
      "captions",
      "субтитр",
      "cta",
      "creative fatigue",
      "усталость",
      "креативная усталость",
      "первые секунды",
      "натив",
    ],
  },
  {
    topic: "Bidding & Optimization",
    keywords: [
      "bidding",
      "bid",
      "ставк",
      "cost cap",
      "maximum delivery",
      "bid strategy",
      "стратегия ставок",
      "стратегию ставок",
      "optimization",
      "оптимизац",
      "learning",
      "обучен",
      "аукцион",
      "scale",
      "масштаб",
    ],
  },
  {
    topic: "Reporting & Measurement",
    keywords: [
      "report",
      "reporting",
      "measurement",
      "аналит",
      "измер",
      "ctr",
      "cvr",
      "roas",
      "cpm",
      "frequency",
      "атрибуц",
      "attribution",
      "результ",
      "метрик",
    ],
  },
  {
    topic: "Data Connections",
    keywords: [
      "pixel",
      "пиксель",
      "events api",
      "event api",
      "app events",
      "data connection",
      "event_id",
      "event id",
      "dedup",
      "дедуп",
      "событ",
      "purchase event",
      "measurement event",
    ],
  },
  {
    topic: "Campaign Setup",
    keywords: [
      "campaign setup",
      "настройка кампании",
      "objective",
      "цель кампании",
      "cbo",
      "campaign budget",
      "split test",
      "learning phase",
      "delivery",
      "плейсмент",
      "placements",
      "ad group",
      "группа объявлений",
    ],
  },
  {
    topic: "Targeting Strategy",
    keywords: [
      "targeting",
      "таргет",
      "аудитор",
      "custom audience",
      "lookalike",
      "ретаргет",
      "broad",
      "interest",
      "behavior",
      "exclusion",
      "исключ",
      "smart targeting",
    ],
  },
  {
    topic: "TikTok Ads Manager",
    keywords: [
      "ads manager",
      "эдс менеджер",
      "ad manager",
      "кампания",
      "объявление",
      "ad level",
      "ad account",
      "lead generation",
      "app promotion",
      "traffic",
      "reach",
    ],
  },
];

const sampleQuestions = [
  "Почему отклоняется реклама с лендингом?",
  "Когда использовать Spark Ads?",
  "Что делать при падении CTR?",
  "Как выбрать Cost Cap или Maximum Delivery?",
];

function normalizeText(value: string) {
  return value.toLowerCase().replaceAll("ё", "е");
}

function findTopicByQuestion(question: string) {
  const normalizedQuestion = normalizeText(question);
  const rule = keywordRules.find((item) =>
    item.keywords.some((keyword) => normalizedQuestion.includes(normalizeText(keyword))),
  );

  if (!rule) {
    return undefined;
  }

  return knowledgeBase.find((topic) => topic.title === rule.topic);
}

function buildAnswer(question: string): ChatAnswer | undefined {
  const topic = findTopicByQuestion(question);

  if (!topic) {
    return undefined;
  }

  return {
    topic,
    explanation: topicExplanations[topic.title] ?? topic.shortSummary,
    keyPoints: topic.keyPoints,
    examTip: topic.examTips[0] ?? "Свяжите ответ с задачей рекламодателя и ожидаемым бизнес-результатом.",
  };
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "assistant",
      text: "Задайте вопрос по TikTok Media Buying Certification. Я найду тему в локальной базе знаний и дам краткий ответ без подключения к OpenAI API.",
    },
  ]);
  const [input, setInput] = useState("");

  function sendQuestion(questionText: string) {
    const trimmedQuestion = questionText.trim();

    if (!trimmedQuestion) {
      return;
    }

    const answer = buildAnswer(trimmedQuestion);

    setMessages((currentMessages) => {
      const nextMessageId = currentMessages.length + 1;

      return [
        ...currentMessages,
        {
          id: nextMessageId,
          role: "user",
          text: trimmedQuestion,
        },
        answer
          ? {
              id: nextMessageId + 1,
              role: "assistant",
              answer,
            }
          : {
              id: nextMessageId + 1,
              role: "assistant",
              text: fallbackText,
            },
      ];
    });
    setInput("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendQuestion(input);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-white/10 bg-tiktok-panel p-5 shadow-neon sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase text-tiktok-cyan">AI-чат</p>
            <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
              Локальный помощник по базе знаний
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-tiktok-muted">
              Чат ищет подходящую тему по ключевым словам и отвечает из
              `data/knowledgeBase.ts`. Подключение к OpenAI API пока не используется.
            </p>
          </div>
          <Link
            href="/learning"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-tiktok-red px-5 text-sm font-black text-white transition hover:bg-white hover:text-tiktok-black"
          >
            Обучение
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="rounded-lg border border-white/10 bg-tiktok-panel p-4 shadow-neon sm:p-5">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-tiktok-cyan text-tiktok-black">
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-black text-white">Вопросы и ответы</h2>
              <p className="text-xs font-semibold text-tiktok-muted">
                Ответы строятся только по локальным конспектам.
              </p>
            </div>
          </div>

          <div className="mt-5 flex max-h-[58svh] min-h-[28rem] flex-col gap-4 overflow-y-auto pr-1">
            {messages.map((message) => (
              <article
                key={message.id}
                className={[
                  "rounded-lg border p-4",
                  message.role === "user"
                    ? "ml-auto max-w-[88%] border-tiktok-cyan/30 bg-tiktok-cyan/10"
                    : "mr-auto max-w-[96%] border-white/10 bg-tiktok-black",
                ].join(" ")}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={[
                      "grid h-8 w-8 place-items-center rounded-md",
                      message.role === "user"
                        ? "bg-tiktok-cyan text-tiktok-black"
                        : "bg-tiktok-red text-white",
                    ].join(" ")}
                  >
                    {message.role === "user" ? (
                      <User className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Bot className="h-4 w-4" aria-hidden="true" />
                    )}
                  </span>
                  <p className="text-xs font-black uppercase text-tiktok-muted">
                    {message.role === "user" ? "Вы" : "Тренер"}
                  </p>
                </div>

                {message.role === "assistant" && message.answer ? (
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="text-xs font-black uppercase text-tiktok-cyan">
                        {message.answer.topic.title}
                      </p>
                      <h3 className="mt-2 text-lg font-black text-white">
                        Краткое объяснение
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-tiktok-muted">
                        {message.answer.explanation}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-black uppercase text-white">
                        Ключевые пункты
                      </h3>
                      <ul className="mt-3 space-y-2">
                        {message.answer.keyPoints.map((point) => (
                          <li key={point} className="flex gap-3 text-sm leading-6 text-tiktok-muted">
                            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-tiktok-cyan" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-lg border border-tiktok-red/35 bg-tiktok-red/10 p-4">
                      <h3 className="flex items-center gap-2 text-sm font-black uppercase text-white">
                        <BookOpenCheck className="h-4 w-4 text-tiktok-red" aria-hidden="true" />
                        Совет для экзамена
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-tiktok-muted">
                        {message.answer.examTip}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 text-sm leading-6 text-white">{message.text}</p>
                )}
              </article>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Например: что делать при creative fatigue?"
              className="min-h-12 flex-1 rounded-md border border-white/10 bg-tiktok-black px-4 text-sm font-semibold text-white outline-none transition placeholder:text-tiktok-muted focus:border-tiktok-cyan"
            />
            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-tiktok-cyan px-5 text-sm font-black text-tiktok-black transition hover:bg-white"
            >
              Отправить
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </div>

        <aside className="rounded-lg border border-white/10 bg-tiktok-panel p-4 shadow-red lg:sticky lg:top-24 lg:h-fit">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-white text-tiktok-black">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-sm font-black text-white">Примеры вопросов</h2>
              <p className="text-xs font-semibold text-tiktok-muted">Нажмите, чтобы спросить</p>
            </div>
          </div>

          <div className="mt-5 grid gap-2">
            {sampleQuestions.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => sendQuestion(question)}
                className="rounded-md border border-white/10 bg-white/[0.03] p-3 text-left text-sm font-bold leading-5 text-white transition hover:border-tiktok-cyan hover:bg-tiktok-cyan hover:text-tiktok-black"
              >
                {question}
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-lg border border-white/10 bg-tiktok-black p-4">
            <p className="text-xs font-black uppercase text-tiktok-red">Без API</p>
            <p className="mt-2 text-xs leading-5 text-tiktok-muted">
              Это rule-based чат: он не генерирует новые знания, а выбирает тему из
              локальной базы и показывает готовые конспекты.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
