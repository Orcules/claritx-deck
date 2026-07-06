import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';

import logoWhitePng from './assets/logo-white.png';
import logoBlackPng from './assets/logo-black.png';
import orPhoto from './assets/or.jpg';
import guyPhoto from './assets/guy.jpg';
import shalomPhoto from './assets/shalom.jpg';

import bananaCover from './assets/banana/cover.jpg';
import bananaNoise from './assets/banana/noise.jpg';
import bananaMagnifi from './assets/banana/magnifi.jpg';
import bananaPhilosophy from './assets/banana/philosophy.jpg';
import bananaStack from './assets/banana/stack-layers.jpg';
import bananaAIGrounding from './assets/banana/ai-grounding.jpg';

// ============================================================================
// DESIGN SYSTEM
// ============================================================================

export const design: DesignSystem = {
  palette: { bg: '#0a1020', text: '#f4f6fb', accent: '#33cc7a' },
  fonts: {
    display: '"Space Grotesk", system-ui, -apple-system, sans-serif',
    body: '"Inter", system-ui, -apple-system, sans-serif',
  },
  typeScale: { hero: 112, body: 24 },
  radius: 8,
};

const C = {
  bg: '#0a1020',
  surface: '#101830',
  surfaceAlt: '#0d1426',
  rule: '#1f2a44',
  ruleSoft: '#172037',
  text: '#f4f6fb',
  muted: '#9aa8c4',
  dim: '#5e6e8e',
  green: '#33cc7a',
  greenDim: '#1f7a48',
  red: '#e03535',
  amber: '#e6a23c',
  cyan: '#5fb3d4',
};

const TOTAL = 24;

// ============================================================================
// MODULE SIDE EFFECTS
// ============================================================================

if (typeof document !== 'undefined' && !document.querySelector('link[data-osd-fonts="claritx-v5"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href =
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap';
  link.setAttribute('data-osd-fonts', 'claritx-v5');
  document.head.appendChild(link);
}

if (typeof document !== 'undefined' && !document.querySelector('style[data-osd-anim="claritx-v5"]')) {
  const style = document.createElement('style');
  style.setAttribute('data-osd-anim', 'claritx-v5');
  style.textContent = `
    @keyframes osd-cx-rise {
      0% { opacity: 0; transform: translateY(8px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes osd-cx-pulse-dot {
      0%, 100% { opacity: 0.6; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.18); }
    }
    @keyframes osd-cx-sweep {
      0% { transform: translateX(-30%); opacity: 0; }
      40% { opacity: 1; }
      100% { transform: translateX(0); opacity: 1; }
    }
    @keyframes osd-cx-tick {
      0%, 100% { opacity: 0.35; }
      50% { opacity: 0.85; }
    }
    @media (prefers-reduced-motion: reduce) {
      [data-cx-anim] { animation: none !important; opacity: 1 !important; transform: none !important; }
    }
  `;
  document.head.appendChild(style);
}

// ============================================================================
// SHARED PRIMITIVES
// ============================================================================

const fill: React.CSSProperties = {
  width: '100%',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  background: 'var(--osd-bg)',
  color: 'var(--osd-text)',
  fontFamily: 'var(--osd-font-body)',
};

const rise = (delayMs: number): React.CSSProperties => ({
  animation: `osd-cx-rise 360ms ease-out ${delayMs}ms both`,
});

const Eyebrow = ({
  children,
  section,
  delay = 0,
}: {
  children: React.ReactNode;
  section?: string;
  delay?: number;
}) => (
  <div data-cx-anim style={{ display: 'flex', alignItems: 'center', gap: 14, ...rise(delay) }}>
    <span aria-hidden style={{ width: 8, height: 8, borderRadius: '50%', background: C.green }} />
    <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: C.muted }}>
      {children}
    </span>
    {section && (
      <>
        <span style={{ flex: 1, height: 1, background: C.ruleSoft, marginLeft: 8 }} />
        <span
          style={{
            fontSize: 13,
            color: C.dim,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {section}
        </span>
      </>
    )}
  </div>
);

const Heading = ({
  children,
  size = 56,
  delay = 80,
  maxWidth = 1620,
}: {
  children: React.ReactNode;
  size?: number;
  delay?: number;
  maxWidth?: number;
}) => (
  <h2
    data-cx-anim
    style={{
      fontFamily: 'var(--osd-font-display)',
      fontSize: size,
      fontWeight: 600,
      lineHeight: 1.1,
      margin: '24px 0 0',
      color: C.text,
      letterSpacing: '-0.018em',
      maxWidth,
      ...rise(delay),
    }}
  >
    {children}
  </h2>
);

const Lede = ({ children, delay = 160, maxWidth = 1500 }: { children: React.ReactNode; delay?: number; maxWidth?: number }) => (
  <p
    data-cx-anim
    style={{
      fontSize: 24,
      lineHeight: 1.55,
      color: C.muted,
      maxWidth,
      margin: '24px 0 0',
      fontWeight: 400,
      ...rise(delay),
    }}
  >
    {children}
  </p>
);

const GreenAccent = ({ children }: { children: React.ReactNode }) => (
  <span style={{ color: C.green, fontWeight: 600 }}>{children}</span>
);

// ----------------------------------------------------------------------------
// Brand: inline-SVG logo + recurring up-arrow motif
// ----------------------------------------------------------------------------

// Uses the real ClaritX logo PNG asset, cropped via background-image to remove
// the heavy transparent padding in the source file.
// Source canvas: 1595×1920 · glyph bbox: roughly (130, 280) → (720, 540).
const ClaritXLogo = ({
  height = 56,
  variant = 'light',
  style,
}: {
  height?: number;
  variant?: 'light' | 'dark';
  style?: React.CSSProperties;
}) => {
  const src = variant === 'light' ? logoWhitePng : logoBlackPng;
  // Glyph bounding box inside the source image (px in original coordinates).
  // Measured by alpha-scanning the source PNG, heavy transparent padding
  // around a center-positioned glyph in the 1595×1920 canvas.
  const G = { x: 222, y: 546, w: 1228, h: 464 };
  const IMG = { w: 1595, h: 1920 };
  const s = height / G.h;
  const widthOut = G.w * s;
  return (
    <div
      aria-label="ClaritX"
      style={{
        display: 'inline-block',
        width: widthOut,
        height,
        backgroundImage: `url(${src})`,
        backgroundSize: `${IMG.w * s}px ${IMG.h * s}px`,
        backgroundPosition: `${-G.x * s}px ${-G.y * s}px`,
        backgroundRepeat: 'no-repeat',
        ...style,
      }}
    />
  );
};

// Reusable green up-arrow used as a brand motif throughout the deck.
// Mirrors the X-mark's "growth" stroke at a smaller scale.
const UpArrow = ({ size = 18, color = C.green, style }: { size?: number; color?: string; style?: React.CSSProperties }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    aria-hidden
  >
    <line x1="4" y1="20" x2="19" y2="5" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
    <polygon points="19, 5 13, 5 19, 11" fill={color} />
  </svg>
);

// "Verdict mark", the corner stamp that appears on every slide as a subtle
// brand heartbeat. A 1px green hairline + a slow-pulsing dot. The single
// "cool minimalist element" Or asked for, used consistently across the deck.
const VerdictMark = ({ position = 'tr' }: { position?: 'tr' | 'tl' }) => {
  const pos: React.CSSProperties =
    position === 'tr'
      ? { right: 80, top: 88 }
      : { left: 80, top: 88 };
  return (
    <div
      style={{
        position: 'absolute',
        ...pos,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        pointerEvents: 'none',
      }}
      aria-hidden
    >
      <span style={{ width: 48, height: 1, background: C.ruleSoft }} />
      <span style={{ fontSize: 10, letterSpacing: '0.32em', color: C.dim, fontWeight: 700, textTransform: 'uppercase' }}>
        Verdict
      </span>
      <span
        data-cx-anim
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: C.green,
          animation: 'osd-cx-pulse-dot 2.4s ease-in-out infinite',
        }}
      />
    </div>
  );
};

const Card = ({
  children,
  style,
  accent,
  delay = 0,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  accent?: string;
  delay?: number;
}) => (
  <div
    data-cx-anim
    style={{
      background: C.surface,
      border: `1px solid ${C.rule}`,
      borderRadius: 8,
      borderLeft: accent ? `3px solid ${accent}` : `1px solid ${C.rule}`,
      padding: 24,
      ...rise(delay),
      ...style,
    }}
  >
    {children}
  </div>
);

const Sources = ({ items, delay = 500 }: { items: string[]; delay?: number }) => (
  <div
    data-cx-anim
    style={{
      marginTop: 28,
      paddingTop: 14,
      borderTop: `1px solid ${C.ruleSoft}`,
      fontSize: 12,
      color: C.dim,
      lineHeight: 1.6,
      letterSpacing: '0.02em',
      maxWidth: 1600,
      ...rise(delay),
    }}
  >
    {items.map((src, i) => (
      <span key={i}>
        <sup style={{ fontSize: 9, marginRight: 4, fontWeight: 700, color: C.muted }}>{i + 1}</sup>
        {src}
        {i < items.length - 1 && <span style={{ margin: '0 10px', color: C.ruleSoft }}>·</span>}
      </span>
    ))}
  </div>
);

const Watermark = () => (
  <div
    style={{
      position: 'absolute',
      left: 80,
      bottom: 36,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      fontSize: 12,
      letterSpacing: '0.24em',
      color: C.dim,
      textTransform: 'uppercase',
    }}
  >
    <ClaritXLogo height={22} variant="light" style={{ opacity: 0.85 }} />
    <span style={{ width: 1, height: 14, background: C.ruleSoft }} />
    <span>Vision brief · 2026</span>
  </div>
);

