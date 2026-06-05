import Link from "next/link";
import { ArrowRight, Home, SearchX } from "lucide-react";

export default function NotFoundPage() {
  return (
    <section className="rounded-lg border border-white/10 bg-tiktok-panel p-6 shadow-neon sm:p-8">
      <span className="grid h-14 w-14 place-items-center rounded-lg bg-tiktok-red text-white">
        <SearchX className="h-7 w-7" aria-hidden="true" />
      </span>
      <p className="mt-6 text-xs font-black uppercase text-tiktok-red">
        Страница не найдена
      </p>
      <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
        Такой раздел пока недоступен
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-tiktok-muted">
        Проверьте ссылку или вернитесь на главную. Все основные разделы доступны
        из верхней навигации.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-tiktok-cyan px-5 text-sm font-black text-tiktok-black transition hover:bg-white"
        >
          <Home className="h-4 w-4" aria-hidden="true" />
          На главную
        </Link>
        <Link
          href="/topics"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-tiktok-red bg-tiktok-red/10 px-5 text-sm font-black text-white transition hover:bg-tiktok-red"
        >
          К темам
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
