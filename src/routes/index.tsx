import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Brain, Database, MessageSquare, LineChart, PieChart, Lightbulb,
  Sparkles, Search, ArrowRight, Cpu, Rocket, CheckCircle2, Star,
  ThumbsUp, Eye, Activity, Zap, ShieldCheck, Github,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sentilytics — YouTube Sentiment Intelligence" },
      { name: "description", content: "AI-powered sentiment and engagement analysis for YouTube videos. Know what audiences truly think — before you press play." },
    ],
  }),
  component: Index,
});

type Sentiment = "positive" | "mixed" | "negative";
type Tone = "positive" | "neutral" | "negative";

interface Result {
  sentiment: Sentiment;
  title: string;
  description: string;
  positive: number;
  neutral: number;
  negative: number;
  engagement: number;
  likes: number;
  views: number;
  score: number;
  comments: { author: string; comment: string; tone: Tone }[];
  ai_verdict?: string;
}

const SAMPLE_COMMENTS: Record<Sentiment, { author: string; comment: string; tone: Tone }[]> = {
  positive: [
    { author: "@maya.codes", comment: "This is the clearest breakdown I've seen all year. Bookmarked.", tone: "positive" },
    { author: "@devon_w", comment: "Production quality is insane. Worth every second.", tone: "positive" },
    { author: "@priya.s", comment: "Finally a creator who respects our time. Subscribed.", tone: "positive" },
    { author: "@arjun", comment: "The chapter at 7:42 deserves its own video. Brilliant.", tone: "positive" },
    { author: "@lena", comment: "Sharing this with my whole team tomorrow.", tone: "neutral" },
  ],
  mixed: [
    { author: "@nora", comment: "Good info, but the pacing in the middle drags a bit.", tone: "neutral" },
    { author: "@kojima", comment: "Loved the intro, lost me at the ad break.", tone: "neutral" },
    { author: "@theo.r", comment: "Solid takes. Audio could be tighter.", tone: "neutral" },
    { author: "@sami", comment: "Some great points — disagree on the last conclusion though.", tone: "negative" },
    { author: "@hannah", comment: "Useful for beginners. Felt surface-level for me.", tone: "neutral" },
  ],
  negative: [
    { author: "@rk_2024", comment: "Clickbait title. Nothing here matches the thumbnail.", tone: "negative" },
    { author: "@quinn", comment: "10 minutes of filler for a 30-second answer.", tone: "negative" },
    { author: "@bea", comment: "Factually wrong at 4:15 — please correct.", tone: "negative" },
    { author: "@jordan", comment: "Sponsorship took up half the video.", tone: "negative" },
    { author: "@mira", comment: "Disappointed. Expected more depth from this channel.", tone: "negative" },
  ],
};

function mockAnalyze(url: string): Result {
  // Deterministic-ish bucket from URL hash
  let h = 0;
  for (let i = 0; i < url.length; i++) h = (h * 31 + url.charCodeAt(i)) | 0;
  const bucket = Math.abs(h) % 3;
  const sentiment: Sentiment = bucket === 0 ? "positive" : bucket === 1 ? "mixed" : "negative";

  const presets = {
    positive: { p: 78, ne: 14, n: 8, eng: 9.4, score: 8.7, title: "Highly Recommended", desc: "Audience response is overwhelmingly positive. Comment patterns show genuine appreciation, repeat viewing, and strong recommendation intent." },
    mixed:    { p: 47, ne: 33, n: 20, eng: 5.6, score: 6.3, title: "Mixed Reception",     desc: "Engagement is healthy but opinions are divided. Viewers appreciate parts of the content while flagging meaningful concerns." },
    negative: { p: 21, ne: 22, n: 57, eng: 3.2, score: 3.4, title: "Proceed With Caution", desc: "Sentiment trends sharply negative. Recurring complaints suggest the video may not deliver on its premise — a quick read of the comments first is recommended." },
  } as const;

  const r = presets[sentiment];
  return {
    sentiment,
    title: r.title,
    description: r.desc,
    positive: r.p, neutral: r.ne, negative: r.n,
    engagement: r.eng,
    likes: 12_000 + (Math.abs(h) % 480_000),
    views: 320_000 + (Math.abs(h) % 4_800_000),
    score: r.score,
    comments: SAMPLE_COMMENTS[sentiment],
  };
}