const PageNum = ({ n }: { n: number }) => (
  <div
    style={{
      position: 'absolute',
      right: 80,
      bottom: 36,
      fontSize: 12,
      letterSpacing: '0.24em',
      color: C.dim,
      fontVariantNumeric: 'tabular-nums',
    }}
  >
    {String(n).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
  </div>
);

// ============================================================================
// PAGE 1, COVER (Banana hero)
// ============================================================================

const Cover: Page = () => (
  <div style={fill}>
    <img
      src={bananaCover}
      alt=""
      aria-hidden
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
    />
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(90deg, rgba(10, 16, 32, 0.0) 0%, rgba(10, 16, 32, 0.5) 45%, rgba(10, 16, 32, 0.92) 100%)',
      }}
    />

    <div data-cx-anim style={{ position: 'absolute', left: 96, top: 88, ...rise(0) }}>
      <ClaritXLogo height={64} variant="light" />
    </div>

    {/* Live tag, sits directly under the logo as a brand header */}
    <div
      data-cx-anim
      aria-hidden
      style={{
        position: 'absolute',
        left: 96,
        top: 170,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        ...rise(120),
      }}
    >
      <span
        data-cx-anim
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: C.green,
          animation: 'osd-cx-pulse-dot 2.4s ease-in-out infinite',
          boxShadow: '0 0 0 4px rgba(51, 204, 122, 0.15)',
        }}
      />
      <span style={{ fontSize: 11, letterSpacing: '0.32em', color: C.green, fontWeight: 700, textTransform: 'uppercase' }}>
        Live · claritx.ai
      </span>
    </div>

    <div
      style={{
        position: 'absolute',
        right: 96,
        top: 0,
        bottom: 0,
        width: 980,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div
        data-cx-anim
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: C.muted,
          marginBottom: 20,
          ...rise(120),
        }}
      >
        <span style={{ width: 28, height: 1, background: C.green }} />
        <span>2026 · Vision Brief</span>
      </div>
      <div
        data-cx-anim
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 24,
          fontWeight: 500,
          fontStyle: 'italic',
          color: C.muted,
          letterSpacing: '-0.01em',
          marginBottom: 18,
          ...rise(170),
        }}
      >
        Clarity before <span style={{ color: C.green, fontStyle: 'normal', fontWeight: 600 }}>you invest.</span>
      </div>

      <h1
        data-cx-anim
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 104,
          fontWeight: 600,
          lineHeight: 1.04,
          margin: 0,
          letterSpacing: '-0.028em',
          ...rise(220),
        }}
      >
        The retail investor's
        <br />
        <span
          style={{
            color: C.green,
          }}
        >
          clarity layer.
        </span>
      </h1>

      <p
        data-cx-anim
        style={{
          fontSize: 21,
          lineHeight: 1.55,
          color: C.muted,
          margin: '28px 0 0',
          maxWidth: 920,
          fontWeight: 400,
          ...rise(340),
        }}
      >
        ClaritX is the <strong style={{ color: C.text, fontWeight: 600 }}>end-to-end clarity layer</strong> between
        the world's retail investors and the market. 9-dimension AI synthesis on any stock, portfolio matched to your
        life, dynamic re-evaluation on live market forces. AI-powered, always on. Live at{' '}
        <span style={{ color: C.green }}>claritx.ai</span>.
      </p>

      <div
        data-cx-anim
        style={{
          marginTop: 60,
          paddingTop: 24,
          borderTop: `1px solid ${C.ruleSoft}`,
          display: 'flex',
          gap: 32,
          flexWrap: 'wrap',
          fontSize: 14,
          letterSpacing: '0.08em',
          color: C.muted,
          ...rise(460),
        }}
      >
        <div>
          <div style={{ color: C.dim, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', fontSize: 11, marginBottom: 4 }}>
            Status
          </div>
          <div style={{ color: C.text, fontWeight: 600, fontSize: 18 }}>Shipped Oct '25 · AWS production · pre-traction</div>
        </div>
        <div>
          <div style={{ color: C.dim, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', fontSize: 11, marginBottom: 4 }}>
            Founders
          </div>
          <div style={{ color: C.text, fontWeight: 600, fontSize: 18 }}>Or Shmuely · Guy Gontar · Shalom Zilber</div>
        </div>
      </div>
    </div>
  </div>
);

// ============================================================================
// PAGE 2, UNDERPERFORMANCE STAT (huge stat + dual bars)
// ============================================================================

const ReturnBar = ({
  label,
  pct,
  pctOfWidth,
  color,
  delay,
  highlight = false,
}: {
  label: string;
  pct: string;
  pctOfWidth: number;
  color: string;
  delay: number;
  highlight?: boolean;
}) => (
  <div data-cx-anim style={{ display: 'flex', flexDirection: 'column', gap: 8, ...rise(delay) }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <div style={{ fontSize: 16, fontWeight: 600, color: highlight ? C.text : C.muted, letterSpacing: '0.04em' }}>
        {label}
      </div>
      <div
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 36,
          fontWeight: 600,
          color: highlight ? C.text : C.muted,
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.02em',
        }}
      >
        {pct}
      </div>
    </div>
    <div style={{ height: 18, background: C.ruleSoft, borderRadius: 9, overflow: 'hidden' }}>
      <div style={{ width: `${pctOfWidth}%`, height: '100%', background: color, borderRadius: 9 }} />
    </div>
  </div>
);

// Multi-study comparison row: shows one long-horizon study's market vs retail return as paired bars.
const StudyRow = ({
  study,
  period,
  marketLabel,
  marketPct,
  retailLabel,
  retailPct,
  delay,
}: {
  study: string;
  period: string;
  marketLabel: string;
  marketPct: number;
  retailLabel: string;
  retailPct: number;
  delay: number;
}) => {
  const gap = (marketPct - retailPct).toFixed(2);
  const maxScale = 20; // %/yr ceiling for bar width
  return (
    <div data-cx-anim style={{ display: 'flex', flexDirection: 'column', gap: 6, ...rise(delay) }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 13, color: C.muted }}>
        <span style={{ fontWeight: 700, color: C.text, letterSpacing: '0.04em' }}>{study}</span>
        <span style={{ letterSpacing: '0.08em', fontVariantNumeric: 'tabular-nums' }}>{period}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: C.text, marginBottom: 4 }}>
            <span>{marketLabel}</span>
            <span style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
              {marketPct.toFixed(2)}% / yr
            </span>
          </div>
          <div style={{ height: 10, background: C.ruleSoft, borderRadius: 5, overflow: 'hidden' }}>
            <div style={{ width: `${(marketPct / maxScale) * 100}%`, height: '100%', background: C.green }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: C.muted, marginTop: 6, marginBottom: 4 }}>
            <span>{retailLabel}</span>
            <span style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
              {retailPct.toFixed(2)}% / yr
            </span>
          </div>
          <div style={{ height: 10, background: C.ruleSoft, borderRadius: 5, overflow: 'hidden' }}>
            <div style={{ width: `${(retailPct / maxScale) * 100}%`, height: '100%', background: C.muted }} />
          </div>
        </div>
        <div
          style={{
            minWidth: 92,
            textAlign: 'right',
            fontFamily: 'var(--osd-font-display)',
            fontSize: 22,
            fontWeight: 600,
            color: C.red,
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          –{gap} pp
        </div>
      </div>
    </div>
  );
};

