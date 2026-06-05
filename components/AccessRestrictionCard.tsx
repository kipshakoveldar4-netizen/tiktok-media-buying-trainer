import Link from "next/link";
import { KeyRound, LockKeyhole } from "lucide-react";

type AccessRestrictionCardProps = {
  title?: string;
  description?: string;
  note?: string;
};

export function AccessRestrictionCard({
  title = "Доступно в полном режиме",
  description = "Сейчас открыт демо-режим: доступна ограниченная часть вопросов, обучения и AI-чата.",
  note = "Введите код доступа, чтобы открыть весь банк вопросов и все конспекты.",
}: AccessRestrictionCardProps) {
  return (
    <section className="rounded-lg border border-tiktok-red/35 bg-tiktok-panel p-5 shadow-red sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-tiktok-red text-white">
            <LockKeyhole className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-black uppercase text-tiktok-red">Демо-режим</p>
            <h2 className="mt-2 text-2xl font-black text-white">{title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-tiktok-muted">
              {description}
            </p>
            <p className="mt-2 max-w-2xl text-xs leading-5 text-tiktok-muted">
              {note}
            </p>
          </div>
        </div>

        <Link
          href="/access"
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-tiktok-cyan px-5 text-sm font-black text-tiktok-black transition hover:bg-white"
        >
          <KeyRound className="h-4 w-4" aria-hidden="true" />
          Открыть полный доступ
        </Link>
      </div>
    </section>
  );
}