function Index() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentUrls, setRecentUrls] = useState<string[]>([]);

  async function onAnalyze() {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return;

    setRecentUrls((prev) => [trimmedUrl, ...prev.filter((item) => item !== trimmedUrl)].slice(0, 3));
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiBase}/analyze?url=${encodeURIComponent(trimmedUrl)}`);
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setResult(data as Result);
    } catch (err: any) {
      console.error("Failed to fetch live analysis:", err);
      setError(err.message || "Could not connect to analysis backend. Please make sure your Python Flask server is running at http://localhost:5000.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#top" className="flex items-center gap-2">
            <LogoMark />
            <span className="font-display text-xl tracking-tight">Sentilytics</span>
          </a>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="#overview" className="hover:text-foreground transition">Overview</a>
            <a href="#capabilities" className="hover:text-foreground transition">Capabilities</a>
            <a href="#applications" className="hover:text-foreground transition">Applications</a>
            <a href="#demo" className="hover:text-foreground transition">Try the demo</a>
          </nav>
          <a href="#demo" className="group inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface px-4 py-2 text-sm transition hover:border-primary/60 hover:bg-surface-elevated">
            Analyze a video
            <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
          </a>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent 75%)",
          }}
        />

        <div className="mx-auto max-w-7xl px-6 pt-24 pb-28 md:pt-32 md:pb-36">
          <div className="mx-auto max-w-3xl text-center animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-surface/60 px-3.5 py-1.5 text-xs uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              AI · NLP · YouTube Intelligence
            </span>

            <h1 className="mt-8 font-display text-5xl leading-[1.05] text-balance md:text-7xl">
              Know what audiences <em className="italic text-primary">truly think</em>
              <br className="hidden md:block" /> before you press play.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-balance text-base text-muted-foreground md:text-lg">
              Sentilytics reads thousands of YouTube comments in seconds — fusing BERT-grade sentiment
              models with engagement signals to give you a single, honest verdict on any video.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#demo"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow)] transition hover:brightness-110"
              >
                <Sparkles className="h-4 w-4" />
                Try the live demo
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </a>
              <a
                href="#overview"
                className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/60 px-6 py-3 text-sm text-foreground/90 backdrop-blur transition hover:bg-surface-elevated"
              >
                How it works
              </a>
            </div>

            <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5" /> Privacy-first</span>
              <span className="inline-flex items-center gap-2"><Zap className="h-3.5 w-3.5" /> Sub-second insight</span>
              <span className="inline-flex items-center gap-2"><Cpu className="h-3.5 w-3.5" /> BERT + VADER ensemble</span>
            </div>
          </div>

          {/* Hero preview card */}
          <div className="mx-auto mt-20 max-w-5xl animate-fade-up" style={{ animationDelay: "120ms" }}>
            <HeroPreview />
          </div>
        </div>
      </section>

      {/* OVERVIEW */}
      <Section id="overview" eyebrow="01 — Overview" title="An honest second opinion on every video.">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="glass rounded-2xl p-8 lg:col-span-2">
            <p className="font-display text-2xl leading-snug text-foreground/90 md:text-3xl">
              We built Sentilytics to fix a small but daily frustration — wasting ten minutes on a
              video the comments would have warned you about.
            </p>
            <p className="mt-6 text-muted-foreground">
              The system pulls the top comments and engagement signals for any YouTube URL, runs them
              through a sentiment ensemble, and folds the results into a single composite score. The
              output is short, clear, and useful: a verdict, the supporting numbers, and the comments
              that shaped them.
            </p>
          </div>
          <div className="glass rounded-2xl p-8">
            <IconChip><Brain className="h-5 w-5" /></IconChip>
            <h4 className="mt-5 font-display text-2xl">AI-powered analysis</h4>
            <p className="mt-3 text-sm text-muted-foreground">
              A BERT + VADER ensemble classifies tone at the comment level, then aggregates with
              engagement weighting for stability against brigading and bot noise.
            </p>
          </div>
        </div>
      </Section>

      {/* CAPABILITIES */}
      <Section id="capabilities" eyebrow="02 — Capabilities" title="Five quiet superpowers, working together.">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 md:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Database, t: "Data collection", d: "Pulls comments and engagement metrics via the YouTube Data API." },
            { icon: MessageSquare, t: "Sentiment analysis", d: "Classifies each comment as positive, neutral, or negative with confidence scores." },
            { icon: LineChart, t: "Metric integration", d: "Blends sentiment with like-to-view and comment ratios into one composite score." },
            { icon: PieChart, t: "Result visualization", d: "Distribution charts and a one-glance verdict — never a wall of numbers." },
            { icon: Lightbulb, t: "Insight delivery", d: "Plain-language summaries that explain why a score landed where it did." },
            { icon: Activity, t: "Engagement weighting", d: "Comments from highly-liked threads count more than drive-by reactions." },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="group bg-background p-7 transition hover:bg-surface">
              <IconChip><Icon className="h-5 w-5" /></IconChip>
              <h4 className="mt-5 text-base font-medium">{t}</h4>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* APPLICATIONS */}
      <Section id="applications" eyebrow="03 — Domain & Applications" title="Where Sentilytics fits.">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass rounded-2xl p-8">
            <IconChip><Cpu className="h-5 w-5" /></IconChip>
            <h4 className="mt-5 font-display text-2xl">AI & Machine Learning</h4>
            <p className="mt-3 text-sm text-muted-foreground">
              Operating at the intersection of NLP, data science, and product engineering.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {["Natural Language Processing","Sentiment classification","Data preprocessing & cleaning","Predictive modeling","Visualization & reporting"].map((x) => (
                <li key={x} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-positive" />
                  <span className="text-foreground/90">{x}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="glass rounded-2xl p-8">
            <IconChip><Rocket className="h-5 w-5" /></IconChip>
            <h4 className="mt-5 font-display text-2xl">Where it goes next</h4>
            <ul className="mt-6 space-y-4 text-sm">
              {[
                ["Browser extension", "Overlay sentiment insights directly on YouTube pages."],
                ["Web dashboard", "Standalone platform for video quality analysis."],
                ["API service", "Sentiment metadata as an integration primitive."],
                ["Creator tools", "Help creators understand audience reception at depth."],
                ["Education platforms", "Filter and rank high-signal educational content."],
              ].map(([t, d]) => (
                <li key={t} className="flex items-start gap-3">
                  <Star className="mt-0.5 h-4 w-4 text-accent" />
                  <div>
                    <div className="font-medium">{t}</div>
                    <div className="text-muted-foreground">{d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* DEMO */}
      <section id="demo" className="relative py-28">
        <div className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, oklch(0.65 0.24 27 / 0.10), transparent 70%)" }} />
        <div className="mx-auto max-w-6xl px-6">
          <Eyebrow>04 — Live demo</Eyebrow>
          <h2 className="mt-3 max-w-3xl font-display text-4xl md:text-5xl text-balance">
            Paste a URL. Get a verdict.
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            This preview runs on simulated data so you can feel the interface. Connect your Flask
            backend at <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">/analyze</code> to make it live.
          </p>

          <div className="glass mt-10 rounded-3xl p-2 shadow-[var(--shadow-elevated)]">
            <div className="flex flex-col gap-2 rounded-[1.25rem] bg-surface/80 p-3 sm:flex-row">
              <div className="flex flex-1 items-center gap-3 rounded-2xl bg-background/80 px-4 py-3 ring-1 ring-border/60 focus-within:ring-2 focus-within:ring-primary/60">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onAnalyze()}
                  placeholder="https://www.youtube.com/watch?v=…"
                  className="w-full bg-transparent text-sm placeholder:text-muted-foreground/70 focus:outline-none"
                />
              </div>
              <button
                onClick={onAnalyze}
                disabled={loading || !url.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Analyzing…" : <>Analyze video <ArrowRight className="h-4 w-4" /></>}
              </button>
            </div>

            <div className="mt-2 flex flex-wrap gap-2 px-2 pb-2">
              {recentUrls.length > 0 && <span className="text-xs text-muted-foreground">Recent:</span>}
              {recentUrls.map((u) => (
                <button
                  key={u}
                  onClick={() => setUrl(u)}
                  className="rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
                >
                  {u.replace("https://", "")}
                </button>
              ))}
            </div>
          </div>

          {/* Output */}
          <div className="mt-10 min-h-[200px]">
            {loading && <LoadingState />}
            {!loading && error && (
              <div className="glass rounded-2xl p-8 border border-red-500/20 bg-red-500/5 text-center text-red-400">
                <p className="font-medium">Failed to analyze video</p>
                <p className="mt-1 text-sm text-red-400/80">{error}</p>
              </div>
            )}
            {!loading && !error && result && <ResultsView result={result} />}
            {!loading && !error && !result && <EmptyState />}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-20 border-t border-border/60">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <LogoMark />
              <span className="font-display text-xl">Sentilytics</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              An AI-powered second opinion on YouTube videos. Sentiment, engagement, and a single
              honest verdict.
            </p>
          </div>
          <div className="text-sm">
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Project</div>
            <ul className="mt-4 space-y-2">
              <li><span className="text-muted-foreground">Domain</span> · AI & Machine Learning</li>
              <li><span className="text-muted-foreground">Stack</span> · Python · NLP · YouTube API</li>
              <li><span className="text-muted-foreground">Built by</span> · Aditya Sharma, Adarsh Prajapati</li>
            </ul>
          </div>
          <div className="text-sm md:text-right">
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Connect</div>
            <a href="#" className="mt-4 inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 transition hover:border-primary/60">
              <Github className="h-4 w-4" /> View on GitHub
            </a>
          </div>
        </div>
        <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Sentilytics. Crafted with care.
        </div>
      </footer>
    </div>
  );
}

/* ---------- subcomponents ---------- */

function LogoMark() {
  return (
    <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[oklch(0.55_0.22_15)] shadow-[var(--shadow-glow)]">
      <span className="h-2.5 w-2.5 rounded-[3px] bg-primary-foreground" />
    </span>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{children}</span>
  );
}

function Section({ id, eyebrow, title, children }: { id?: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-12 max-w-3xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-3 font-display text-4xl text-balance md:text-5xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function IconChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-surface text-primary">
      {children}
    </span>
  );
}

function HeroPreview() {
  const sample = useMemo(() => mockAnalyze("preview-hero"), []);
  return (
    <div className="glass rounded-3xl p-2 shadow-[var(--shadow-elevated)]">
      <div className="rounded-[1.25rem] bg-surface/70 p-6 sm:p-8">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-mono">sentilytics // preview</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-positive" />
            Live model
          </span>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-[1.1fr_1fr]">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Verdict</div>
            <div className="mt-3 font-display text-4xl text-balance">{sample.title}</div>
            <p className="mt-3 text-sm text-muted-foreground">{sample.description}</p>
            <div className="mt-6">
              <DistributionBar p={sample.positive} ne={sample.neutral} n={sample.negative} />
              <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                <span><b className="text-positive">{sample.positive}%</b> positive</span>
                <span><b className="text-neutral">{sample.neutral}%</b> neutral</span>
                <span><b className="text-negative">{sample.negative}%</b> negative</span>
              </div>
            </div>
          </div>
          <ScoreDial score={sample.score} />
        </div>
      </div>
    </div>
  );
}

function DistributionBar({ p, ne, n }: { p: number; ne: number; n: number }) {
  return (
    <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-surface-elevated">
      <div style={{ width: `${p}%`, background: "var(--positive)" }} />
      <div style={{ width: `${ne}%`, background: "var(--neutral)" }} />
      <div style={{ width: `${n}%`, background: "var(--negative)" }} />
    </div>
  );
}

function ScoreDial({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(100, (score / 10) * 100));
  const stroke = score >= 7 ? "var(--positive)" : score >= 5 ? "var(--neutral)" : "var(--negative)";
  const C = 2 * Math.PI * 52;
  return (
    <div className="flex items-center justify-center">
      <div className="relative h-48 w-48">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r="52" stroke="var(--border)" strokeWidth="8" fill="none" />
          <circle
            cx="60" cy="60" r="52" fill="none" strokeWidth="8" strokeLinecap="round"
            stroke={stroke} strokeDasharray={C} strokeDashoffset={C - (pct / 100) * C}
            style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="font-display text-5xl">{score.toFixed(1)}</div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">composite score</div>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="glass flex items-center gap-4 rounded-2xl p-8">
      <div className="relative h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
      </div>
      <div>
        <div className="text-sm font-medium">Reading comments and engagement signals…</div>
        <div className="mt-1 text-xs text-muted-foreground">Aggregating sentiment across the top discussion threads.</div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="glass rounded-2xl p-10 text-center">
      <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-surface text-muted-foreground">
        <Sparkles className="h-5 w-5" />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">Drop a YouTube URL above to see the verdict, score, distribution, and the comments that drove them.</p>
    </div>
  );
}

function ResultsView({ result }: { result: Result }) {
  const gradientMap: Record<Sentiment, string> = {
    positive: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
    mixed: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    negative: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  };

  const shadowMap: Record<Sentiment, string> = {
    positive: "0 15px 35px rgba(132, 250, 176, 0.3)",
    mixed: "0 15px 35px rgba(250, 112, 154, 0.3)",
    negative: "0 15px 35px rgba(245, 87, 108, 0.3)",
  };

  const iconMap: Record<Sentiment, string> = {
    positive: "😊",
    mixed: "😐",
    negative: "😞",
  };

  return (
    <div className="animate-fade-up" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Two equal-height columns */}
      <div className="results-two-col">
        {/* LEFT: Sentiment & Metrics Card */}
        <div
          className="result-sentiment-card"
          style={{
            background: gradientMap[result.sentiment],
            borderRadius: "1.5rem",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            boxShadow: shadowMap[result.sentiment],
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }} className="animate-float-slow">
            {iconMap[result.sentiment]}
          </div>
          <h3
            style={{
              fontSize: "2.2rem",
              fontWeight: 800,
              color: "#1a1a2e",
              marginBottom: "0.75rem",
              lineHeight: 1.15,
            }}
          >
            {result.title}
          </h3>
          <p style={{ color: "rgba(0,0,0,0.65)", fontSize: "1rem", marginBottom: "1.5rem" }}>
            {result.description}
          </p>

          {/* Metric cards row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "0.75rem",
              width: "100%",
            }}
          >
            {[
              { label: "Positive Sentiment", value: `${result.positive}%` },
              { label: "Engagement Rate", value: `${result.engagement}%` },
              { label: "Likes", value: formatCompact(result.likes) },
              { label: "Views", value: formatCompact(result.views) },
            ].map((m) => (
              <div
                key={m.label}
                className="result-metric-card"
                style={{
                  background: "rgba(255,255,255,0.9)",
                  borderRadius: "1.25rem",
                  padding: "1rem 0.5rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  minHeight: "5.5rem",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                <div
                  style={{
                    fontSize: "1.35rem",
                    fontWeight: 800,
                    background: "linear-gradient(45deg, #FF006E, #8338EC)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    marginBottom: "0.25rem",
                  }}
                >
                  {m.value}
                </div>
                <div
                  style={{
                    color: "#666",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    lineHeight: 1.3,
                    textAlign: "center",
                  }}
                >
                  {m.label}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "1rem", fontSize: "0.8rem", color: "rgba(0,0,0,0.45)" }}>
            Analysis based on comment sentiment and engagement metrics
          </div>
        </div>

        {/* RIGHT: Comments Card */}
        <div
          className="result-comments-card"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,240,255,0.95) 100%)",
            borderRadius: "1.5rem",
            padding: "2rem",
            paddingBottom: "0.5rem",
            boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
            position: "relative",
            overflow: "hidden",
            border: "2px solid rgba(255,255,255,0.5)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Gradient top bar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "4px",
              background: "linear-gradient(90deg, #FF006E, #8338EC, #3A86FF, #06FFB4)",
              backgroundSize: "300% 100%",
              animation: "shimmer 3s ease infinite",
            }}
          />
          <div style={{ marginBottom: "1rem" }}>
            <h4
              style={{
                fontSize: "1.6rem",
                fontWeight: 700,
                color: "#333",
                paddingBottom: "0.75rem",
                position: "relative",
              }}
            >
              Top {result.comments.length} Comments
              <span
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "60px",
                  height: "3px",
                  background: "linear-gradient(90deg, #FF006E, #8338EC)",
                  borderRadius: "3px",
                }}
              />
            </h4>
          </div>

          {/* Scrollable comments list */}
          <div className="comments-scroll-list">
            {result.comments.map((c, i) => (
              <div
                key={i}
                className="comment-item-card"
                style={{
                  padding: "1rem 1.25rem",
                  marginBottom: "0.75rem",
                  background: "rgba(255,255,255,0.7)",
                  borderRadius: "0.9rem",
                  borderLeft: "4px solid transparent",
                  transition: "all 0.3s ease",
                  position: "relative",
                  cursor: "default",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color: "#FF006E",
                    marginBottom: "0.4rem",
                    fontSize: "0.95rem",
                  }}
                >
                  @{c.author.replace(/^@/, "")}
                </div>
                <div
                  style={{
                    color: "#555",
                    fontSize: "0.9rem",
                    lineHeight: 1.6,
                    paddingRight: "2rem",
                  }}
                >
                  {c.comment}
                </div>
                <span
                  style={{
                    position: "absolute",
                    right: "1rem",
                    top: "1rem",
                    opacity: 0.25,
                    fontSize: "1.3rem",
                  }}
                >
                  💬
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Verdict - full width below */}
      {result.ai_verdict && (
        <div
          className="ai-verdict-card"
          style={{
            background: "linear-gradient(135deg, rgba(212, 240, 255, 0.95), rgba(230, 255, 245, 0.95))",
            borderRadius: "1rem",
            padding: "1.5rem 2rem",
            boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
            border: "1px solid rgba(0, 180, 220, 0.2)",
          }}
        >
          <h4
            style={{
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "#0c5460",
              marginBottom: "0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            🤖 AI Content Verdict
          </h4>
          <p style={{ color: "#333", fontSize: "1.05rem", lineHeight: 1.65, margin: 0 }}>
            {result.ai_verdict}
          </p>
        </div>
      )}
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-surface/60 p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="mt-2 font-display text-2xl">{value}</div>
    </div>
  );
}

function ToneBadge({ tone }: { tone: Tone }) {
  const map: Record<Tone, { c: string; t: string }> = {
    positive: { c: "text-positive", t: "positive" },
    neutral: { c: "text-neutral", t: "neutral" },
    negative: { c: "text-negative", t: "negative" },
  };
  const m = map[tone];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] ${m.c}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {m.t}
    </span>
  );
}

function formatCompact(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}