const Underperformance: Page = () => (
  <div style={fill}>
    <div style={{ position: 'absolute', inset: 0, padding: '74px 96px 100px' }}>
      <Eyebrow section="02 / 24">The cost of noise</Eyebrow>
      <Heading size={48}>
        Retail loses roughly <GreenAccent>1 pp / yr</GreenAccent> to the market, in every long-horizon study.
      </Heading>
      <Lede maxWidth={1620}>
        Three independent studies, three different methodologies, three different time periods. They all reach the
        same conclusion. It's not lack of capital. It's not bad luck. It's decisions made under information overload.
      </Lede>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr',
          gap: 48,
          marginTop: 32,
          alignItems: 'flex-start',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <StudyRow
            study="DALBAR QAIB 2025¹"
            period="20 yrs · US · 2004–2024"
            marketLabel="S&P 500"
            marketPct={10.35}
            retailLabel="Average retail equity investor"
            retailPct={9.24}
            delay={240}
          />
          <StudyRow
            study='Morningstar "Mind the Gap" 2024²'
            period="10 yrs · US funds · 2014–2024"
            marketLabel="Fund total return"
            marketPct={8.2}
            retailLabel="Fund investor (dollar-weighted)"
            retailPct={7.0}
            delay={320}
          />
          <StudyRow
            study="Barber & Odean · Berkeley³"
            period="6 yrs · US discount-broker panel · 1991–1996"
            marketLabel="Market"
            marketPct={17.9}
            retailLabel="Most-active retail quintile"
            retailPct={11.4}
            delay={400}
          />
        </div>

        <Card delay={460} accent={C.green} style={{ padding: '20px 24px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', color: C.green, textTransform: 'uppercase', marginBottom: 10 }}>
            2024, the most recent data point
          </div>
          <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 40, fontWeight: 600, color: C.text, letterSpacing: '-0.02em', lineHeight: 1 }}>
            –848 bps
          </div>
          <div style={{ marginTop: 10, fontSize: 14, color: C.muted, lineHeight: 1.55 }}>
            S&P 500 returned <strong style={{ color: C.text }}>25.02%</strong> · the average retail equity investor
            captured <strong style={{ color: C.text }}>16.54%</strong>. Second-largest single-year gap of the past
            decade.¹
          </div>
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.ruleSoft}`, fontSize: 14, color: C.text, lineHeight: 1.5 }}>
            <GreenAccent>The 2024 gap is dramatic.</GreenAccent> The multi-decade gap is what matters: ~1+ pp/yr that
            compounds materially over a career.
          </div>
        </Card>
      </div>

      <Sources
        delay={540}
        items={[
          'DALBAR QAIB 2025 · 20-year period ending Dec 2024',
          'Morningstar "Mind the Gap" 2024 · 10-year fund investor return gap',
          'Barber & Odean, "Trading is Hazardous to Your Wealth," Journal of Finance 2000',
        ]}
      />
    </div>
    <Watermark />
    <PageNum n={2} />
  </div>
);

// ============================================================================
// PAGE 3, THE PAIN (Banana hero noise)
// ============================================================================

const Pain: Page = () => (
  <div style={fill}>
    <img
      src={bananaNoise}
      alt=""
      aria-hidden
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
    />
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(90deg, rgba(10, 16, 32, 0.92) 0%, rgba(10, 16, 32, 0.6) 40%, rgba(10, 16, 32, 0.0) 100%)',
      }}
    />

    <div style={{ position: 'absolute', left: 96, top: 88, right: 940, bottom: 110 }}>
      <Eyebrow section="03 / 24">The pain</Eyebrow>
      <Heading size={56}>
        The problem isn't <em style={{ fontStyle: 'italic' }}>lack of data.</em> It's too much of it.
      </Heading>
      <Lede>
        Hundreds of millions of retail investors worldwide face fragmented signals from news, charts, filings, Reddit, X, YouTube, and
        finfluencers, none of it synthesized.
      </Lede>

      <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Card delay={260} accent={C.green} style={{ padding: '18px 22px' }}>
          <div style={{ fontSize: 18, color: C.text, lineHeight: 1.5 }}>
            Excess information measurably <GreenAccent>degrades decision accuracy</GreenAccent> and raises perceived risk.¹
          </div>
        </Card>
        <Card delay={330} accent={C.amber} style={{ padding: '18px 22px' }}>
          <div style={{ fontSize: 18, color: C.text, lineHeight: 1.5 }}>
            <GreenAccent>Decision paralysis</GreenAccent> at the moment of trade is widely documented across retail-investor surveys, often expressed as oversized cash positions held "until things become clearer."
          </div>
        </Card>
        <Card delay={400} accent={C.red} style={{ padding: '18px 22px' }}>
          <div style={{ fontSize: 18, color: C.text, lineHeight: 1.5 }}>
            Of finfluencer followers <strong style={{ color: C.text }}>targeted for fraud</strong>, <GreenAccent>69%</GreenAccent> lose money to it, vs. 26% of non-followers.²
          </div>
        </Card>
      </div>

      <Sources
        delay={500}
        items={[
          'Federal Reserve IFDP 2023 · MDPI Information Overload studies',
          'FINRA Foundation 2025, Finfluencer Followers and Social Media Scrollers (NFCS 2024)',
        ]}
      />
    </div>
    <Watermark />
    <PageNum n={3} />
  </div>
);

// ============================================================================
// PAGE 4, COMPETITOR LANDSCAPE
// ============================================================================

const CompRow = ({
  name,
  users,
  price,
  designedFor,
  output,
  highlight = false,
  delay,
}: {
  name: string;
  users: string;
  price: string;
  designedFor: string;
  output: string;
  highlight?: boolean;
  delay: number;
}) => (
  <div
    data-cx-anim
    style={{
      display: 'grid',
      gridTemplateColumns: '210px 160px 180px 1fr 1.3fr',
      gap: 20,
      alignItems: 'center',
      padding: '16px 22px',
      borderBottom: `1px solid ${C.ruleSoft}`,
      background: highlight ? 'rgba(51, 204, 122, 0.06)' : 'transparent',
      borderLeft: highlight ? `3px solid ${C.green}` : `3px solid transparent`,
      ...rise(delay),
    }}
  >
    <div
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontWeight: 600,
        fontSize: 20,
        color: highlight ? C.green : C.text,
        letterSpacing: '-0.01em',
      }}
    >
      {name}
    </div>
    <div style={{ fontSize: 15, color: C.muted, fontVariantNumeric: 'tabular-nums' }}>{users}</div>
    <div style={{ fontSize: 15, color: C.muted, fontVariantNumeric: 'tabular-nums' }}>{price}</div>
    <div style={{ fontSize: 15, color: C.muted }}>{designedFor}</div>
    <div style={{ fontSize: 15, color: highlight ? C.green : C.text, fontWeight: highlight ? 600 : 400, lineHeight: 1.35 }}>{output}</div>
  </div>
);

const Competitive: Page = () => (
  <div style={fill}>
    <div style={{ position: 'absolute', inset: 0, padding: '74px 96px 100px' }}>
      <Eyebrow section="05 / 24">Why existing tools fail retail</Eyebrow>
      <Heading size={50}>
        Existing tools were built for traders. <GreenAccent>Retail needs a clarity layer.</GreenAccent>
      </Heading>
      <Lede maxWidth={1620}>
        Charts, analyst feeds, and social noise solve none of the retail decision problem. ClaritX is the only stack
        that runs the read, builds a matched portfolio, and adapts it to live market forces.
      </Lede>

      <div
        style={{
          marginTop: 32,
          border: `1px solid ${C.rule}`,
          borderRadius: 8,
          overflow: 'hidden',
          background: C.surfaceAlt,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '210px 160px 180px 1fr 1.3fr',
            gap: 20,
            padding: '14px 22px',
            background: C.surface,
            borderBottom: `1px solid ${C.rule}`,
            borderLeft: `3px solid transparent`,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.22em',
            color: C.dim,
            textTransform: 'uppercase',
          }}
        >
          <div>Tool</div>
          <div>Users</div>
          <div>Price</div>
          <div>Designed for</div>
          <div>What it does</div>
        </div>
        <CompRow
          name="TradingView"
          users="100M+ users⁵"
          price="$15–$55 / mo"
          designedFor="Active traders, charts pros"
          output="100 indicators per chart"
          delay={240}
        />
        <CompRow
          name="TipRanks"
          users="Mid-tier⁶"
          price="$30–$50 / mo"
          designedFor="Analyst-data consumers"
          output="Raw analyst dumps, no filter"
          delay={290}
        />
        <CompRow
          name="Seeking Alpha"
          users="Mass-content⁷"
          price="$269–$2,400 / yr"
          designedFor="Article readers"
          output="Essay overload, no synthesis"
          delay={340}
        />
        <CompRow
          name="Stocktwits"
          users="10M+ users⁸"
          price="Free / ad-funded"
          designedFor="Social-feed scrollers"
          output="Pure social noise"
          delay={390}
        />
        <CompRow
          name="ClaritX"
          users="Live since Oct '25"
          price="Free → $20 / mo"
          designedFor="The retail investor"
          output="9-angle read + matched portfolio + dynamic risk monitoring"
          highlight
          delay={460}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 18,
          marginTop: 22,
        }}
      >
        <Card delay={540} accent={C.green} style={{ padding: '16px 22px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', color: C.green, textTransform: 'uppercase', marginBottom: 6 }}>
            Revenue model · data
          </div>
          <div style={{ fontSize: 15, color: C.text, lineHeight: 1.5 }}>
            SaaS Pro tier ($20 / mo) + credit packs for power users. Aggregated read & portfolio data licensed to
            funds and brokerages from Year 3.
          </div>
        </Card>
        <Card delay={600} accent={C.cyan} style={{ padding: '16px 22px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', color: C.cyan, textTransform: 'uppercase', marginBottom: 6 }}>
            Revenue model · affiliate
          </div>
          <div style={{ fontSize: 15, color: C.text, lineHeight: 1.5 }}>
            Conviction → broker routing. eToro live ($250 / funded account). Robinhood, IBKR, Webull in 12 months.
            We monetize the decision, upstream of the trade.
          </div>
        </Card>
      </div>

      <Sources
        delay={680}
        items={[
          'TradingView Q2 2025 stats',
          'TipRanks pricing 2026',
          'Seeking Alpha Premium pricing 2026',
          'Stocktwits 2025 brand kit',
        ]}
      />
    </div>
    <Watermark />
    <PageNum n={5} />
  </div>
);

// ============================================================================
// PAGE 5, FINFLUENCER STAT (big number)
// ============================================================================

const FinfluencerStat = ({
  big,
  label,
  delay,
}: {
  big: string;
  label: React.ReactNode;
  delay: number;
}) => (
  <div
    data-cx-anim
    style={{
      padding: '22px 24px',
      background: C.surface,
      border: `1px solid ${C.rule}`,
      borderLeft: `3px solid ${C.green}`,
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...rise(delay),
    }}
  >
    <div
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 64,
        fontWeight: 600,
        color: C.text,
        letterSpacing: '-0.025em',
        lineHeight: 1,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {big}
    </div>
    <div style={{ fontSize: 15, color: C.muted, lineHeight: 1.45 }}>{label}</div>
  </div>
);

const Finfluencer: Page = () => (
  <div style={fill}>
    <div style={{ position: 'absolute', inset: 0, padding: '74px 96px 100px' }}>
      <Eyebrow section="04 / 24">The void retail is filling, badly</Eyebrow>
      <Heading size={50}>
        Young investors <em style={{ fontStyle: 'italic' }}>are</em> researching,{' '}
        <GreenAccent>they're just doing it on TikTok.</GreenAccent>
      </Heading>
      <Lede maxWidth={1620}>
        FINRA's 2024 NFCS Investor Survey of US retail investors found a consistent pattern: under-35 investors lean
        heavily on social-media personalities, consult more sources than older cohorts, and still score the worst on
        objective investment knowledge, while rating themselves highest.
      </Lede>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 18,
          marginTop: 36,
        }}
      >
        <FinfluencerStat
          big="61%"
          delay={260}
          label={
            <>
              of <strong style={{ color: C.text }}>18–34 investors</strong> made an investment decision based on a
              social-media personality, vs. 6% of those 55+.
            </>
          }
        />
        <FinfluencerStat
          big="42%"
          delay={340}
          label={
            <>
              average score on FINRA's objective investment-knowledge quiz, yet{' '}
              <strong style={{ color: C.text }}>63%</strong> of the same group rated their own knowledge "high".
            </>
          }
        />
        <FinfluencerStat
          big="69%"
          delay={420}
          label={
            <>
              of finfluencer followers <strong style={{ color: C.text }}>targeted for fraud</strong> lost money to it,
              vs. 26% of non-followers.
            </>
          }
        />
      </div>

      <Card delay={520} accent={C.green} style={{ padding: '16px 22px', marginTop: 20 }}>
        <div style={{ fontSize: 17, color: C.text, lineHeight: 1.5 }}>
          The gap isn't <em style={{ fontStyle: 'italic' }}>more data</em>. It's{' '}
          <GreenAccent>trustworthy, synthesized, cited analysis</GreenAccent> at the moment of decision, the role
          finfluencers are filling by default.
        </div>
      </Card>

      <Sources delay={620} items={['FINRA Foundation 2025, Finfluencer Followers and Social Media Scrollers (2024 NFCS Investor Survey, n ≈ 2,800)']} />
    </div>
    <Watermark />
    <PageNum n={4} />
  </div>
);

// ============================================================================
// PAGE 6, PRODUCT: VERDICT
// ============================================================================

// Mock verdict UI rendered inline (no product screenshot dependency)
const VerdictMockup = () => {
  // 9 real dimensions from the live product (see AnalysisTabs.tsx in the main app)
  const dims: { name: string; signal: 'pos' | 'neg' | 'neu'; note: string }[] = [
    { name: 'News', signal: 'neu', note: 'No catalyst in 30 days' },
    { name: 'Technicals', signal: 'pos', note: 'Above 200-day SMA · low vol' },
    { name: 'Social Hype', signal: 'neu', note: 'Mixed retail · positive influencer' },
    { name: 'Financials', signal: 'pos', note: 'Margin expansion · cash-rich' },
    { name: 'Analysts', signal: 'pos', note: '11 buy · 4 hold · target $215' },
    { name: 'vs Market', signal: 'pos', note: 'Outperforming S&P 30-day' },
    { name: 'Insiders', signal: 'neg', note: 'Net selling Q1' },
    { name: 'Dividends', signal: 'pos', note: '0.5% yield · 7% growth FY' },
    { name: 'AI Synthesis', signal: 'pos', note: 'Bullish · 87/100 confidence' },
  ];
  const signalColor = (s: 'pos' | 'neg' | 'neu') => (s === 'pos' ? C.green : s === 'neg' ? C.red : C.amber);
  const signalGlyph = (s: 'pos' | 'neg' | 'neu') => (s === 'pos' ? '+' : s === 'neg' ? '−' : '◦');

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1.05fr 1fr',
        gap: 0,
        background: C.surfaceAlt,
        border: `1px solid ${C.rule}`,
        borderRadius: 10,
        overflow: 'hidden',
        minHeight: 460,
      }}
    >
      {/* Left: verdict header */}
      <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 22, background: C.surface }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            aria-hidden
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: C.green,
              animation: 'osd-cx-pulse-dot 2.4s ease-in-out infinite',
            }}
          />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.28em', color: C.green, textTransform: 'uppercase' }}>
            AI synthesis complete · 68s
          </span>
        </div>

        <div>
          <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 52, fontWeight: 600, color: C.text, letterSpacing: '-0.02em', lineHeight: 1 }}>
            AAPL
          </div>
          <div style={{ fontSize: 16, color: C.muted, marginTop: 4 }}>Apple Inc. · NASDAQ · $189.40 (+1.2%)</div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 16,
            padding: '20px 22px',
            background: 'rgba(51, 204, 122, 0.08)',
            border: `1px solid ${C.green}55`,
            borderLeft: `4px solid ${C.green}`,
            borderRadius: 8,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', color: C.dim, textTransform: 'uppercase' }}>
              Directional signal
            </div>
            <div
              style={{
                fontFamily: 'var(--osd-font-display)',
                fontSize: 36,
                fontWeight: 700,
                color: C.green,
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              Positive read
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginLeft: 'auto' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', color: C.dim, textTransform: 'uppercase' }}>
              Confidence
            </div>
            <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 28, fontWeight: 600, color: C.text, fontVariantNumeric: 'tabular-nums' }}>
              87 / 100
            </div>
          </div>
        </div>

        <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.55, fontStyle: 'italic', borderLeft: `2px solid ${C.ruleSoft}`, paddingLeft: 14 }}>
          "Services revenue is now 25% of mix, margin profile compounding. Insider selling is normal vesting cadence,
          not a thesis break. Premium is earned."
          <div style={{ fontSize: 11, color: C.dim, marginTop: 6, letterSpacing: '0.06em' }}>
            — synthesis from 14 cited sources
          </div>
        </div>
      </div>

      {/* Right: 9-dim grid */}
      <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.28em', color: C.dim, textTransform: 'uppercase' }}>
          9-dimension breakdown
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, flex: 1 }}>
          {dims.map((d) => (
            <div
              key={d.name}
              style={{
                padding: '12px 14px',
                background: C.surface,
                border: `1px solid ${C.ruleSoft}`,
                borderLeft: `3px solid ${signalColor(d.signal)}`,
                borderRadius: 6,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                minHeight: 78,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.text, letterSpacing: '0.04em' }}>{d.name}</div>
                <div
                  style={{
                    fontFamily: 'var(--osd-font-display)',
                    fontSize: 18,
                    fontWeight: 700,
                    color: signalColor(d.signal),
                    lineHeight: 1,
                  }}
                >
                  {signalGlyph(d.signal)}
                </div>
              </div>
              <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.35 }}>{d.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProductVerdict: Page = () => (
  <div style={fill}>
    <div style={{ position: 'absolute', inset: 0, padding: '74px 96px 100px' }}>
      <Eyebrow section="13 / 24">Layer 1 · scan any stock</Eyebrow>
      <Heading size={52}>
        Type a ticker. Get a cited 9-angle <GreenAccent>read in 70 seconds.</GreenAccent>
      </Heading>
      <Lede>
        9-dimension AI synthesis across news, technicals, social, financials, analysts, peer comparison, insiders,
        dividends, and an overall AI Insight, with full reasoning and every claim cited.
      </Lede>

      <div data-cx-anim style={{ marginTop: 28, ...rise(240) }}>
        <VerdictMockup />
      </div>

      <p
        data-cx-anim
        style={{ fontSize: 13, color: C.dim, marginTop: 14, fontStyle: 'italic', ...rise(400) }}
      >
        Live at claritx.ai · shipped October 2025 · 9-dimension pipeline in production on AWS.
      </p>
    </div>
    <Watermark />
    <PageNum n={13} />
  </div>
);

// ============================================================================
// PAGE 7, PORTFOLIO: HORIZON × RISK
// ============================================================================

const HorizonChip = ({
  label,
  meta,
  color,
  delay,
}: {
  label: string;
  meta: string;
  color: string;
  delay: number;
}) => (
  <div
    data-cx-anim
    style={{
      padding: '14px 18px',
      background: C.surface,
      border: `1px solid ${color}40`,
      borderLeft: `3px solid ${color}`,
      borderRadius: 8,
      ...rise(delay),
    }}
  >
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', color, textTransform: 'uppercase' }}>
      {label}
    </div>
    <div style={{ fontSize: 17, color: C.text, marginTop: 4 }}>{meta}</div>
  </div>
);

// Inline mock of the Portfolio Simulator UI (no product screenshot dependency)
// Inputs + result reflect the real product (see src/data/portfolioQuestions.ts).
const PortfolioMockup = () => {
  // The real product builds a stock+ETF list filtered by the user's answers.
  // Allocation shown here is illustrative — sector breakdown of the matched list.
  const allocations = [
    { label: 'Technology', pct: 28, color: C.green },
    { label: 'Healthcare', pct: 18, color: C.cyan },
    { label: 'Financial Services', pct: 16, color: C.amber },
    { label: 'Broad-market ETFs', pct: 22, color: '#5fb3d4' },
    { label: 'Other sectors', pct: 16, color: C.muted },
  ];
  // Donut: build cumulative arcs over 360deg
  let acc = 0;
  const arcs = allocations.map((a) => {
    const start = acc;
    acc += (a.pct / 100) * 360;
    return { ...a, start, end: acc };
  });
  const polar = (angle: number, r: number) => {
    const a = ((angle - 90) * Math.PI) / 180;
    return [80 + r * Math.cos(a), 80 + r * Math.sin(a)] as const;
  };
  const arcPath = (start: number, end: number) => {
    const [x1, y1] = polar(start, 64);
    const [x2, y2] = polar(end, 64);
    const [x3, y3] = polar(end, 42);
    const [x4, y4] = polar(start, 42);
    const large = end - start > 180 ? 1 : 0;
    return `M ${x1} ${y1} A 64 64 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A 42 42 0 ${large} 0 ${x4} ${y4} Z`;
  };

  return (
    <div
      style={{
        background: C.surfaceAlt,
        border: `1px solid ${C.rule}`,
        borderRadius: 10,
        overflow: 'hidden',
        padding: '24px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
      }}
    >
      {/* Input row — real questionnaire from src/data/portfolioQuestions.ts (9 questions in the live product) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
        {[
          { label: 'Goal', value: 'Long-term Growth', color: C.green },
          { label: 'Risk', value: 'Moderate · β 0.8–1.3', color: C.cyan },
          { label: 'Style', value: 'Blend · value + growth', color: C.amber },
          { label: 'Min AI score', value: '60 +', color: C.muted },
        ].map((i) => (
          <div
            key={i.label}
            style={{
              padding: '12px 14px',
              background: C.surface,
              border: `1px solid ${C.ruleSoft}`,
              borderLeft: `3px solid ${i.color}`,
              borderRadius: 6,
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.24em', color: i.color, textTransform: 'uppercase' }}>
              {i.label}
            </div>
            <div style={{ fontSize: 15, color: C.text, marginTop: 4, fontWeight: 600 }}>{i.value}</div>
          </div>
        ))}
      </div>

      {/* Result row: donut + legend + picks */}
      <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 22, alignItems: 'center' }}>
        <svg viewBox="0 0 160 160" width="160" height="160" aria-hidden style={{ display: 'block' }}>
          {arcs.map((a) => (
            <path key={a.label} d={arcPath(a.start, a.end)} fill={a.color} stroke={C.bg} strokeWidth="1.5" />
          ))}
          <text x="80" y="74" textAnchor="middle" fill={C.text} fontFamily="Space Grotesk" fontSize="18" fontWeight="600">
            42
          </text>
          <text x="80" y="92" textAnchor="middle" fill={C.muted} fontFamily="Inter" fontSize="9" letterSpacing="2">
            MATCHES
          </text>
        </svg>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {allocations.map((a) => (
            <div key={a.label} style={{ display: 'grid', gridTemplateColumns: '14px 1fr 50px', gap: 10, alignItems: 'center' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: a.color }} aria-hidden />
              <span style={{ fontSize: 13, color: C.text }}>{a.label}</span>
              <span
                style={{
                  fontFamily: 'var(--osd-font-display)',
                  fontSize: 14,
                  color: C.text,
                  fontWeight: 600,
                  textAlign: 'right',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {a.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested picks */}
      <div
        style={{
          paddingTop: 12,
          borderTop: `1px solid ${C.ruleSoft}`,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.24em', color: C.dim, textTransform: 'uppercase', marginRight: 4 }}>
          Top picks
        </span>
        {['AAPL', 'MSFT', 'NVDA', 'VTI', 'VXUS', 'BND', 'BRK.B'].map((t) => (
          <span
            key={t}
            style={{
              padding: '4px 9px',
              fontSize: 11,
              fontWeight: 600,
              color: C.text,
              background: C.surface,
              border: `1px solid ${C.ruleSoft}`,
              borderRadius: 4,
              letterSpacing: '0.04em',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
};

const Portfolio: Page = () => (
  <div style={fill}>
    <div style={{ position: 'absolute', inset: 0, padding: '74px 96px 100px' }}>
      <Eyebrow section="14 / 24">Layer 2 · build a matched portfolio</Eyebrow>
      <Heading size={52}>
        Build a portfolio matched to <GreenAccent>your life</GreenAccent>, and the market.
      </Heading>
      <Lede>
        A 9-question wizard, goal, risk, style, sectors, dividends, AI-score floor, captures the investor's profile
        and filters a matched stock + ETF set from the analyzed universe. Re-checked against live market forces every
        trading day.
      </Lede>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.15fr 1fr',
          gap: 40,
          marginTop: 32,
          alignItems: 'flex-start',
        }}
      >
        <div data-cx-anim style={{ ...rise(240) }}>
          <PortfolioMockup />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div
            data-cx-anim
            style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.22em', color: C.green, textTransform: 'uppercase', ...rise(280) }}
          >
            The real 9-question wizard
          </div>
          <HorizonChip label="Investment goal" meta="Long-term growth · regular income · stability & balance" color={C.green} delay={320} />
          <HorizonChip label="Risk tolerance" meta="Conservative (β &lt; 0.8) · Moderate (0.8–1.3) · Aggressive (> 1.3)" color={C.cyan} delay={370} />
          <HorizonChip label="Style + market cap" meta="Value · Growth · Blend × Large-cap / Mid-cap / Any" color={C.amber} delay={420} />
          <HorizonChip label="Sectors + dividends" meta="11 sectors · dividend importance high / medium / low" color="#5fb3d4" delay={470} />
          <HorizonChip label="AI-score floor" meta="Show all · 40+ · 60+ · 75+ (only top-rated stocks)" color={C.muted} delay={520} />

          <Card delay={580} accent={C.green} style={{ padding: '14px 20px', marginTop: 6 }}>
            <div style={{ fontSize: 15, color: C.text, lineHeight: 1.5 }}>
              Robo-advisor AUM reached <GreenAccent>$1.2T</GreenAccent> end-2024, proof retail will pay for matched abstraction.¹
            </div>
          </Card>
        </div>
      </div>

      <Sources delay={680} items={['Statista Robo-Advisors 2025 forecast', 'src/data/portfolioQuestions.ts in the live product codebase']} />
    </div>
    <Watermark />
    <PageNum n={14} />
  </div>
);

// ============================================================================
// PAGE 8, STICKINESS FLYWHEEL (centerpiece)
// ============================================================================

const FlywheelNode = ({
  x,
  y,
  title,
  body,
  width = 280,
}: {
  x: number;
  y: number;
  title: string;
  body: string;
  width?: number;
}) => (
  <div
    style={{
      position: 'absolute',
      left: x - width / 2,
      top: y - 64,
      width,
      padding: '14px 18px',
      background: C.surface,
      border: `1px solid ${C.rule}`,
      borderLeft: `3px solid ${C.green}`,
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}
  >
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: C.green, textTransform: 'uppercase' }}>
      {title}
    </div>
    <div style={{ fontSize: 14, color: C.text, lineHeight: 1.4 }}>{body}</div>
  </div>
);

const Flywheel = () => (
  <div style={{ position: 'relative', width: 920, height: 580, margin: '0 auto' }}>
    {/* Orbit ring */}
    <svg viewBox="0 0 920 580" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden>
      <defs>
        <marker id="arrowGreen" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#33cc7a" />
        </marker>
      </defs>
      <ellipse
        cx="460"
        cy="290"
        rx="370"
        ry="220"
        fill="none"
        stroke="#33cc7a"
        strokeOpacity="0.35"
        strokeWidth="1.5"
        strokeDasharray="6 8"
      />
      {/* 4 arrowheads at clockwise positions */}
      <path d="M 800 280 L 815 290 L 800 300" fill="none" stroke="#33cc7a" strokeWidth="1.5" strokeOpacity="0.6" />
      <path d="M 470 503 L 460 518 L 450 503" fill="none" stroke="#33cc7a" strokeWidth="1.5" strokeOpacity="0.6" />
      <path d="M 120 300 L 105 290 L 120 280" fill="none" stroke="#33cc7a" strokeWidth="1.5" strokeOpacity="0.6" />
      <path d="M 450 77 L 460 62 L 470 77" fill="none" stroke="#33cc7a" strokeWidth="1.5" strokeOpacity="0.6" />
    </svg>

    {/* Hub */}
    <div
      style={{
        position: 'absolute',
        left: 460 - 180,
        top: 290 - 100,
        width: 360,
        height: 200,
        borderRadius: 12,
        background: C.surfaceAlt,
        border: `2px solid ${C.green}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
      }}
    >
      <div
        aria-hidden
        data-cx-anim
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: C.green,
          animation: 'osd-cx-pulse-dot 2.4s ease-in-out infinite',
        }}
      />
      <div
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 28,
          fontWeight: 600,
          color: C.text,
          letterSpacing: '-0.01em',
          textAlign: 'center',
        }}
      >
        Daily Active Investor
      </div>
      <div style={{ fontSize: 14, color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
        Open ClaritX before your broker
      </div>
    </div>

    {/* 4 Nodes, 12, 3, 6, 9 o'clock */}
    <FlywheelNode x={460} y={50} title="Daily portfolio update" body="Every holding gets a fresh AI read each morning." />
    <FlywheelNode x={820} y={290} title="Holding-shift alerts" body="We ping you when insider or institutional activity changes the thesis." />
    <FlywheelNode x={460} y={550} title="Daily stock rankings" body="Top 10 buys, top 10 sells, refreshed at market open." />
    <FlywheelNode x={100} y={290} title="Deep research blog" body="Long-form AI research, indexed for SEO, refreshed weekly." />
  </div>
);

const FlywheelSlide: Page = () => (
  <div style={fill}>
    <div style={{ position: 'absolute', inset: 0, padding: '74px 96px 90px' }}>
      <Eyebrow section="16 / 24">Layer 4 · adapt to live market forces</Eyebrow>
      <Heading size={52}>
        Reads and portfolios <GreenAccent>re-evaluate every trading day.</GreenAccent>
      </Heading>
      <Lede>
        Live market data flows through the stack daily, every holding gets a fresh AI read, every portfolio is checked
        against shifting risk. The reason retail investors open ClaritX before their brokerage app.
      </Lede>

      <div data-cx-anim style={{ marginTop: 16, ...rise(240) }}>
        <Flywheel />
      </div>

      <div
        data-cx-anim
        style={{
          marginTop: 18,
          padding: '14px 22px',
          background: C.surface,
          border: `1px solid ${C.rule}`,
          borderLeft: `3px solid ${C.cyan}`,
          borderRadius: 8,
          fontSize: 15,
          color: C.text,
          lineHeight: 1.5,
          ...rise(420),
        }}
      >
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.24em', color: C.cyan, textTransform: 'uppercase', marginRight: 10 }}>
          Coming next
        </span>
        Broker API integration, connect a live portfolio so ClaritX reads your real holdings, surfaces changes that
        move the thesis, and routes one-tap trades back, the bridge from research to direct, AI-driven management.
      </div>
    </div>
    <Watermark />
    <PageNum n={16} />
  </div>
);

// ============================================================================
// PAGE 9 → 10, MONETIZATION FLOW (centerpiece)
// ============================================================================

const FlowStep = ({
  num,
  label,
  body,
  delay,
}: {
  num: string;
  label: string;
  body: string;
  delay: number;
}) => (
  <div
    data-cx-anim
    style={{
      flex: 1,
      padding: '18px 16px',
      background: C.surface,
      border: `1px solid ${C.rule}`,
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      ...rise(delay),
    }}
  >
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', color: C.green, textTransform: 'uppercase' }}>
      {num}
    </div>
    <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 19, fontWeight: 600, color: C.text }}>{label}</div>
    <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.45 }}>{body}</div>
  </div>
);

