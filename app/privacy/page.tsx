import React from 'react';
import Link from 'next/link';
import { ShieldCheck, EyeOff, Database, Lock, Server, Mail, UserCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="max-w-4xl mx-auto py-20 px-6 text-slate-400 leading-relaxed font-sans">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="bg-emerald-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
            <ShieldCheck size={32} className="text-emerald-500" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight uppercase">Privacy Policy</h1>
          <p className="text-slate-500 italic">Effective Date: April 3, 2026</p>
        </div>

        <div className="space-y-12">

          {/* 1. ZERO TRAINING GUARANTEE */}
          <section className="bg-emerald-900/10 border border-emerald-500/20 p-8 rounded-3xl">
            <h2 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2 uppercase">
              <EyeOff size={20} /> 1. Zero-Training Guarantee
            </h2>
            <p className="text-sm font-medium leading-relaxed">
              NeuralRouting <strong>does not</strong> use your prompt data, completion data, or any proprietary information to train, fine-tune, or improve our routing algorithms or any third-party AI models.
              <br /><br />
              We act solely as a secure pass-through layer. Your intellectual property remains exclusively yours.
            </p>
          </section>

          {/* 2. Data Collection */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Database size={20} className="text-emerald-500" /> 2. Information We Collect
            </h2>
            <p className="mb-4">We collect only the minimum data required to provide a functional and secure service:</p>
            <ul className="list-disc pl-5 space-y-3">
              <li><strong>Authentication Data:</strong> Email and identity verified via Clerk.</li>
              <li><strong>Billing Data:</strong> Transactions are processed by Stripe. We do not store full credit card numbers on our servers.</li>
              <li><strong>Metadata:</strong> We store timestamps, token counts, cost metrics, and model names to populate your Dashboard and ensure accurate billing.</li>
            </ul>
          </section>

          {/* 3. Data Processing & Third Parties */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Server size={20} className="text-emerald-500" /> 3. Processing &amp; Third-Party Sharing
            </h2>
            <p className="mb-4">
              To fulfill your requests, NeuralRouting must transmit prompt data to the AI provider selected by our optimization engine (e.g., OpenAI, Anthropic, Google).
            </p>
            <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 border-l-4 border-l-emerald-500">
              <p className="text-sm">
                <strong>Disclaimer:</strong> By using our service, you agree to the privacy policies of the underlying AI providers. NeuralRouting is not responsible for how these third parties process data once it has been transmitted to them.
              </p>
            </div>
          </section>

          {/* 4. Security Measures */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Lock size={20} className="text-emerald-500" /> 4. Data Security
            </h2>
            <p className="mb-4">
              We employ industry-standard technical measures to protect your information:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li><strong>Encryption:</strong> All data is encrypted in transit via TLS 1.2+ and at rest using AES-256.</li>
              <li><strong>API Key Isolation:</strong> Your API keys are hashed and stored in secure, isolated environments.</li>
              <li><strong>No Body Logging:</strong> By default, we do <strong>not</strong> log the bodies of your prompts or responses unless you explicitly enable &quot;Debug Mode&quot; for troubleshooting.</li>
            </ul>
          </section>

          {/* 5. User Rights */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <UserCheck size={20} className="text-emerald-500" /> 5. Your Rights &amp; Deletion
            </h2>
            <p>
              You may request the deletion of your account and all associated metadata at any time. Upon request, NeuralRouting will purge your record from our active databases within 30 days.
            </p>
          </section>

          {/* 6. Contact */}
          <div className="pt-12 border-t border-slate-800 text-center">
            <p className="mb-6 flex items-center justify-center gap-2">
              <Mail size={18} /> For privacy-related inquiries, contact:
            </p>
            <Link href="mailto:privacy@neuralrouting.io" className="text-emerald-500 font-black hover:text-emerald-400 transition-colors underline underline-offset-4">
              privacy@neuralrouting.io
            </Link>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className="inline-block bg-white text-black px-8 py-3 rounded-full font-black hover:bg-slate-200 transition-all shadow-xl shadow-white/5">
                Back to Home
              </Link>
              <Link href="/terms" className="inline-block border border-slate-700 text-slate-300 px-8 py-3 rounded-full font-black hover:border-emerald-500 hover:text-white transition-all">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
