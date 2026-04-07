"use client";
import dynamic from 'next/dynamic';

const SavingsCalculator = dynamic(() => import('./SavingsCalculator'), { ssr: false });
export default SavingsCalculator;