const FlowArrow = () => (
  <div style={{ display: 'flex', alignItems: 'center', padding: '0 6px' }} aria-hidden>
    <svg width="34" height="22" viewBox="0 0 34 22" style={{ display: 'block' }}>
      <line x1="2" y1="11" x2="26" y2="11" stroke={C.green} strokeWidth="2" strokeLinecap="round" />
      <polygon points="32, 11 22, 5 22, 17" fill={C.green} />
    </svg>
  </div>
);

const Monetization: Page = () => (
  <div style={fill}>
    <div style={{ position: 'absolute', inset: 0, padding: '88px 96px 110px' }}>
      <Eyebrow section="17 / 24">Business model</Eyebrow>
      <Heading size={52}>
        We get paid not for the trade,<GreenAccent>but for the decision.</GreenAccent>
      </Heading>
      <Lede>
        Every read ends in user conviction. Every conviction ends with a broker. We sit between, and capture value
        upstream of the trade.
      </Lede>

      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          gap: 4,
          marginTop: 40,
        }}
      >
        <FlowStep num="01" label="Runs analysis" body="User opens ClaritX, runs a 9-angle read." delay={240} />
        <FlowArrow />
        <FlowStep num="02" label="Forms conviction" body="Synthesis + sources build trust." delay={290} />
        <FlowArrow />
        <FlowStep num="03" label="Clicks Trade" body="One-click to partner broker." delay={340} />
        <FlowArrow />
        <FlowStep num="04" label="Broker pays" body="$20 (Robinhood) → $250 (eToro) per funded account.¹⁰" delay={390} />
        <FlowArrow />
        <FlowStep num="05" label="Upstream value" body="We monetize the decision, not the trade." delay={440} />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
          marginTop: 40,
        }}
      >
        <Card delay={520} accent={C.green}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.22em', color: C.green, textTransform: 'uppercase', marginBottom: 8 }}>
            Live today
          </div>
          <div style={{ fontSize: 19, color: C.text, lineHeight: 1.5 }}>
            <strong style={{ color: C.green }}>eToro affiliate is already live</strong> across claritx.ai, every analysis
            ends with a contextual broker call-to-action.
          </div>
        </Card>
        <Card delay={580} accent={C.cyan}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.22em', color: C.cyan, textTransform: 'uppercase', marginBottom: 8 }}>
            Next 12 months
          </div>
          <div style={{ fontSize: 19, color: C.text, lineHeight: 1.5 }}>
            Add Robinhood, IBKR, Webull. Match the analysis's asset class to the broker that monetizes it best.
          </div>
        </Card>
      </div>

      <p
        data-cx-anim
        style={{ fontSize: 13, color: C.dim, marginTop: 16, fontStyle: 'italic', ...rise(680) }}
      >
        No PFOF · No advisory license · Publisher exemption applies.
      </p>

      <Sources delay={760} items={['Robinhood Partners 2025 ($20 CPA) · eToro Partners 2025 (up to $250 CPA)']} />
    </div>
    <Watermark />
    <PageNum n={17} />
  </div>
);

