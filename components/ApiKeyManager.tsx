import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function ApiKeyManager() {
  const { user } = useUser();
  const [apiKey, setApiKey] = useState<any>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (user) {
      supabase.from('api_keys')
        .select('key_plain, key_preview')
        .eq('user_id', user.id)
        .single()
        .then(({ data }) => setApiKey(data));
    }
  }, [user]);

  if (!apiKey) return <div className="animate-pulse bg-gray-800 h-20 rounded-xl"></div>;

  return (
    <div className="p-6 bg-[#0a0a0a] border border-gray-800 rounded-2xl shadow-xl">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Your API Key</h3>
      <div className="mt-4 flex items-center justify-between bg-gray-900/50 p-4 rounded-lg border border-gray-800">
        <code className="text-blue-400 font-mono">
          {show ? apiKey.key_plain : apiKey.key_preview}
        </code>
        <div className="flex gap-2">
          <button onClick={() => setShow(!show)} className="p-2 hover:bg-gray-800 rounded-md transition">
            {show ? '👁️‍🗨️' : '👁️'}
          </button>
          <button 
            onClick={() => navigator.clipboard.writeText(apiKey.key_plain)}
            className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition"
          >
            Copy
          </button>
        </div>
      </div>
      <p className="mt-2 text-[10px] text-gray-600">
        Use this key in the <code className="text-gray-400">X-API-KEY</code> header to route through NeuralRouting.
      </p>
    </div>
  );
}