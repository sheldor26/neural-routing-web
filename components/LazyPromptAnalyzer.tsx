"use client";
import dynamic from 'next/dynamic';

const PromptAnalyzer = dynamic(() => import('./PromptAnalyzer'), { ssr: false });
export default PromptAnalyzer;