// ============================================================================
// PAGE 10 → 11, WHY NOW (3 stats)
// ============================================================================

const StatBlock = ({
  big,
  label,
  delta,
  delay,
}: {
  big: string;
  label: string;
  delta?: string;
  delay: number;
}) => (
  <div
    data-cx-anim
    style={{
      padding: '28px 32px',
      background: C.surface,
      border: `1px solid ${C.rule}`,
      borderLeft: `3px solid ${C.green}`,
      borderRadius: 8,
      ...rise(delay),
    }}
  >
    <div
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 84,
        fontWeight: 600,
        lineHeight: 1,
        color: C.text,
        letterSpacing: '-0.025em',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {big}
    </div>
    <div style={{ fontSize: 18, color: C.muted, marginTop: 16, lineHeight: 1.4 }}>{label}</div>
    {delta && (
      <div style={{ fontSize: 14, color: C.green, marginTop: 8, fontWeight: 600, letterSpacing: '0.04em' }}>{delta}</div>
    )}
  </div>
);

const WhyNow: Page = () => (
  <div style={fill}>
    <div style={{ position: 'absolute', inset: 0, padding: '88px 96px 110px' }}>
      <Eyebrow section="06 / 24">Why now</Eyebrow>
      <Heading size={56}>
        Retail money is bigger, younger, and <GreenAccent>underserved.</GreenAccent>
      </Heading>
      <Lede>
        The largest demographic in trading history has the worst tooling, and the most acute need for synthesis.
      </Lede>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 22,
          marginTop: 48,
        }}
      >
        <StatBlock big="700M+" label="retail investors worldwide: US 165M, China 240M, India 109M, plus EU + APAC¹¹" delay={240} />
        <StatBlock big="20–25%" label="of equity trading is now retail (US benchmark, similar trends across EU + APAC)¹²" delta="+ doubled in the past decade" delay={310} />
        <StatBlock big="+$300B" label="added to stocks by retail in 2025 (US data, leading indicator for global flows)¹³" delta="14% above the 2021 meme-stock peak" delay={380} />
      </div>

      <Sources
        delay={500}
        items={[
          'US: Gallup / NORC 2024 · China: CSDC 2024 · India: NSE 2025',
          'JPMorgan retail trading-share data 2025',
          'JPMorgan / Reuters retail inflows 2025',
        ]}
      />
    </div>
    <Watermark />
    <PageNum n={6} />
  </div>
);

// ============================================================================
// PAGE 11 → 12, MARKET SIZE
// ============================================================================

const SparkArea = () => (
  <svg viewBox="0 0 1000 380" style={{ width: '100%', height: 'auto', maxWidth: 1000 }} aria-hidden>
    <defs>
      <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#33cc7a" stopOpacity="0.28" />
        <stop offset="1" stopColor="#33cc7a" stopOpacity="0.03" />
      </linearGradient>
    </defs>
    {/* gridlines */}
    {[0, 1, 2, 3].map((i) => (
      <line key={i} x1="60" y1={70 + i * 70} x2="960" y2={70 + i * 70} stroke="#172037" strokeWidth="1" strokeDasharray="3 5" />
    ))}
    {/* y-axis baseline */}
    <line x1="60" y1="320" x2="960" y2="320" stroke="#1f2a44" strokeWidth="1.5" />

    {/* Area fill */}
    <path
      d="M 60 280 L 220 250 L 380 210 L 540 165 L 700 120 L 860 85 L 960 70 L 960 320 L 60 320 Z"
      fill="url(#sparkFill)"
    />
    {/* Line */}
    <path
      d="M 60 280 L 220 250 L 380 210 L 540 165 L 700 120 L 860 85 L 960 70"
      stroke="#33cc7a"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Endpoint dots */}
    <circle cx="60" cy="280" r="5" fill="#33cc7a" />
    <circle cx="960" cy="70" r="6" fill="#33cc7a" />

    {/* labels */}
    <text x="60" y="350" fill="#9aa8c4" fontSize="14" fontFamily="Inter" fontWeight="500">2024</text>
    <text x="60" y="262" fill="#f4f6fb" fontSize="20" fontFamily="Space Grotesk" fontWeight="600">$3.0B</text>
    <text x="960" y="350" fill="#9aa8c4" fontSize="14" fontFamily="Inter" fontWeight="500" textAnchor="end">2030</text>
    <text x="960" y="52" fill="#33cc7a" fontSize="20" fontFamily="Space Grotesk" fontWeight="600" textAnchor="end">$6.6B</text>
  </svg>
);

const Market: Page = () => (
  <div style={fill}>
    <div style={{ position: 'absolute', inset: 0, padding: '74px 96px 100px' }}>
      <Eyebrow section="07 / 24">Market · today</Eyebrow>
      <Heading size={50}>
        Global digital retail investing software, <GreenAccent>$3B → $6.6B</GreenAccent>.
      </Heading>
      <Lede maxWidth={1620}>
        Grand View Research's "online investment platforms" category is a global market covering mobile trading apps,
        robo-advisors, digital wealth-management services, and supporting software. ClaritX sits one layer above as
        the AI research and decision-support layer, with SaaS revenue and affiliate routing into the brokerages
        already inside this market.
      </Lede>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.6fr 1fr',
          gap: 48,
          marginTop: 28,
          alignItems: 'center',
        }}
      >
        <div data-cx-anim style={{ ...rise(240) }}>
          <SparkArea />
          <div style={{ marginTop: 12, fontSize: 12, color: C.dim, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
            Online investment platforms, global market¹
          </div>
          <div style={{ marginTop: 8, fontSize: 13, color: C.muted, lineHeight: 1.45, maxWidth: 880 }}>
            Includes: mobile trading apps · robo-advisors · digital wealth-management services · advisory + support
            software. Does not include brokerage commissions or PFOF revenue.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card delay={320} accent={C.green}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.22em', color: C.green, textTransform: 'uppercase' }}>
              CAGR · 2024 → 2030¹
            </div>
            <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 44, fontWeight: 600, color: C.text, marginTop: 4, letterSpacing: '-0.02em' }}>
              14.2%
            </div>
          </Card>
          <Card delay={380} accent={C.cyan}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.22em', color: C.cyan, textTransform: 'uppercase' }}>
              Robo-advisor AUM²
            </div>
            <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 44, fontWeight: 600, color: C.text, marginTop: 4, letterSpacing: '-0.02em' }}>
              $1.2T → $2.06T
            </div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>2024 → 2025 · proof retail will pay for matched abstraction</div>
          </Card>
        </div>
      </div>

      <Sources
        delay={520}
        items={[
          'Grand View Research · Online Investment Platform Market Report 2025',
          'Statista · Robo-Advisors 2025 forecast',
        ]}
      />
    </div>
    <Watermark />
    <PageNum n={7} />
  </div>
);

// ============================================================================
// PAGE 12 → 16, MAGNIFI COMPARISON (Banana hero)
// ============================================================================

const MagnifiComp: Page = () => (
  <div style={fill}>
    <img
      src={bananaMagnifi}
      alt=""
      aria-hidden
      style={{ position: 'absolute', left: 0, right: 0, top: 0, width: '100%', height: 320, objectFit: 'cover' }}
    />
    <div
      aria-hidden
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 320,
        background: 'linear-gradient(180deg, rgba(10, 16, 32, 0.0) 0%, rgba(10, 16, 32, 0.85) 80%, #0a1020 100%)',
      }}
    />

    <div style={{ position: 'absolute', left: 96, right: 96, top: 360, bottom: 110 }}>
      <Eyebrow section="10 / 24">Closest competitor</Eyebrow>
      <Heading size={48}>
        Magnifi proved retail will pay for synthesis. <GreenAccent>We go further.</GreenAccent>
      </Heading>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 32,
          marginTop: 32,
        }}
      >
        <Card delay={260} style={{ padding: '24px 28px' }}>
          <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 24, fontWeight: 600, color: C.text }}>Magnifi</div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Backed by JPMorgan, Morningstar, Franklin Templeton</div>
          <div style={{ borderTop: `1px solid ${C.ruleSoft}`, marginTop: 14, paddingTop: 14 }}>
            <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 16, color: C.muted, lineHeight: 1.5 }}>
              <li><GreenAccent>$2B linked user assets</GreenAccent>¹⁵, proves retail pays for AI synthesis</li>
              <li>Chat interface, answers questions</li>
              <li>No daily-habit loops, no affiliate routing</li>
            </ul>
          </div>
        </Card>
        <Card delay={340} accent={C.green} style={{ padding: '24px 28px' }}>
          <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 24, fontWeight: 600, color: C.green }}>ClaritX</div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>The synthesis + retention + monetization layer</div>
          <div style={{ borderTop: `1px solid ${C.ruleSoft}`, marginTop: 14, paddingTop: 14 }}>
            <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 16, color: C.text, lineHeight: 1.5 }}>
              <li>Read-first product, not chat</li>
              <li>Portfolio sim matched to horizon × risk</li>
              <li><GreenAccent>4 daily-habit loops</GreenAccent> + affiliate router built in</li>
            </ul>
          </div>
        </Card>
      </div>

      <Sources delay={460} items={['Magnifi press 2024 · Crunchbase']} />
    </div>
    <Watermark />
    <PageNum n={10} />
  </div>
);

// ============================================================================
// PAGE 13 → 17, PRICING
// ============================================================================

const PriceCard = ({
  tier,
  price,
  features,
  highlight = false,
  delay,
}: {
  tier: string;
  price: string;
  features: string[];
  highlight?: boolean;
  delay: number;
}) => (
  <div
    data-cx-anim
    style={{
      padding: '28px 32px',
      background: highlight ? 'rgba(51, 204, 122, 0.06)' : C.surface,
      border: `1px solid ${highlight ? C.green : C.rule}`,
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      ...rise(delay),
    }}
  >
    <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 24, fontWeight: 600, color: highlight ? C.green : C.text, letterSpacing: '-0.01em' }}>
      {tier}
    </div>
    <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 48, fontWeight: 600, color: C.text, letterSpacing: '-0.025em', lineHeight: 1 }}>
      {price}
    </div>
    <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {features.map((f) => (
        <li key={f} style={{ fontSize: 17, color: C.text, lineHeight: 1.45 }}>{f}</li>
      ))}
    </ul>
  </div>
);

const Pricing: Page = () => (
  <div style={fill}>
    <div style={{ position: 'absolute', inset: 0, padding: '88px 96px 110px' }}>
      <Eyebrow section="18 / 24">Pricing</Eyebrow>
      <Heading size={56}>
        Free trial → <GreenAccent>$20/mo Pro</GreenAccent> → credit packs.
      </Heading>
      <Lede>
        Simple at the top of the funnel. Pay-as-you-go for power users. Average converted user runs 8–12 analyses / month
        at conviction-formation peak.
      </Lede>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 32,
          marginTop: 44,
        }}
      >
        <PriceCard
          tier="Free"
          price="$0"
          delay={260}
          features={[
            '3 analyses / month',
            'Email capture only',
            'Daily ranking emails',
            'Blog & community access',
          ]}
        />
        <PriceCard
          tier="Pro"
          price="$20 / mo"
          highlight
          delay={340}
          features={[
            '50 credits / month',
            'Portfolio Simulator unlocked',
            'Holding-shift alerts',
            'Top-tier rankings + priority',
            'Credit packs for power users',
          ]}
        />
      </div>

      <Card delay={460} accent={C.cyan} style={{ marginTop: 24, padding: '18px 24px' }}>
        <div style={{ fontSize: 17, color: C.text, lineHeight: 1.5 }}>
          <strong style={{ color: C.cyan }}>SaaS + affiliate stacked.</strong> Pro subs are the recurring base. Affiliate
          is the upside, every funded broker account adds $20–$250 on top.
        </div>
      </Card>
    </div>
    <Watermark />
    <PageNum n={18} />
  </div>
);

