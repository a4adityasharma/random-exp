import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as ArrowRight, S as Sparkles, a as ShieldCheck, Z as Zap, C as Cpu, B as Brain, D as Database, M as MessageSquare, b as ChartLine, c as ChartPie, L as Lightbulb, d as Activity, e as CircleCheck, R as Rocket, f as Star, g as Search, G as Github } from "../_libs/lucide-react.mjs";
const SAMPLE_COMMENTS = {
  positive: [{
    author: "@maya.codes",
    comment: "This is the clearest breakdown I've seen all year. Bookmarked.",
    tone: "positive"
  }, {
    author: "@devon_w",
    comment: "Production quality is insane. Worth every second.",
    tone: "positive"
  }, {
    author: "@priya.s",
    comment: "Finally a creator who respects our time. Subscribed.",
    tone: "positive"
  }, {
    author: "@arjun",
    comment: "The chapter at 7:42 deserves its own video. Brilliant.",
    tone: "positive"
  }, {
    author: "@lena",
    comment: "Sharing this with my whole team tomorrow.",
    tone: "neutral"
  }],
  mixed: [{
    author: "@nora",
    comment: "Good info, but the pacing in the middle drags a bit.",
    tone: "neutral"
  }, {
    author: "@kojima",
    comment: "Loved the intro, lost me at the ad break.",
    tone: "neutral"
  }, {
    author: "@theo.r",
    comment: "Solid takes. Audio could be tighter.",
    tone: "neutral"
  }, {
    author: "@sami",
    comment: "Some great points — disagree on the last conclusion though.",
    tone: "negative"
  }, {
    author: "@hannah",
    comment: "Useful for beginners. Felt surface-level for me.",
    tone: "neutral"
  }],
  negative: [{
    author: "@rk_2024",
    comment: "Clickbait title. Nothing here matches the thumbnail.",
    tone: "negative"
  }, {
    author: "@quinn",
    comment: "10 minutes of filler for a 30-second answer.",
    tone: "negative"
  }, {
    author: "@bea",
    comment: "Factually wrong at 4:15 — please correct.",
    tone: "negative"
  }, {
    author: "@jordan",
    comment: "Sponsorship took up half the video.",
    tone: "negative"
  }, {
    author: "@mira",
    comment: "Disappointed. Expected more depth from this channel.",
    tone: "negative"
  }]
};
function mockAnalyze(url) {
  let h = 0;
  for (let i = 0; i < url.length; i++) h = h * 31 + url.charCodeAt(i) | 0;
  const bucket = Math.abs(h) % 3;
  const sentiment = bucket === 0 ? "positive" : bucket === 1 ? "mixed" : "negative";
  const presets = {
    positive: {
      p: 78,
      ne: 14,
      n: 8,
      eng: 9.4,
      score: 8.7,
      title: "Highly Recommended",
      desc: "Audience response is overwhelmingly positive. Comment patterns show genuine appreciation, repeat viewing, and strong recommendation intent."
    },
    mixed: {
      p: 47,
      ne: 33,
      n: 20,
      eng: 5.6,
      score: 6.3,
      title: "Mixed Reception",
      desc: "Engagement is healthy but opinions are divided. Viewers appreciate parts of the content while flagging meaningful concerns."
    },
    negative: {
      p: 21,
      ne: 22,
      n: 57,
      eng: 3.2,
      score: 3.4,
      title: "Proceed With Caution",
      desc: "Sentiment trends sharply negative. Recurring complaints suggest the video may not deliver on its premise — a quick read of the comments first is recommended."
    }
  };
  const r = presets[sentiment];
  return {
    sentiment,
    title: r.title,
    description: r.desc,
    positive: r.p,
    neutral: r.ne,
    negative: r.n,
    engagement: r.eng,
    likes: 12e3 + Math.abs(h) % 48e4,
    views: 32e4 + Math.abs(h) % 48e5,
    score: r.score,
    comments: SAMPLE_COMMENTS[sentiment]
  };
}
function Index() {
  const [url, setUrl] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [result, setResult] = reactExports.useState(null);
  const [error, setError] = reactExports.useState(null);
  const [recentUrls, setRecentUrls] = reactExports.useState(() => {
    try {
      const stored = localStorage.getItem("recent_urls");
      if (stored) return JSON.parse(stored);
    } catch (e) {
    }
    return [];
  });
  async function onAnalyze() {
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    setRecentUrls((prev) => {
      const updated = [url.trim(), ...prev.filter((u) => u !== url.trim())].slice(0, 3);
      try {
        localStorage.setItem("recent_urls", JSON.stringify(updated));
      } catch (e) {
      }
      return updated;
    });
    try {
      const apiBase = "http://localhost:5000";
      const response = await fetch(`${apiBase}/analyze?url=${encodeURIComponent(url.trim())}`);
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Failed to fetch live analysis:", err);
      setError(err.message || "Could not connect to analysis backend. Please make sure your Python Flask server is running at http://localhost:5000.");
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-7xl items-center justify-between px-6 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "#top", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LogoMark, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl tracking-tight", children: "Sentilytics" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "hidden items-center gap-8 text-sm text-muted-foreground md:flex", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#overview", className: "hover:text-foreground transition", children: "Overview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#capabilities", className: "hover:text-foreground transition", children: "Capabilities" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#applications", className: "hover:text-foreground transition", children: "Applications" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#demo", className: "hover:text-foreground transition", children: "Try the demo" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "#demo", className: "group inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface px-4 py-2 text-sm transition hover:border-primary/60 hover:bg-surface-elevated", children: [
        "Analyze a video",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5 transition group-hover:translate-x-0.5" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "top", className: "relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 -z-10", style: {
        background: "var(--gradient-hero)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 -z-10 opacity-[0.04]", style: {
        backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
        backgroundSize: "64px 64px",
        maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent 75%)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-6 pt-24 pb-28 md:pt-32 md:pb-36", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl text-center animate-fade-up", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2 rounded-full border border-border/60 bg-surface/60 px-3.5 py-1.5 text-xs uppercase tracking-[0.18em] text-muted-foreground backdrop-blur", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative flex h-1.5 w-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" })
            ] }),
            "AI · NLP · YouTube Intelligence"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-8 font-display text-5xl leading-[1.05] text-balance md:text-7xl", children: [
            "Know what audiences ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("em", { className: "italic text-primary", children: "truly think" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", { className: "hidden md:block" }),
            " before you press play."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-6 max-w-2xl text-balance text-base text-muted-foreground md:text-lg", children: "Sentilytics reads thousands of YouTube comments in seconds — fusing BERT-grade sentiment models with engagement signals to give you a single, honest verdict on any video." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex flex-wrap items-center justify-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "#demo", className: "group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow)] transition hover:brightness-110", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }),
              "Try the live demo",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 transition group-hover:translate-x-0.5" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#overview", className: "inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/60 px-6 py-3 text-sm text-foreground/90 backdrop-blur transition hover:bg-surface-elevated", children: "How it works" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-[0.18em] text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3.5 w-3.5" }),
              " Privacy-first"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3.5 w-3.5" }),
              " Sub-second insight"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "h-3.5 w-3.5" }),
              " BERT + VADER ensemble"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mt-20 max-w-5xl animate-fade-up", style: {
          animationDelay: "120ms"
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeroPreview, {}) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { id: "overview", eyebrow: "01 — Overview", title: "An honest second opinion on every video.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-8 lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl leading-snug text-foreground/90 md:text-3xl", children: "We built Sentilytics to fix a small but daily frustration — wasting ten minutes on a video the comments would have warned you about." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-muted-foreground", children: "The system pulls the top comments and engagement signals for any YouTube URL, runs them through a sentiment ensemble, and folds the results into a single composite score. The output is short, clear, and useful: a verdict, the supporting numbers, and the comments that shaped them." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(IconChip, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "mt-5 font-display text-2xl", children: "AI-powered analysis" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "A BERT + VADER ensemble classifies tone at the comment level, then aggregates with engagement weighting for stability against brigading and bot noise." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { id: "capabilities", eyebrow: "02 — Capabilities", title: "Five quiet superpowers, working together.", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 md:grid-cols-2 lg:grid-cols-3", children: [{
      icon: Database,
      t: "Data collection",
      d: "Pulls comments and engagement metrics via the YouTube Data API."
    }, {
      icon: MessageSquare,
      t: "Sentiment analysis",
      d: "Classifies each comment as positive, neutral, or negative with confidence scores."
    }, {
      icon: ChartLine,
      t: "Metric integration",
      d: "Blends sentiment with like-to-view and comment ratios into one composite score."
    }, {
      icon: ChartPie,
      t: "Result visualization",
      d: "Distribution charts and a one-glance verdict — never a wall of numbers."
    }, {
      icon: Lightbulb,
      t: "Insight delivery",
      d: "Plain-language summaries that explain why a score landed where it did."
    }, {
      icon: Activity,
      t: "Engagement weighting",
      d: "Comments from highly-liked threads count more than drive-by reactions."
    }].map(({
      icon: Icon,
      t,
      d
    }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group bg-background p-7 transition hover:bg-surface", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(IconChip, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "mt-5 text-base font-medium", children: t }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm leading-relaxed text-muted-foreground", children: d })
    ] }, t)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { id: "applications", eyebrow: "03 — Domain & Applications", title: "Where Sentilytics fits.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(IconChip, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "mt-5 font-display text-2xl", children: "AI & Machine Learning" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "Operating at the intersection of NLP, data science, and product engineering." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-6 space-y-3 text-sm", children: ["Natural Language Processing", "Sentiment classification", "Data preprocessing & cleaning", "Predictive modeling", "Visualization & reporting"].map((x) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "mt-0.5 h-4 w-4 text-positive" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/90", children: x })
        ] }, x)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(IconChip, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Rocket, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "mt-5 font-display text-2xl", children: "Where it goes next" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-6 space-y-4 text-sm", children: [["Browser extension", "Overlay sentiment insights directly on YouTube pages."], ["Web dashboard", "Standalone platform for video quality analysis."], ["API service", "Sentiment metadata as an integration primitive."], ["Creator tools", "Help creators understand audience reception at depth."], ["Education platforms", "Filter and rank high-signal educational content."]].map(([t, d]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "mt-0.5 h-4 w-4 text-accent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: t }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: d })
          ] })
        ] }, t)) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "demo", className: "relative py-28", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 -z-10", style: {
        background: "radial-gradient(ellipse 70% 50% at 50% 0%, oklch(0.65 0.24 27 / 0.10), transparent 70%)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { children: "04 — Live demo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 max-w-3xl font-display text-4xl md:text-5xl text-balance", children: "Paste a URL. Get a verdict." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 max-w-2xl text-muted-foreground", children: [
          "This preview runs on simulated data so you can feel the interface. Connect your Flask backend at ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "rounded bg-surface px-1.5 py-0.5 font-mono text-xs", children: "/analyze" }),
          " to make it live."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass mt-10 rounded-3xl p-2 shadow-[var(--shadow-elevated)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 rounded-[1.25rem] bg-surface/80 p-3 sm:flex-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 items-center gap-3 rounded-2xl bg-background/80 px-4 py-3 ring-1 ring-border/60 focus-within:ring-2 focus-within:ring-primary/60", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: url, onChange: (e) => setUrl(e.target.value), onKeyDown: (e) => e.key === "Enter" && onAnalyze(), placeholder: "https://www.youtube.com/watch?v=…", className: "w-full bg-transparent text-sm placeholder:text-muted-foreground/70 focus:outline-none" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onAnalyze, disabled: loading || !url.trim(), className: "inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50", children: loading ? "Analyzing…" : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              "Analyze video ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
            ] }) })
          ] }),
          recentUrls.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2 px-2 pb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Recent:" }),
            recentUrls.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setUrl(u), className: "rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground transition hover:border-primary/50 hover:text-foreground", children: u.replace(/^https?:\/\//, "").replace(/^www\./, "") }, u))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 min-h-[200px]", children: [
          loading && /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingState, {}),
          !loading && error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-8 border border-red-500/20 bg-red-500/5 text-center text-red-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "Failed to analyze video" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-red-400/80", children: error })
          ] }),
          !loading && !error && result && /* @__PURE__ */ jsxRuntimeExports.jsx(ResultsView, { result }),
          !loading && !error && !result && /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, {})
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "mt-20 border-t border-border/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogoMark, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl", children: "Sentilytics" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 max-w-xs text-sm text-muted-foreground", children: "An AI-powered second opinion on YouTube videos. Sentiment, engagement, and a single honest verdict." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.18em] text-muted-foreground", children: "Project" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-4 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Domain" }),
              " · AI & Machine Learning"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Stack" }),
              " · Python · NLP · YouTube API"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Built by" }),
              " · Aditya Sharma, Adarsh Prajapati"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm md:text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.18em] text-muted-foreground", children: "Connect" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "#", className: "mt-4 inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 transition hover:border-primary/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Github, { className: "h-4 w-4" }),
            " View on GitHub"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/60 py-6 text-center text-xs text-muted-foreground", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Sentilytics. Crafted with care."
      ] })
    ] })
  ] });
}
function LogoMark() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[oklch(0.55_0.22_15)] shadow-[var(--shadow-glow)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2.5 w-2.5 rounded-[3px] bg-primary-foreground" }) });
}
function Eyebrow({
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-[0.22em] text-muted-foreground", children });
}
function Section({
  id,
  eyebrow,
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id, className: "mx-auto max-w-7xl px-6 py-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-12 max-w-3xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { children: eyebrow }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 font-display text-4xl text-balance md:text-5xl", children: title })
    ] }),
    children
  ] });
}
function IconChip({
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-surface text-primary", children });
}
function HeroPreview() {
  const sample = reactExports.useMemo(() => mockAnalyze("preview-hero"), []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-3xl p-2 shadow-[var(--shadow-elevated)]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-[1.25rem] bg-surface/70 p-6 sm:p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: "sentilytics // preview" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-positive" }),
        "Live model"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid gap-6 md:grid-cols-[1.1fr_1fr]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.2em] text-muted-foreground", children: "Verdict" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 font-display text-4xl text-balance", children: sample.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: sample.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DistributionBar, { p: sample.positive, ne: sample.neutral, n: sample.negative }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex justify-between text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { className: "text-positive", children: [
                sample.positive,
                "%"
              ] }),
              " positive"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { className: "text-neutral", children: [
                sample.neutral,
                "%"
              ] }),
              " neutral"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { className: "text-negative", children: [
                sample.negative,
                "%"
              ] }),
              " negative"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreDial, { score: sample.score })
    ] })
  ] }) });
}
function DistributionBar({
  p,
  ne,
  n
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-2.5 w-full overflow-hidden rounded-full bg-surface-elevated", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      width: `${p}%`,
      background: "var(--positive)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      width: `${ne}%`,
      background: "var(--neutral)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      width: `${n}%`,
      background: "var(--negative)"
    } })
  ] });
}
function ScoreDial({
  score
}) {
  const pct = Math.max(0, Math.min(100, score / 10 * 100));
  const stroke = score >= 7 ? "var(--positive)" : score >= 5 ? "var(--neutral)" : "var(--negative)";
  const C = 2 * Math.PI * 52;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-48 w-48", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 120 120", className: "h-full w-full -rotate-90", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "60", cy: "60", r: "52", stroke: "var(--border)", strokeWidth: "8", fill: "none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "60", cy: "60", r: "52", fill: "none", strokeWidth: "8", strokeLinecap: "round", stroke, strokeDasharray: C, strokeDashoffset: C - pct / 100 * C, style: {
        transition: "stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)"
      } })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-5xl", children: score.toFixed(1) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.2em] text-muted-foreground", children: "composite score" })
    ] })
  ] }) });
}
function LoadingState() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass flex items-center gap-4 rounded-2xl p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-3 w-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative inline-flex h-3 w-3 rounded-full bg-primary" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: "Reading comments and engagement signals…" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: "Aggregating sentiment across the top discussion threads." })
    ] })
  ] });
}
function EmptyState() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-10 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-surface text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-muted-foreground", children: "Drop a YouTube URL above to see the verdict, score, distribution, and the comments that drove them." })
  ] });
}
function ResultsView({
  result
}) {
  const gradientMap = {
    positive: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
    mixed: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    negative: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
  };
  const shadowMap = {
    positive: "0 15px 35px rgba(132, 250, 176, 0.3)",
    mixed: "0 15px 35px rgba(250, 112, 154, 0.3)",
    negative: "0 15px 35px rgba(245, 87, 108, 0.3)"
  };
  const iconMap = {
    positive: "😊",
    mixed: "😐",
    negative: "😞"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-up", style: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "results-two-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "result-sentiment-card", style: {
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
        position: "relative"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          fontSize: "4rem",
          marginBottom: "1rem"
        }, className: "animate-float-slow", children: iconMap[result.sentiment] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: {
          fontSize: "2.2rem",
          fontWeight: 800,
          color: "#1a1a2e",
          marginBottom: "0.75rem",
          lineHeight: 1.15
        }, children: result.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: {
          color: "rgba(0,0,0,0.65)",
          fontSize: "1rem",
          marginBottom: "1.5rem"
        }, children: result.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "0.75rem",
          width: "100%"
        }, children: [{
          label: "Positive Sentiment",
          value: `${result.positive}%`
        }, {
          label: "Engagement Rate",
          value: `${result.engagement}%`
        }, {
          label: "Likes",
          value: formatCompact(result.likes)
        }, {
          label: "Views",
          value: formatCompact(result.views)
        }].map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "result-metric-card", style: {
          background: "rgba(255,255,255,0.9)",
          borderRadius: "1.25rem",
          padding: "1rem 0.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          minHeight: "5.5rem",
          transition: "transform 0.3s ease, box-shadow 0.3s ease"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            fontSize: "1.35rem",
            fontWeight: 800,
            background: "linear-gradient(45deg, #FF006E, #8338EC)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "0.25rem"
          }, children: m.value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            color: "#666",
            fontSize: "0.75rem",
            fontWeight: 600,
            lineHeight: 1.3,
            textAlign: "center"
          }, children: m.label })
        ] }, m.label)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          marginTop: "1rem",
          fontSize: "0.8rem",
          color: "rgba(0,0,0,0.45)"
        }, children: "Analysis based on comment sentiment and engagement metrics" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "result-comments-card", style: {
        background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,240,255,0.95) 100%)",
        borderRadius: "1.5rem",
        padding: "2rem",
        paddingBottom: "0.5rem",
        boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
        position: "relative",
        overflow: "hidden",
        border: "2px solid rgba(255,255,255,0.5)",
        display: "flex",
        flexDirection: "column"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "4px",
          background: "linear-gradient(90deg, #FF006E, #8338EC, #3A86FF, #06FFB4)",
          backgroundSize: "300% 100%",
          animation: "shimmer 3s ease infinite"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          marginBottom: "1rem"
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { style: {
          fontSize: "1.6rem",
          fontWeight: 700,
          color: "#333",
          paddingBottom: "0.75rem",
          position: "relative"
        }, children: [
          "Top ",
          result.comments.length,
          " Comments",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "60px",
            height: "3px",
            background: "linear-gradient(90deg, #FF006E, #8338EC)",
            borderRadius: "3px"
          } })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "comments-scroll-list", children: result.comments.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "comment-item-card", style: {
          padding: "1rem 1.25rem",
          marginBottom: "0.75rem",
          background: "rgba(255,255,255,0.7)",
          borderRadius: "0.9rem",
          borderLeft: "4px solid transparent",
          transition: "all 0.3s ease",
          position: "relative",
          cursor: "default"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            fontWeight: 700,
            color: "#FF006E",
            marginBottom: "0.4rem",
            fontSize: "0.95rem"
          }, children: [
            "@",
            c.author.replace(/^@/, "")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            color: "#555",
            fontSize: "0.9rem",
            lineHeight: 1.6,
            paddingRight: "2rem"
          }, children: c.comment }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
            position: "absolute",
            right: "1rem",
            top: "1rem",
            opacity: 0.25,
            fontSize: "1.3rem"
          }, children: "💬" })
        ] }, i)) })
      ] })
    ] }),
    result.ai_verdict && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ai-verdict-card", style: {
      background: "linear-gradient(135deg, rgba(212, 240, 255, 0.95), rgba(230, 255, 245, 0.95))",
      borderRadius: "1rem",
      padding: "1.5rem 2rem",
      boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
      border: "1px solid rgba(0, 180, 220, 0.2)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { style: {
        fontSize: "1.3rem",
        fontWeight: 700,
        color: "#0c5460",
        marginBottom: "0.75rem",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem"
      }, children: "🤖 AI Content Verdict" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: {
        color: "#333",
        fontSize: "1.05rem",
        lineHeight: 1.65,
        margin: 0
      }, children: result.ai_verdict })
    ] })
  ] });
}
function formatCompact(n) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return `${n}`;
}
export {
  Index as component
};
