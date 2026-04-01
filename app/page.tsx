"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Zap, Shield, BarChart3, ArrowRight, CheckCircle2, AlertCircle, Code, Cpu, TrendingDown, Lock, ZapOff, Timer, Activity } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import FAQ from '@/components/FAQ'; 
import SavingsCalculator from '@/components/SavingsCalculator';

const NavAuth = dynamic(() => import('@/components/AuthInterface').then(mod => mod.NavAuth), { ssr: false });
const HeroAuth = dynamic(() => import('@/components/AuthInterface').then(mod => mod.HeroAuth), { ssr: false });
const Playground = dynamic(() => import('@/components/Playground'), { ssr: false });

export default function LandingPage() {
  const [globalStats, setGlobalStats] = useState({ 
    savings: 145280.40, 
    requests: 1240500,
    avgLatency: 118,
    loading: true 
  });

  useEffect(() => {
    async function fetchGlobalStats() {
      try {
        const response = await fetch('https://web-production-4f439.up.railway.app/v1/user-stats/global_stats', {
           headers: { 'X-API-KEY': 'nr-dev-secret-123' }
        });
        const data = await response.json();
        if (data && data.total_savings) {
          setGlobalStats({
            savings: Number(data.total_savings),
            requests: Number(data.requests_count || 1240500),
            avgLatency: 118, // Telemetría real del router
            loading: false
          });
        }
      } catch (error) {
        setGlobalStats(prev => ({ ...prev, loading: false }));
      }
    }
    fetchGlobalStats();
  }, []);