// ============================================================================
// PAGE 14 → 18, BUILD AGENDA · WHERE WE INVEST NEXT
// ============================================================================

const BuildPriority = ({
  num,
  color,
  title,
  bullets,
  delay,
}: {
  num: string;
  color: string;
  title: string;
  bullets: string[];
  delay: number;
}) => (
  <div
    data-cx-anim
    style={{
      flex: 1,
      padding: '24px 26px',
      background: C.surface,
      border: `1px solid ${C.rule}`,
      borderTop: `3px solid ${color}`,
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      ...rise(delay),
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 40,
          fontWeight: 600,
          color,
          letterSpacing: '-0.02em',
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1,
        }}
      >
        {num}
      </span>
      <div
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 22,
          fontWeight: 600,
          color: C.text,
          letterSpacing: '-0.01em',
          lineHeight: 1.2,
        }}
      >
        {title}
      </div>
    </div>
    <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {bullets.map((b) => (
        <li key={b} style={{ fontSize: 15, color: C.muted, lineHeight: 1.45 }}>{b}</li>
      ))}
    </ul>
  </div>
);

const Funds: Page = () => (
  <div style={fill}>
    <div style={{ position: 'absolute', inset: 0, padding: '74px 96px 100px' }}>
      <Eyebrow section="19 / 24">Build agenda · where we invest next</Eyebrow>
      <Heading size={52}>
        Four priorities · <GreenAccent>read → portfolio → assist.</GreenAccent>
      </Heading>
      <Lede>The features and infrastructure that take ClaritX from a free retail tool to a regulated AI fiduciary tier.</Lede>

      <div style={{ display: 'flex', gap: 18, marginTop: 40, alignItems: 'stretch' }}>
        <BuildPriority
          num="01"
          color={C.green}
          title="Growth & reach"
          delay={260}
          bullets={[
            'Paid acquisition (Meta, Google, X)',
            'SEO + AI-citation content velocity',
            'Creator + affiliate routing layer',
          ]}
        />
        <BuildPriority
          num="02"
          color={C.cyan}
          title="AI quality & coverage"
          delay={320}
          bullets={[
            'Evaluation harness · signal accuracy',
            'Multi-model routing (Claude · GPT · Gemini)',
            'Coverage beyond 13K stocks: ETFs, crypto',
          ]}
        />
        <BuildPriority
          num="03"
          color={C.amber}
          title="Personalization depth"
          delay={380}
          bullets={[
            'Risk-wrapper auto-recalibration',
            'Holding-shift mobile alerts',
            'Life-event triggers (job · baby · retire)',
          ]}
        />
        <BuildPriority
          num="04"
          color={C.muted}
          title="Fiduciary path"
          delay={440}
          bullets={[
            'Broker API integration · live portfolio connect',
            'Compliance + legal review · RIA-registration scaffolding',
            'Custody + tax-loss-harvesting partner',
          ]}
        />
      </div>

      <div
        data-cx-anim
        style={{
          marginTop: 28,
          padding: '18px 24px',
          background: C.surface,
          border: `1px solid ${C.rule}`,
          borderLeft: `3px solid ${C.green}`,
          borderRadius: 8,
          fontSize: 16,
          color: C.text,
          lineHeight: 1.5,
          ...rise(560),
        }}
      >
        <strong style={{ color: C.green }}>Infrastructure covered.</strong> AWS Activate + Google for Startups credits already
        cover hosting and AI compute for the next 18+ months, every dollar that comes in goes to product and reach,
        not servers.
      </div>
    </div>
    <Watermark />
    <PageNum n={19} />
  </div>
);

// ============================================================================
// PAGE 15 → 19, 12-MONTH ROADMAP
// ============================================================================

const QuarterCard = ({
  q,
  title,
  bullets,
  active = false,
  delay,
}: {
  q: string;
  title: string;
  bullets: string[];
  active?: boolean;
  delay: number;
}) => (
  <div
    data-cx-anim
    style={{
      flex: 1,
      padding: '20px 22px',
      background: C.surface,
      border: `1px solid ${active ? C.green : C.rule}`,
      borderTop: `3px solid ${active ? C.green : C.cyan}`,
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      ...rise(delay),
    }}
  >
    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.22em', color: active ? C.green : C.cyan, textTransform: 'uppercase' }}>
      {q}
    </div>
    <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 22, fontWeight: 600, color: C.text, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
      {title}
    </div>
    <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {bullets.map((b) => (
        <li key={b} style={{ fontSize: 15, color: C.muted, lineHeight: 1.45 }}>{b}</li>
      ))}
    </ul>
  </div>
);

const Roadmap: Page = () => (
  <div style={fill}>
    <div style={{ position: 'absolute', inset: 0, padding: '88px 96px 110px' }}>
      <Eyebrow section="20 / 24">12-month plan</Eyebrow>
      <Heading size={56}>
        Prove the <GreenAccent>daily-habit loop.</GreenAccent>
      </Heading>
      <Lede>
        Quarterly milestones toward a measurable growth story: paying retention, organic CAC, and affiliate payback &lt; 90 days.
      </Lede>

      <div style={{ display: 'flex', gap: 16, marginTop: 44, alignItems: 'stretch' }}>
        <QuarterCard
          q="Now · Q2 2026"
          title="Acquisition engine on"
          active
          delay={260}
          bullets={[
            '10K signups · 1K weekly actives',
            'eToro affiliate scaled · Robinhood added',
            'Daily ranking email shipped',
          ]}
        />
        <QuarterCard
          q="Q3 2026"
          title="First paying cohort"
          delay={320}
          bullets={[
            '30K signups · 5K WAU · 500 Pro subs',
            'Mobile alerts live',
            'CAC measured per channel',
          ]}
        />
        <QuarterCard
          q="Q4 2026"
          title="Stickiness validated"
          delay={380}
          bullets={[
            '75K signups · 10K WAU',
            'Holding-shift alerts in production',
            'First fund partnership signed',
          ]}
        />
        <QuarterCard
          q="Q1 2027"
          title="Scaled growth profile"
          delay={440}
          bullets={[
            '15K weekly actives',
            'Affiliate payback < 90 days',
            'Signal accuracy harness validated',
          ]}
        />
      </div>
    </div>
    <Watermark />
    <PageNum n={20} />
  </div>
);

// ============================================================================
// PAGE 16 → 20, TEAM
// ============================================================================

const FounderCard = ({
  name,
  role,
  photo,
  photoPos = 'center 25%',
  bullets,
  trust,
  delay,
}: {
  name: string;
  role: string;
  photo: string;
  photoPos?: string;
  bullets: string[];
  trust: string;
  delay: number;
}) => (
  <div
    data-cx-anim
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: C.surface,
      border: `1px solid ${C.rule}`,
      borderRadius: 8,
      overflow: 'hidden',
      padding: '32px 26px 26px',
      gap: 18,
      ...rise(delay),
    }}
  >
    <div
      style={{
        width: 196,
        height: 196,
        borderRadius: '50%',
        overflow: 'hidden',
        background: C.surfaceAlt,
        border: `2px solid ${C.ruleSoft}`,
        flexShrink: 0,
      }}
    >
      <img
        src={photo}
        alt={name}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: photoPos,
          filter: 'grayscale(0.15) contrast(1.05)',
          display: 'block',
        }}
      />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', textAlign: 'center', width: '100%' }}>
      <div>
        <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 26, fontWeight: 600, color: C.text, letterSpacing: '-0.015em' }}>
          {name}
        </div>
        <div style={{ fontSize: 16, color: C.green, fontWeight: 600, marginTop: 2 }}>{role}</div>
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
        {bullets.map((b) => (
          <li key={b} style={{ fontSize: 15, color: C.text, lineHeight: 1.4 }}>{b}</li>
        ))}
      </ul>
      <div
        style={{
          marginTop: 6,
          paddingTop: 12,
          borderTop: `1px solid ${C.ruleSoft}`,
          width: '100%',
          fontSize: 11,
          color: C.muted,
          letterSpacing: '0.20em',
          fontWeight: 700,
          textTransform: 'uppercase',
        }}
      >
        {trust}
      </div>
    </div>
  </div>
);

const LogoStrip = ({ labels, delay = 400 }: { labels: string[]; delay?: number }) => (
  <div
    data-cx-anim
    style={{
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 24,
      marginTop: 24,
      paddingTop: 20,
      borderTop: `1px solid ${C.ruleSoft}`,
      ...rise(delay),
    }}
  >
    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.24em', color: C.dim, textTransform: 'uppercase' }}>
      Past employers
    </span>
    {labels.map((l) => (
      <span key={l} style={{ fontSize: 14, fontWeight: 500, color: C.muted, letterSpacing: '0.04em', opacity: 0.85 }}>
        {l}
      </span>
    ))}
  </div>
);

const Team: Page = () => (
  <div style={fill}>
    <div style={{ position: 'absolute', inset: 0, padding: '74px 96px 100px' }}>
      <Eyebrow section="21 / 24">The team</Eyebrow>
      <Heading size={48}>
        Shipping fintech AI <GreenAccent>since before it was a category.</GreenAccent>
      </Heading>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 22,
          marginTop: 32,
        }}
      >
        <FounderCard
          name="Or Shmuely"
          role="CEO & Co-Founder"
          photo={orPhoto}
          photoPos="center 35%"
          delay={240}
          bullets={[
            '5+ yrs building AI tools & automations',
            'Extensive experience in AI-integrated automation in hi-tech',
            'Personal investor since childhood, felt the pain',
          ]}
          trust="Vision · Product · Growth"
        />
        <FounderCard
          name="Guy Gontar"
          role="CTO & Co-Founder"
          photo={guyPhoto}
          photoPos="center 30%"
          delay={300}
          bullets={[
            '6 yrs eng · SWE at Proxima Investment House',
            'Ex-Skai, floLIVE, Rapyd',
            'IDF Unit 8200 (Intelligence Corps) alumnus',
          ]}
          trust="Unit 8200 · Proxima Investment House"
        />
        <FounderCard
          name="Shalom Zilber"
          role="Lead Engineer & Co-Founder"
          photo={shalomPhoto}
          photoPos="center 35%"
          delay={360}
          bullets={[
            '6 yrs eng · Technical Lead at Stealth',
          ]}
          trust="LLM Engineer · Distributed Systems"
        />
      </div>

      <LogoStrip
        delay={440}
        labels={['Skai', 'Proxima Investment House', 'floLIVE', 'Rapyd', 'IDF Unit 8200', 'AWS Activate', 'Google for Startups']}
      />
    </div>
    <Watermark />
    <PageNum n={21} />
  </div>
);

// ============================================================================
// PAGE 17 → 21, PHILOSOPHY (Banana hero)
// ============================================================================

const Philosophy: Page = () => (
  <div style={fill}>
    {/* Subtle radial glow centered behind the text — replaces the busy banana */}
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(51,204,122,0.10) 0%, rgba(51,204,122,0.04) 25%, transparent 55%)',
      }}
    />
    {/* Top accent rule */}
    <div
      aria-hidden
      style={{
        position: 'absolute',
        left: '50%',
        top: '32%',
        transform: 'translateX(-50%)',
        width: 56,
        height: 2,
        background: C.green,
      }}
    />

    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '88px 96px 80px',
      }}
    >
      <Eyebrow section="22 / 24">What we believe</Eyebrow>

      <div data-cx-anim style={{ textAlign: 'center', ...rise(200) }}>
        <div
          style={{
            fontFamily: 'var(--osd-font-display)',
            fontSize: 76,
            fontWeight: 600,
            color: C.text,
            letterSpacing: '-0.025em',
            lineHeight: 1.12,
            maxWidth: 1500,
            margin: '0 auto',
          }}
        >
          Retail deserves a <GreenAccent>clarity layer</GreenAccent>,
          <br />
          not another tool.
        </div>
      </div>

      <div style={{ height: 32 }} />
    </div>
    <PageNum n={22} />
  </div>
);

// ============================================================================
// PAGE 20 → 24, THE ASK
// ============================================================================

