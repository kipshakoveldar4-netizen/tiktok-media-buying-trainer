import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  BookOpenCheck,
  GraduationCap,
  Home,
  KeyRound,
  MessageCircle,
  ShoppingCart,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Главная", icon: Home },
  { href: "/learning", label: "Обучение", icon: BookOpen },
  { href: "/chat", label: "AI-чат", icon: MessageCircle },
  { href: "/topics", label: "Темы", icon: BookOpenCheck },
  { href: "/exam", label: "Экзамен", icon: GraduationCap },
  { href: "/result", label: "Результат", icon: BarChart3 },
  { href: "/pricing", label: "Купить доступ", icon: ShoppingCart },
  { href: "/access", label: "Доступ", icon: KeyRound },
];

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-tiktok-black/88 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white text-base font-black text-tiktok-black shadow-neon">
            TT
          </span>
          <span>
            <span className="block text-sm font-black uppercase tracking-[0.14em] text-white">
              TikTok
            </span>
            <span className="block text-xs font-semibold text-tiktok-muted">
              Media Buying Trainer
            </span>
          </span>
        </Link>

        <nav className="grid grid-cols-8 gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-10 items-center justify-center gap-2 rounded-md px-2 text-xs font-bold text-white/78 transition hover:bg-white/10 hover:text-white sm:px-3 sm:text-sm"
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
