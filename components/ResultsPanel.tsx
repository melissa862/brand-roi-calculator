import type { CalculatorResult } from "@/lib/calc/types";

export type ResultsPanelProps = {
  result: CalculatorResult;
};

const GOLD = "#C9A961";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

const CREATOR_BENEFITS = [
  "Authentic voice = higher trust",
  "No creative development cost",
  "No ad fatigue",
  "Creator handles everything",
  "No competitor saturation",
] as const;

export default function ResultsPanel({ result }: ResultsPanelProps) {
  const {
    impressions,
    engagements,
    leads,
    creatorCost,
    adBase,
    adFatigue,
    creativeDevCost,
    managementCost,
    adTotal,
    roiMultiplier,
  } = result;

  const roiLabel = roiMultiplier.toFixed(1);

  const adBreakdown = [
    { label: "Base ad spend", value: adBase },
    { label: "Ad-fatigue premium", value: adFatigue },
    { label: "Creative development", value: creativeDevCost },
    { label: "Campaign management", value: managementCost },
  ];

  const outcomes = [
    { label: "Impressions", value: impressions },
    { label: "Engagements", value: engagements },
    { label: "Leads", value: leads },
  ];

  return (
    <section className="mx-auto w-full max-w-[1200px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0c0c] text-[#f5f5f0] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.85)]">
      <div className="relative px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
        {/* ROI badge — dominant headline */}
        <div className="mb-10 text-center sm:mb-12">
          <p
            className="inline-block rounded-xl px-5 py-4 text-2xl font-bold leading-tight tracking-tight sm:px-8 sm:py-5 sm:text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-[1.15]"
            style={{
              background: `linear-gradient(135deg, ${GOLD} 0%, #b8923f 100%)`,
              color: "#0a0a0a",
              boxShadow: `0 0 0 1px rgba(201,169,97,0.35), 0 24px 48px -16px rgba(201,169,97,0.45)`,
            }}
          >
            Creator partnership is{" "}
            <span className="whitespace-nowrap">{roiLabel}x</span> more
            efficient
          </p>
        </div>

        {/* Cost comparison cards */}
        <div className="grid gap-5 md:grid-cols-2 md:gap-6 lg:gap-8">
          {/* Creator — hero card */}
          <article
            className="relative flex flex-col rounded-xl border bg-[#121210] p-6 sm:p-8"
            style={{
              borderColor: "rgba(201,169,97,0.45)",
              boxShadow: `inset 0 1px 0 rgba(201,169,97,0.12), 0 0 40px -20px rgba(201,169,97,0.35)`,
            }}
          >
            <div
              aria-hidden
              className="absolute left-0 top-0 h-full w-1 rounded-l-xl"
              style={{ backgroundColor: GOLD }}
            />
            <p
              className="text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ color: GOLD }}
            >
              Creator Partnership
            </p>
            <p className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {formatCurrency(creatorCost)}
            </p>
            <p className="mt-3 text-sm text-white/50">
              All-in creator investment
            </p>
          </article>

          {/* Ads — heavier / alarming */}
          <article className="relative flex flex-col rounded-xl border border-red-500/35 bg-[#140e0e] p-6 shadow-[inset_0_1px_0_rgba(239,68,68,0.08),0_0_40px_-18px_rgba(239,68,68,0.35)] sm:p-8">
            <div
              aria-hidden
              className="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-red-500/80"
            />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-300/80">
              LinkedIn Ads (equivalent)
            </p>
            <p className="mt-4 text-4xl font-bold tracking-tight text-red-100 sm:text-5xl lg:text-6xl">
              {formatCurrency(adTotal)}
            </p>
            <p className="mt-3 text-sm text-white/45">
              True cost to match the same outcomes
            </p>

            {/* Hidden-cost breakdown */}
            <div className="mt-8 border-t border-red-500/20 pt-5">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-red-300/60">
                Why ads cost so much
              </p>
              <ul className="space-y-2.5">
                {adBreakdown.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-baseline justify-between gap-4 text-sm"
                  >
                    <span className="text-white/55">{item.label}</span>
                    <span className="font-medium tabular-nums text-white/80">
                      {formatCurrency(item.value)}
                    </span>
                  </li>
                ))}
                <li className="flex items-baseline justify-between gap-4 border-t border-red-500/20 pt-3 text-sm font-semibold">
                  <span className="text-red-200/90">Total</span>
                  <span className="tabular-nums text-red-100">
                    {formatCurrency(adTotal)}
                  </span>
                </li>
              </ul>
            </div>
          </article>
        </div>

        {/* Outcomes — same results */}
        <div className="mt-10 sm:mt-12">
          <div className="mb-5 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
                Identical outcomes
              </h3>
              <p className="mt-1 text-sm text-white/50">
                Same results, different cost
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
            {outcomes.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-5 text-center sm:py-6"
              >
                <p className="text-3xl font-bold tracking-tight tabular-nums sm:text-4xl">
                  {formatNumber(item.value)}
                </p>
                <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-white/45">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Creator advantages */}
        <div className="mt-10 sm:mt-12">
          <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
            Creator advantages
          </h3>
          <p className="mt-1 text-sm text-white/50">
            Qualitative edge you don&apos;t get from paid media
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {CREATOR_BENEFITS.map((benefit) => (
              <li
                key={benefit}
                className="flex items-start gap-3 text-sm text-white/80 sm:text-[15px]"
              >
                <span
                  aria-hidden
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-[#0a0a0a]"
                  style={{ backgroundColor: GOLD }}
                >
                  ✓
                </span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <footer className="mt-12 flex flex-col gap-4 border-t border-white/[0.08] pt-6 sm:mt-14 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p
              className="text-sm font-semibold tracking-wide"
              style={{ color: GOLD }}
            >
              Citrine Creators
            </p>
            <p className="mt-2 max-w-md text-[11px] leading-relaxed text-white/35">
              Estimates based on industry benchmarks; actual results vary.
            </p>
          </div>
          <p className="text-sm font-medium tracking-tight text-white/55 sm:text-right">
            Cursor
          </p>
        </footer>
      </div>
    </section>
  );
}