const Ask: Page = () => (
  <div style={fill}>
    <div style={{ position: 'absolute', inset: 0, padding: '88px 96px 110px' }}>
      <Eyebrow section="23 / 24">What's next · let's build</Eyebrow>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 56,
          marginTop: 32,
          alignItems: 'center',
        }}
      >
        <div data-cx-anim style={{ ...rise(180), maxWidth: 760 }}>
          <div
            style={{
              fontFamily: 'var(--osd-font-display)',
              fontSize: 80,
              fontWeight: 600,
              lineHeight: 1.06,
              color: C.text,
              letterSpacing: '-0.028em',
            }}
          >
            We're building the
            <br />
            <GreenAccent>clarity layer</GreenAccent>
            <br />
            for the world's retail
            <br />
            investors.
          </div>
          <div style={{ fontSize: 19, color: C.muted, marginTop: 24, lineHeight: 1.55 }}>
            End-to-end. Stock scanning to dynamic personalized portfolios. AI-powered. Live data. The wrapper retail
            has been missing, at unit economics no human advisor can match.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card delay={260} accent={C.green}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.22em', color: C.green, textTransform: 'uppercase' }}>
              Talk to us
            </div>
            <div style={{ fontSize: 18, color: C.text, marginTop: 8, lineHeight: 1.5 }}>
              business@claritx.ai · claritx.ai · Tel Aviv, Israel
            </div>
          </Card>
        </div>
      </div>
    </div>
    <Watermark />
    <PageNum n={23} />
  </div>
);

// ============================================================================
// PAGE 21 → 25, CLOSING (mirror of cover)
// ============================================================================

const Closing: Page = () => (
  <div style={fill}>
    {/* Clean centered radial glow — no banana background here, so the headline doesn't get crossed by any image line */}
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(51,204,122,0.12) 0%, rgba(51,204,122,0.04) 30%, transparent 60%)',
      }}
    />

    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 96px',
        textAlign: 'center',
      }}
    >
      <div data-cx-anim style={{ marginBottom: 64, ...rise(0) }}>
        <ClaritXLogo height={96} variant="light" />
      </div>
      <h1
        data-cx-anim
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 128,
          fontWeight: 600,
          lineHeight: 1.04,
          margin: 0,
          letterSpacing: '-0.028em',
          maxWidth: 1500,
          ...rise(140),
        }}
      >
        Clarity before <GreenAccent>you invest.</GreenAccent>
      </h1>
      <div
        data-cx-anim
        style={{
          marginTop: 56,
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: '0.06em',
          color: C.green,
          ...rise(280),
        }}
      >
        claritx.ai
      </div>
    </div>

    <div aria-hidden style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, background: C.green }} />
  </div>
);

// ============================================================================
// PAGE 8, RISK PERSONALITY WRAPPER
// ============================================================================

const RiskMatrixRow = ({
  profile,
  horizon,
  loss,
  verdict,
  verdictColor,
  delay,
}: {
  profile: string;
  horizon: string;
  loss: string;
  verdict: string;
  verdictColor: string;
  delay: number;
}) => (
  <div
    data-cx-anim
    style={{
      display: 'grid',
      gridTemplateColumns: '220px 180px 220px 1fr',
      gap: 24,
      alignItems: 'center',
      padding: '20px 24px',
      borderBottom: `1px solid ${C.ruleSoft}`,
      ...rise(delay),
    }}
  >
    <div
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontWeight: 600,
        fontSize: 20,
        color: C.text,
        letterSpacing: '-0.01em',
      }}
    >
      {profile}
    </div>
    <div style={{ fontSize: 16, color: C.muted, fontVariantNumeric: 'tabular-nums' }}>{horizon}</div>
    <div style={{ fontSize: 16, color: C.muted, fontVariantNumeric: 'tabular-nums' }}>{loss}</div>
    <div
      style={{
        fontSize: 16,
        color: verdictColor,
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <span
        aria-hidden
        style={{ width: 8, height: 8, borderRadius: '50%', background: verdictColor }}
      />
      {verdict}
    </div>
  </div>
);

const RiskPersonality: Page = () => (
  <div style={fill}>
    <div style={{ position: 'absolute', inset: 0, padding: '88px 96px 110px' }}>
      <Eyebrow section="15 / 24">Layer 3 · personalize every read</Eyebrow>
      <Heading size={54}>
        Risk isn't a number. It's <GreenAccent>your life.</GreenAccent>
      </Heading>
      <Lede>
        Same stock. Different reads. ClaritX wraps every analysis in the investor's risk personality, horizon, and
        financial slack, so the synthesis fits the person asking.
      </Lede>

      <div
        style={{
          marginTop: 40,
          border: `1px solid ${C.rule}`,
          borderRadius: 8,
          overflow: 'hidden',
          background: C.surfaceAlt,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '220px 180px 220px 1fr',
            gap: 24,
            padding: '14px 24px',
            background: C.surface,
            borderBottom: `1px solid ${C.rule}`,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.22em',
            color: C.dim,
            textTransform: 'uppercase',
          }}
        >
          <div>Risk profile</div>
          <div>Beta filter</div>
          <div>Style preference</div>
          <div>NVDA read (β ≈ 1.7), same day</div>
        </div>
        <RiskMatrixRow
          profile="Conservative"
          horizon="β &lt; 0.8"
          loss="Value / dividend lean"
          verdict="Filtered out · volatility above ceiling"
          verdictColor={C.red}
          delay={260}
        />
        <RiskMatrixRow
          profile="Moderate"
          horizon="β 0.8 – 1.3"
          loss="Blend · value + growth"
          verdict="Filtered out · above beta ceiling"
          verdictColor={C.amber}
          delay={330}
        />
        <RiskMatrixRow
          profile="Aggressive"
          horizon="β > 1.3"
          loss="Growth lean"
          verdict="Within envelope · ranked by AI score"
          verdictColor={C.green}
          delay={400}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
          marginTop: 28,
        }}
      >
        <Card delay={500} accent={C.green}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.22em', color: C.green, textTransform: 'uppercase', marginBottom: 8 }}>
            Why this matters
          </div>
          <div style={{ fontSize: 17, color: C.text, lineHeight: 1.5 }}>
            A 22-year-old with $200/mo and a 401(k) is not the same investor as a 58-year-old protecting a nest egg.
            <GreenAccent> Off-the-shelf research treats them identically.</GreenAccent>
          </div>
        </Card>
        <Card delay={560} accent={C.cyan}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.22em', color: C.cyan, textTransform: 'uppercase', marginBottom: 8 }}>
            How we wrap it
          </div>
          <div style={{ fontSize: 17, color: C.text, lineHeight: 1.5 }}>
            9-question profile (goal, risk, style, sectors, dividends, AI floor). Every read filtered through the
            user's beta band, sector preference, and AI-score floor before it's surfaced.
          </div>
        </Card>
      </div>

      <Sources
        delay={680}
        items={[
          'Vanguard "Advisor Alpha" 2024, personalized risk framing adds 150 bps / yr',
          'FINRA Risk Tolerance Methodology 2023',
        ]}
      />
    </div>
    <Watermark />
    <PageNum n={15} />
  </div>
);

// ============================================================================
// PAGE 13, TAM 2.0, ADVISOR REPLACEMENT EXPANSION
// ============================================================================

const TamBar = ({
  label,
  sub,
  amount,
  widthPct,
  color,
  delay,
  highlight = false,
}: {
  label: string;
  sub: string;
  amount: string;
  widthPct: number;
  color: string;
  delay: number;
  highlight?: boolean;
}) => (
  <div data-cx-anim style={{ display: 'flex', flexDirection: 'column', gap: 8, ...rise(delay) }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <div>
        <div style={{ fontSize: 17, fontWeight: 600, color: C.text }}>{label}</div>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{sub}</div>
      </div>
      <div
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 40,
          fontWeight: 600,
          color: highlight ? C.green : C.text,
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.02em',
        }}
      >
        {amount}
      </div>
    </div>
    <div style={{ height: 22, background: C.ruleSoft, borderRadius: 11, overflow: 'hidden', position: 'relative' }}>
      <div
        style={{
          width: `${widthPct}%`,
          height: '100%',
          background: color,
          borderRadius: 11,
          animation: 'osd-cx-sweep 800ms ease-out both',
        }}
      />
    </div>
  </div>
);

const AdvisorTam: Page = () => (
  <div style={fill}>
    <div style={{ position: 'absolute', inset: 0, padding: '74px 96px 100px' }}>
      <Eyebrow section="08 / 24">Market · the bigger prize</Eyebrow>
      <Heading size={48}>
        From $3B today to a <GreenAccent>$1T+ global advisor industry</GreenAccent>.
      </Heading>
      <Lede maxWidth={1620}>
        Today ClaritX monetizes from the $3B global digital retail investing software market (SaaS subs + affiliate
        routing to brokers). The bigger prize is the global fee-based advisor industry, ~$1T/yr in annual revenue
        (US alone is $260B/yr), structurally inaccessible to hundreds of millions of households below typical advisor
        minimums. As AI matures from single-stock research into full portfolio guidance, that adjacent market becomes
        addressable.
      </Lede>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr',
          gap: 48,
          marginTop: 32,
          alignItems: 'flex-start',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <TamBar
            label="Today · digital retail investing software"
            sub="Apps, robo-advisors, wealth platforms · ClaritX captures via SaaS + affiliate¹"
            amount="$3B / yr"
            widthPct={12}
            color={C.muted}
            delay={240}
          />
          <TamBar
            label="Adjacent · global fee-based advisor industry"
            sub="Reached when AI matures into portfolio guidance · US alone is $260B²"
            amount="~$1T / yr"
            widthPct={92}
            color={C.green}
            delay={340}
            highlight
          />
          <div
            data-cx-anim
            style={{
              padding: '14px 18px',
              background: 'rgba(51, 204, 122, 0.06)',
              border: `1px solid ${C.green}40`,
              borderLeft: `3px solid ${C.green}`,
              borderRadius: 8,
              fontSize: 15,
              color: C.text,
              lineHeight: 1.5,
              ...rise(460),
            }}
          >
            Even a fractional slice of the global advisor industry is a generational consumer-fintech outcome.
            ClaritX's research-SaaS + affiliate revenue today is the floor that protects against slower-disruption
            scenarios while we mature.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card delay={400} accent={C.green}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.22em', color: C.green, textTransform: 'uppercase' }}>
              The structural opening
            </div>
            <div style={{ fontSize: 16, color: C.text, marginTop: 8, lineHeight: 1.5, fontWeight: 600 }}>
              Human advisors are unit-economically locked to high-AUM clients.
            </div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 6, lineHeight: 1.5 }}>
              AI scales without that floor, the only economic path to the households today's industry can't serve.
            </div>
          </Card>
          <Card delay={460} accent={C.cyan}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.22em', color: C.cyan, textTransform: 'uppercase' }}>
              The proof retail will pay
            </div>
            <div style={{ fontSize: 16, color: C.text, marginTop: 8, lineHeight: 1.5, fontWeight: 600 }}>
              Robo-advisor adoption already pulls $1T+ in retail AUM worldwide.
            </div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 6, lineHeight: 1.5 }}>
              Retail will pay for matched, AI-driven investing, ClaritX brings the research layer they're missing.²
            </div>
          </Card>
        </div>
      </div>

      <Sources
        delay={620}
        items={[
          'Grand View Research · Online Investment Platform Market 2025',
          'Statista · Robo-Advisors 2025 forecast (global AUM)',
        ]}
      />
    </div>
    <Watermark />
    <PageNum n={8} />
  </div>
);

// ============================================================================
// PAGE 14, WHY HUMAN ADVISORS FAIL RETAIL
// ============================================================================

const AdvisorRow = ({
  dim,
  human,
  claritx,
  delay,
}: {
  dim: string;
  human: string;
  claritx: string;
  delay: number;
}) => (
  <div
    data-cx-anim
    style={{
      display: 'grid',
      gridTemplateColumns: '240px 1fr 1fr',
      gap: 24,
      alignItems: 'center',
      padding: '16px 24px',
      borderBottom: `1px solid ${C.ruleSoft}`,
      ...rise(delay),
    }}
  >
    <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.16em', color: C.dim, textTransform: 'uppercase' }}>
      {dim}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 17, color: C.muted }}>
      <span aria-hidden style={{ width: 6, height: 6, borderRadius: '50%', background: C.red, flexShrink: 0 }} />
      {human}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 17, color: C.text, fontWeight: 600 }}>
      <span aria-hidden style={{ width: 6, height: 6, borderRadius: '50%', background: C.green, flexShrink: 0 }} />
      {claritx}
    </div>
  </div>
);

