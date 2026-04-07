"use client";
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const Playground = dynamic(() => import('./Playground'), {
  ssr: false,
  loading: () => (
    <div className="max-w-5xl mx-auto px-6 py-20 flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-500" size={24} />
    </div>
  ),
});

export default Playground;
