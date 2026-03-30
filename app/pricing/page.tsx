import { Check, Zap, Rocket, Crown } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "$29",
      tokens: "1.5M",
      description: "Ideal for individual developers and side projects.",
      features: ["Standard Routing", "Email Support", "1.5M Tokens/mo", "Community Access"],
      icon: <Rocket className="text-blue-500" size={24} />,
      buttonText: "Get Started",
      highlight: false
    },
    {
      name: "Growth",
      price: "$89",
      tokens: "5M",
      description: "Perfect for scaling startups needing efficiency.",
      features: ["Priority Routing", "24/7 Chat Support", "5M Tokens/mo", "Advanced Analytics"],
      icon: <Zap className="text-yellow-500" size={24} />,
      buttonText: "Upgrade to Growth",
      highlight: true
    },
    {
      name: "Enterprise",
      price: "$249",
      tokens: "20M",
      description: "For high-volume companies with custom needs.",
      features: ["Custom Model Training", "Dedicated Manager", "20M Tokens/mo", "Unlimited API Keys"],
      icon: <Crown className="text-purple-500" size={24} />,
      buttonText: "Contact Sales",
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-white py-20 px-6">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs mb-4">NeuralRoute.io Pricing</h2>
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-6">
          Scale Intelligence <br/> <span className="text-zinc-500">Not Your Costs</span>
        </h1>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto italic">
          Choose the neural capacity that fits your business. Save up to 90% on API costs automatically.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <div 
            key={index}
            className={`relative p-8 rounded-[3rem] border ${plan.highlight ? 'border-blue-500 bg-blue-500/5' : 'border-zinc-800 bg-zinc-900/30'} flex flex-col`}
          >
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-black text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
                Most Popular
              </div>
            )}
            
            <div className="mb-8">
              <div className="p-4 bg-black/50 w-fit rounded-2xl border border-zinc-800 mb-6 italic">
                {plan.icon}
              </div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">{plan.name}</h3>
              <div className="flex items-end gap-1 mt-2">
                <span className="text-4xl font-black text-white">{plan.price}</span>
                <span className="text-zinc-500 font-bold mb-1">/mo</span>
              </div>
              <p className="text-blue-400 font-mono text-sm mt-2">{plan.tokens} Tokens included</p>
            </div>

            <div className="space-y-4 mb-10 flex-grow">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-zinc-400">
                  <Check size={14} className="text-green-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <Link href="/dashboard" className={`w-full py-4 rounded-2xl font-black uppercase tracking-tighter text-center transition-all active:scale-95 ${plan.highlight ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_30px_rgba(37,99,235,0.3)]' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'}`}>
              {plan.buttonText}
            </Link>
          </div>
        ))}
      </div>
      
      <p className="text-center text-zinc-600 text-xs mt-16 italic font-medium">
        All plans include 256-bit encryption and Virasoro-Node redundancy.
      </p>
    </div>
  );
}