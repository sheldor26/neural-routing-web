import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'NeuralRouting.io — Intelligent LLM Router & AI Gateway'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#050505',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          position: 'relative',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Radial glow */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(37,99,235,0.18) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Top border accent */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: '15%', right: '15%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #2563eb, transparent)',
            display: 'flex',
          }}
        />

        {/* Badge */}
        <div
          style={{
            background: 'rgba(37,99,235,0.1)',
            border: '1px solid rgba(37,99,235,0.35)',
            borderRadius: '100px',
            padding: '10px 24px',
            marginBottom: '36px',
            color: '#60a5fa',
            fontSize: '13px',
            fontWeight: '900',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            display: 'flex',
          }}
        >
          AI GATEWAY & LLM ROUTER
        </div>

        {/* Main title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '20px',
            marginBottom: '28px',
          }}
        >
          <span
            style={{
              color: 'white',
              fontSize: '88px',
              fontWeight: '900',
              lineHeight: 1,
              letterSpacing: '-0.03em',
              fontStyle: 'italic',
              textTransform: 'uppercase',
            }}
          >
            NEURAL
          </span>
          <span
            style={{
              color: '#2563eb',
              fontSize: '88px',
              fontWeight: '900',
              lineHeight: 1,
              letterSpacing: '-0.03em',
              fontStyle: 'italic',
              textTransform: 'uppercase',
            }}
          >
            ROUTING
          </span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            color: '#52525b',
            fontSize: '22px',
            fontWeight: '700',
            textAlign: 'center',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '56px',
            display: 'flex',
          }}
        >
          One API key. Every model. Auto-routed.
        </div>

        {/* Stats pills */}
        <div style={{ display: 'flex', gap: '16px' }}>
          {[
            { label: '80% cheaper', color: '#10b981' },
            { label: 'Zero downtime', color: '#60a5fa' },
            { label: 'OpenAI compatible', color: '#a78bfa' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '14px',
                padding: '14px 28px',
                color: stat.color,
                fontSize: '15px',
                fontWeight: '800',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                display: 'flex',
              }}
            >
              {stat.label}
            </div>
          ))}
        </div>

        {/* Domain */}
        <div
          style={{
            position: 'absolute',
            bottom: '36px',
            color: '#27272a',
            fontSize: '16px',
            fontWeight: '900',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            display: 'flex',
          }}
        >
          NEURALROUTING.IO
        </div>
      </div>
    ),
    { ...size }
  )
}
