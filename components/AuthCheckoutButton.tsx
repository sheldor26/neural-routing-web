"use client";
import { useUser } from '@clerk/nextjs';
import { ArrowRight } from 'lucide-react';

interface Props {
  slug: string;
  cta: string;
  highlight: boolean;
}

export function AuthCheckoutButton({ slug, cta, highlight }: Props) {
  const { user } = useUser();

  function checkoutUrl(): string {
    if (slug === "free") return "/sign-up";
    if (!user) return `/sign-in?redirect_url=/pricing`;
    const params = new URLSearchParams({ plan: slug, user_id: user.id });
    if (user.primaryEmailAddress?.emailAddress) {
      params.set("email", user.primaryEmailAddress.emailAddress);
    }
    return `/api/checkout?${params.toString()}`;
  }

  return (
    <a
      href={checkoutUrl()}
      className={`w-full py-5 rounded-2xl font-black uppercase italic text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
        highlight
          ? "bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-600/20 active:scale-95"
          : "bg-white text-black hover:bg-zinc-200 shadow-xl active:scale-95"
      }`}
    >
      {cta} <ArrowRight size={14} />
    </a>
  );
}