const AdvisorComparison: Page = () => (
  <div style={fill}>
    <div style={{ position: 'absolute', inset: 0, padding: '74px 96px 100px' }}>
      <Eyebrow section="09 / 24">Why human advisors fail retail</Eyebrow>
      <Heading size={50}>
        The advisor model is built for <GreenAccent>the wealthy.</GreenAccent> Not the next hundreds of millions.
      </Heading>

      <div
        style={{
          marginTop: 32,
          border: `1px solid ${C.rule}`,
          borderRadius: 8,
          overflow: 'hidden',
          background: C.surfaceAlt,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '240px 1fr 1fr',
            gap: 24,
            padding: '14px 24px',
            background: C.surface,
            borderBottom: `1px solid ${C.rule}`,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.22em',
            color: C.dim,
            textTransform: 'uppercase',
          }}
        >
          <div>Dimension</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span aria-hidden style={{ width: 8, height: 8, borderRadius: '50%', background: C.red }} />
            Human advisor
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span aria-hidden style={{ width: 8, height: 8, borderRadius: '50%', background: C.green }} />
            ClaritX
          </div>
        </div>
        <AdvisorRow dim="Minimum entry" human="$500K–$1M AUM" claritx="$0 · free tier" delay={240} />
        <AdvisorRow dim="Annual fee" human="1.0–1.5% of AUM" claritx="$20 / mo flat, or free" delay={290} />
        <AdvisorRow dim="Time to a read" human="2–4 wk meeting cycle" claritx="70 seconds" delay={340} />
        <AdvisorRow dim="Availability" human="Mon–Fri · office hours" claritx="24 / 7 · instant" delay={390} />
        <AdvisorRow dim="Coverage" human="~50 holdings per book" claritx="13,000+ stocks" delay={440} />
        <AdvisorRow dim="Personalization" human="Quarterly review" claritx="Daily re-scoring per profile" delay={490} />
        <AdvisorRow dim="Bias" human="Commission · book bias · firm products" claritx="Same-cost analysis · sources cited" delay={540} />
        <AdvisorRow dim="Scale" human="1 advisor : ~100 clients" claritx="1 model : ∞ users · zero marginal cost" delay={590} />
      </div>

      <div
        data-cx-anim
        style={{
          marginTop: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          fontSize: 16,
          color: C.muted,
          ...rise(680),
        }}
      >
        <UpArrow size={20} />
        <span>
          <strong style={{ color: C.text }}>The 35M-household advice gap</strong> isn't a marketing problem. It's a unit-economics
          problem only AI can solve.
        </span>
      </div>
    </div>
    <Watermark />
    <PageNum n={9} />
  </div>
);

// ============================================================================
// PAGE 15, VISION · ALWAYS-ON ADVISOR
// ============================================================================

const StackLayer = ({
  num,
  name,
  title,
  bullets,
  status,
  delay,
}: {
  num: string;
  name: string;
  title: string;
  bullets: string[];
  status: 'live' | 'building' | 'next';
  delay: number;
}) => {
  const statusColor = status === 'live' ? C.green : status === 'building' ? C.cyan : C.dim;
  const statusLabel = status === 'live' ? 'Live' : status === 'building' ? 'Building' : 'Next';
  return (
    <div
      data-cx-anim
      style={{
        flex: 1,
        padding: '22px 24px',
        background: status === 'live' ? 'rgba(51, 204, 122, 0.06)' : C.surface,
        border: `1px solid ${status === 'live' ? C.green : C.rule}`,
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        position: 'relative',
        ...rise(delay),
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: -10,
          right: 18,
          background: statusColor,
          color: '#0a1020',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.22em',
          padding: '4px 8px',
          borderRadius: 3,
          textTransform: 'uppercase',
        }}
      >
        {statusLabel}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
        <span
          style={{
            fontFamily: 'var(--osd-font-display)',
            fontSize: 44,
            fontWeight: 600,
            color: statusColor,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {num}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.28em',
              color: C.dim,
              textTransform: 'uppercase',
            }}
          >
            Layer
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: '0.22em',
              color: statusColor,
              textTransform: 'uppercase',
            }}
          >
            {name}
          </div>
        </div>
      </div>
      <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 20, fontWeight: 600, color: C.text, letterSpacing: '-0.015em', lineHeight: 1.25 }}>
        {title}
      </div>
      <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {bullets.map((b) => (
          <li key={b} style={{ fontSize: 14, color: C.muted, lineHeight: 1.45 }}>{b}</li>
        ))}
      </ul>
    </div>
  );
};

const StackLayerRow = ({
  num,
  name,
  title,
  status,
  delay,
}: {
  num: string;
  name: string;
  title: string;
  status: 'live' | 'building';
  delay: number;
}) => {
  const statusColor = status === 'live' ? C.green : C.cyan;
  const statusLabel = status === 'live' ? 'Live' : 'Building';
  return (
    <div
      data-cx-anim
      style={{
        display: 'grid',
        gridTemplateColumns: '64px 120px 1fr 84px',
        gap: 18,
        alignItems: 'center',
        padding: '14px 18px',
        background: status === 'live' ? 'rgba(51, 204, 122, 0.04)' : C.surface,
        border: `1px solid ${C.rule}`,
        borderLeft: `3px solid ${statusColor}`,
        borderRadius: 8,
        ...rise(delay),
      }}
    >
      <span
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 30,
          fontWeight: 600,
          color: statusColor,
          letterSpacing: '-0.02em',
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1,
        }}
      >
        {num}
      </span>
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.24em',
          color: statusColor,
          textTransform: 'uppercase',
        }}
      >
        {name}
      </span>
      <span style={{ fontSize: 17, color: C.text, lineHeight: 1.35 }}>{title}</span>
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.22em',
          color: '#0a1020',
          background: statusColor,
          padding: '4px 8px',
          borderRadius: 3,
          textTransform: 'uppercase',
          textAlign: 'center',
        }}
      >
        {statusLabel}
      </span>
    </div>
  );
};

const VisionFuture: Page = () => (
  <div style={fill}>
    {/* Hero image as full slide background, banana-generated 4-layer stack with investor silhouette */}
    <img
      src={bananaStack}
      alt=""
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'left center',
      }}
    />
    {/* Right-side gradient overlay so content area on right is legible */}
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(90deg, rgba(10, 16, 32, 0.0) 0%, rgba(10, 16, 32, 0.0) 38%, rgba(10, 16, 32, 0.85) 55%, rgba(10, 16, 32, 0.97) 100%)',
      }}
    />

    {/* Content stacked on the right half */}
    <div
      style={{
        position: 'absolute',
        right: 96,
        top: 88,
        bottom: 110,
        width: 860,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <Eyebrow section="12 / 24">The clarity layer · the full stack</Eyebrow>
      <Heading size={46} maxWidth={860}>
        Four layers wrap the retail investor in <GreenAccent>end-to-end clarity.</GreenAccent>
      </Heading>
      <Lede maxWidth={860} delay={140}>
        From scanning a single ticker to a portfolio that adapts to live market forces, every layer powered by AI on
        live data, none of them sold separately.
      </Lede>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
        <StackLayerRow num="01" name="Scan" title="9-angle AI read on any stock" status="live" delay={240} />
        <StackLayerRow num="02" name="Match" title="Portfolio matched to your life" status="live" delay={300} />
        <StackLayerRow num="03" name="Personalize" title="Every read re-scored to you" status="live" delay={360} />
        <StackLayerRow num="04" name="Adapt" title="Live portfolio sync + direct management" status="building" delay={420} />
      </div>

      <div
        data-cx-anim
        style={{
          marginTop: 14,
          padding: '14px 20px',
          background: 'rgba(16, 24, 48, 0.85)',
          border: `1px solid ${C.rule}`,
          borderLeft: `3px solid ${C.green}`,
          borderRadius: 8,
          fontSize: 15,
          color: C.text,
          lineHeight: 1.5,
          backdropFilter: 'blur(6px)',
          ...rise(540),
        }}
      >
        <strong style={{ color: C.green }}>No other product wraps all four.</strong>{' '}
        TradingView gives traders charts. TipRanks dumps analyst data. Robo-advisors allocate to ETFs. ClaritX is the
        only end-to-end stack, at unit economics no human advisor can match.
      </div>
    </div>
    <Watermark />
    <PageNum n={12} />
  </div>
);

// ============================================================================
// PAGE 6, AI MOAT, WHY US IN A SEA OF AI
// ============================================================================

const MoatCard = ({
  num,
  title,
  color,
  bullets,
  delay,
}: {
  num: string;
  title: string;
  color: string;
  bullets: string[];
  delay: number;
}) => (
  <div
    data-cx-anim
    style={{
      flex: 1,
      padding: '22px 22px 24px',
      background: C.surface,
      border: `1px solid ${C.rule}`,
      borderTop: `3px solid ${color}`,
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      ...rise(delay),
    }}
  >
    <div
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 40,
        fontWeight: 600,
        color,
        letterSpacing: '-0.02em',
        lineHeight: 1,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {num}
    </div>
    <div
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 20,
        fontWeight: 600,
        color: C.text,
        letterSpacing: '-0.015em',
        lineHeight: 1.2,
      }}
    >
      {title}
    </div>
    <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {bullets.map((b) => (
        <li key={b} style={{ fontSize: 14, color: C.muted, lineHeight: 1.45 }}>{b}</li>
      ))}
    </ul>
  </div>
);

const AIMoat: Page = () => (
  <div style={fill}>
    {/* Full-slide hero image: AI grounded into bedrock of live market data */}
    <img
      src={bananaAIGrounding}
      alt=""
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'left center',
      }}
    />
    {/* Right-side gradient overlay so content stays legible */}
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(90deg, rgba(10,16,32,0.0) 0%, rgba(10,16,32,0.0) 32%, rgba(10,16,32,0.85) 50%, rgba(10,16,32,0.97) 100%)',
      }}
    />

    {/* Content stacked on the right half */}
    <div
      style={{
        position: 'absolute',
        right: 96,
        top: 74,
        bottom: 100,
        width: 940,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <Eyebrow section="11 / 24">Our moat · why us</Eyebrow>
      <Heading size={48} maxWidth={940}>
        Everyone says "AI". We do <GreenAccent>AI grounding.</GreenAccent>
      </Heading>
      <Lede maxWidth={940} delay={140}>
        Most "AI investing" products bolt a chatbot onto stale training data and ship. ClaritX grounds the model in
        live market data, scans thousands of stocks daily, and self-corrects against realized outcomes.
      </Lede>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 18 }}>
        <MoatCard
          num="01"
          color={C.green}
          title="Grounded in live data"
          delay={240}
          bullets={[
            'Real-time prices, earnings, filings, macro feeds',
            'Every read traceable to a primary source',
            'No hallucination, no stale training cutoff',
          ]}
        />
        <MoatCard
          num="02"
          color={C.cyan}
          title="Thousands of stocks, every day"
          delay={300}
          bullets={[
            'Efficient parallel pipeline across the universe',
            'Cross-stock and cross-asset comparisons',
            'Relative ranking baked into every signal',
          ]}
        />
        <MoatCard
          num="03"
          color={C.amber}
          title="Live test loop"
          delay={360}
          bullets={[
            'Each read evaluated against realized price action',
            'Model accuracy refines on real market outcomes',
            'Currently in a multi-month live test cycle',
          ]}
        />
        <MoatCard
          num="04"
          color={C.muted}
          title="Medium-to-long horizon"
          delay={420}
          bullets={[
            'Built for 6-month to multi-year decisions',
            'Not day-trading, not momentum hype',
            'Less noise, more conviction',
          ]}
        />
      </div>

      <div
        data-cx-anim
        style={{
          marginTop: 14,
          padding: '14px 20px',
          background: 'rgba(16,24,48,0.85)',
          border: `1px solid ${C.rule}`,
          borderLeft: `3px solid ${C.green}`,
          borderRadius: 8,
          fontSize: 15,
          color: C.text,
          lineHeight: 1.5,
          backdropFilter: 'blur(6px)',
          ...rise(540),
        }}
      >
        <strong style={{ color: C.green }}>While others ship hype, we ship grounded clarity.</strong>{' '}
        AI is only as good as the data it stands on. Ours stands on the live market, every trading day.
      </div>
    </div>
    <Watermark />
    <PageNum n={11} />
  </div>
);

// ============================================================================
// EXPORTS
// ============================================================================

export const meta: SlideMeta = {
  title: 'ClaritX, Vision Brief (v5 · 2026)',
};

export default [
  // Hook + Pain (1-5)
  Cover,
  Underperformance,
  Pain,
  Finfluencer,
  Competitive,
  // Market + Competitive landscape (6-10)
  WhyNow,
  Market,
  AdvisorTam,
  AdvisorComparison,
  MagnifiComp,
  // Our product (11-16)
  AIMoat,
  VisionFuture,
  ProductVerdict,
  Portfolio,
  RiskPersonality,
  FlywheelSlide,
  // Business model + plan (17-20)
  Monetization,
  Pricing,
  Funds,
  Roadmap,
  // Who + close (21-24)
  Team,
  Philosophy,
  Ask,
  Closing,
] satisfies Page[];
