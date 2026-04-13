"use client";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CODE = `import OpenAI from "openai";

// Change one line. Save 80%.
const client = new OpenAI({
  baseURL: "https://neuralrouting.io/v1",
  apiKey: "nr_live_...",
});

const response = await client.chat.completions.create({
  model: "auto",  // NeuralRouting picks the best model
  messages: [{ role: "user", content: "..." }],
});`;

export default function CodeShowcase() {
  return (
    <div className="bg-black border border-zinc-800 rounded-3xl p-6 font-mono shadow-2xl relative">
      <div className="flex gap-1.5 mb-4">
        <div className="w-2 h-2 rounded-full bg-zinc-800" />
        <div className="w-2 h-2 rounded-full bg-zinc-800" />
        <div className="w-2 h-2 rounded-full bg-zinc-800" />
      </div>
      <SyntaxHighlighter
        language="javascript"
        style={vscDarkPlus}
        customStyle={{
          background: "transparent",
          padding: 0,
          margin: 0,
          fontSize: "11px",
          lineHeight: "1.6",
        }}
        codeTagProps={{ style: { fontFamily: "var(--font-geist-mono), monospace" } }}
      >
        {CODE}
      </SyntaxHighlighter>
    </div>
  );
}
