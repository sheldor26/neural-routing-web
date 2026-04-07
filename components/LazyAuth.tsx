"use client";
import dynamic from 'next/dynamic';

export const NavAuth = dynamic(
  () => import('./AuthInterface').then(m => ({ default: m.NavAuth })),
  { ssr: false }
);

export const HeroAuth = dynamic(
  () => import('./AuthInterface').then(m => ({ default: m.HeroAuth })),
  { ssr: false }
);
