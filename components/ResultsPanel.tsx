"use client";

import {
  FormEvent,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { CalculatorInputs, CalculatorResult } from "@/lib/calc/types";
import { getSupabase } from "@/lib/supabase/client";

export type ResultsPanelProps = {
  result: CalculatorResult | null;
  inputs: CalculatorInputs;
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

function AnimatedValue({
  value,
  className,
  children,
}: {
  value: string | number;
  className?: string;
  children: ReactNode;
}) {
  const [visible, setVisible] = useState(true);
  const [display, setDisplay] = useState(children);

  useEffect(() => {
    setVisible(false);
    const hideTimer = window.setTimeout(() => {
      setDisplay(children);
      setVisible(true);
    }, 120);
    return () => window.clearTimeout(hideTimer);
    // Re-animate only when the numeric/string value changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <span
      className={`inline-block transition-all duration-300 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
      } ${className ?? ""}`}
    >
      {display}
    </span>
  );
}

async function insertLead({
  email,
  company,
  inputs,
  result,
}: {
  email: string;
  company: string;
  inputs: CalculatorInputs;
  result: CalculatorResult;
}) {
  const { error } = await getSupabase().from("leads").insert({
    email,
    company: company || null,
    inputs,
    result,
  });
  if (error) throw error;
}

function EmptyResultsState() {
  return (
    <section className="mx-auto w-full max-w-[1200px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0c0c] text-[#f5f5f0] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.85)]">
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center sm:px-10 sm:py-20 lg:px-14">
        <div
          className="mb-5 flex h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: "rgba(201,169,97,0.15)" }}
          title="ROI comparison placeholder"
          aria-hidden
        >
          <span className="text-xl" style={{ color: GOLD }} title="Chart icon">
            ◆
          </span>
        </div>
        <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
          Fill in your details to see the ROI comparison
        </h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-white/50">
          Enter creator and campaign details above. We&apos;ll compare creator
          partnership cost against equivalent LinkedIn ads.
        </p>
      </div>
    </section>
  );
}

function LeadCaptureForm({
  inputs,
  result,
}: {
  inputs: CalculatorInputs;
  result: CalculatorResult;
}) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage("Please enter your email.");
      setSuccessMessage(null);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await insertLead({
        email: trimmedEmail,
        company: company.trim(),
        inputs,
        result,
      });
      setSuccessMessage("Thanks! We'll send you matches shortly.");
      setEmail("");
      setCompany("");
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-10 border-t border-white/[0.08] pt-8 sm:mt-12">
      <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
        See which creators could deliver this for you
      </h3>
      <p className="mt-1 text-sm text-white/50">
        Share your email and we&apos;ll send curated creator matches.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2"
        noValidate
      >
        <div className="sm:col-span-1">
          <label
            htmlFor="lead-email"
            className="block text-sm font-medium text-white/70"
          >
            Email <span className="text-white/40">(required)</span>
          </label>
          <input
            id="lead-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isSubmitting}
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-base text-foreground outline-none transition focus:border-white/30 focus:ring-2 focus:ring-white/10 disabled:opacity-60 sm:text-sm"
            aria-label="Work email address"
            placeholder="you@company.com"
            autoComplete="email"
          />
        </div>

        <div className="sm:col-span-1">
          <label
            htmlFor="lead-company"
            className="block text-sm font-medium text-white/70"
          >
            Company <span className="text-white/40">(optional)</span>
          </label>
          <input
            id="lead-company"
            type="text"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            disabled={isSubmitting}
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-base text-foreground outline-none transition focus:border-white/30 focus:ring-2 focus:ring-white/10 disabled:opacity-60 sm:text-sm"
            aria-label="Company name"
            placeholder="Your company"
            autoComplete="organization"
          />
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            style={{
              background: `linear-gradient(135deg, ${GOLD} 0%, #b8923f 100%)`,
              color: "#0a0a0a",
            }}
            aria-label={
              isSubmitting ? "Sending lead form" : "Get creator matches"
            }
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a]"
                  aria-hidden
                  title="Loading"
                />
                Sending...
              </>
            ) : (
              "Get creator matches"
            )}
          </button>
        </div>

        {successMessage ? (
          <p
            role="status"
            className="sm:col-span-2 text-sm text-emerald-300"
          >
            {successMessage}
          </p>
        ) : null}
        {errorMessage ? (
          <p role="alert" className="sm:col-span-2 text-sm text-red-300">
            {errorMessage}
          </p>
        ) : null}
      </form>
    </div>
  );
}

export default function ResultsPanel({ result, inputs }: ResultsPanelProps) {
  if (!result) {
    return <EmptyResultsState />;
  }

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
  const creatorCostLabel = formatCurrency(creatorCost);
  const adTotalLabel = formatCurrency(adTotal);

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
      <div className="relative px-4 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
        {/* ROI badge — stacks / wraps cleanly on mobile */}
        <div className="mb-8 text-center sm:mb-12">
          <p
            className="inline-flex max-w-full flex-col items-center gap-1 rounded-xl px-4 py-4 text-xl font-bold leading-tight tracking-tight sm:inline-block sm:px-8 sm:py-5 sm:text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-[1.15]"
            style={{
              background: `linear-gradient(135deg, ${GOLD} 0%, #b8923f 100%)`,
              color: "#0a0a0a",
              boxShadow: `0 0 0 1px rgba(201,169,97,0.35), 0 24px 48px -16px rgba(201,169,97,0.45)`,
            }}
            title={`Creator partnership is ${roiLabel}x more efficient`}
            aria-label={`Creator partnership is ${roiLabel} times more efficient`}
          >
            <span>Creator partnership is</span>{" "}
            <AnimatedValue
              value={roiLabel}
              className="whitespace-nowrap text-5xl font-black leading-none sm:text-6xl md:text-7xl"
            >
              {roiLabel}x
            </AnimatedValue>{" "}
            <span>more efficient</span>
          </p>
        </div>

        {/* Cost comparison cards — stack on mobile */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:gap-8">
          <article
            className="relative flex flex-col rounded-xl border bg-[#121210] p-5 sm:p-8"
            style={{
              borderColor: "rgba(201,169,97,0.45)",
              boxShadow: `inset 0 1px 0 rgba(201,169,97,0.12), 0 0 40px -20px rgba(201,169,97,0.35)`,
            }}
            title="Creator partnership cost"
          >
            <div
              aria-hidden
              className="absolute left-0 top-0 h-full w-1 rounded-l-xl"
              style={{ backgroundColor: GOLD }}
              title="Creator highlight"
            />
            <p
              className="text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ color: GOLD }}
            >
              Creator Partnership
            </p>
            <p className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <AnimatedValue value={creatorCostLabel}>
                {creatorCostLabel}
              </AnimatedValue>
            </p>
            <p className="mt-3 text-sm text-white/50">
              All-in creator investment
            </p>
          </article>

          <article
            className="relative flex flex-col rounded-xl border border-red-500/35 bg-[#140e0e] p-5 shadow-[inset_0_1px_0_rgba(239,68,68,0.08),0_0_40px_-18px_rgba(239,68,68,0.35)] sm:p-8"
            title="LinkedIn ads equivalent cost"
          >
            <div
              aria-hidden
              className="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-red-500/80"
              title="Ads highlight"
            />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-300/80">
              LinkedIn Ads (equivalent)
            </p>
            <p className="mt-4 text-3xl font-bold tracking-tight text-red-100 sm:text-5xl lg:text-6xl">
              <AnimatedValue value={adTotalLabel}>
                {adTotalLabel}
              </AnimatedValue>
            </p>
            <p className="mt-3 text-sm text-white/45">
              True cost to match the same outcomes
            </p>

            <div className="mt-8 border-t border-red-500/20 pt-5">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-red-300/60">
                Why ads cost so much
              </p>
              <ul className="space-y-2.5">
                {adBreakdown.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-baseline justify-between gap-3 text-sm sm:gap-4"
                  >
                    <span className="text-white/55">{item.label}</span>
                    <span className="font-medium tabular-nums text-white/80">
                      <AnimatedValue value={formatCurrency(item.value)}>
                        {formatCurrency(item.value)}
                      </AnimatedValue>
                    </span>
                  </li>
                ))}
                <li className="flex items-baseline justify-between gap-3 border-t border-red-500/20 pt-3 text-sm font-semibold sm:gap-4">
                  <span className="text-red-200/90">Total</span>
                  <span className="tabular-nums text-red-100">
                    <AnimatedValue value={adTotalLabel}>
                      {adTotalLabel}
                    </AnimatedValue>
                  </span>
                </li>
              </ul>
            </div>
          </article>
        </div>

        {/* Outcomes — stack on mobile */}
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
                title={`${item.label}: ${formatNumber(item.value)}`}
              >
                <p className="text-3xl font-bold tracking-tight tabular-nums sm:text-4xl">
                  <AnimatedValue value={formatNumber(item.value)}>
                    {formatNumber(item.value)}
                  </AnimatedValue>
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
          <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {CREATOR_BENEFITS.map((benefit) => (
              <li
                key={benefit}
                className="flex items-start gap-3 text-sm text-white/80 sm:text-[15px]"
              >
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-[#0a0a0a]"
                  style={{ backgroundColor: GOLD }}
                  title="Advantage"
                  aria-label="Advantage"
                >
                  ✓
                </span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <LeadCaptureForm inputs={inputs} result={result} />

        <footer className="mt-12 flex flex-col gap-4 border-t border-white/[0.08] pt-6 sm:mt-14 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p
              className="text-sm font-semibold tracking-wide"
              style={{ color: GOLD }}
              title="Citrine Creators"
            >
              Citrine Creators
            </p>
            <p className="mt-2 max-w-md text-[11px] leading-relaxed text-white/35">
              Estimates based on industry benchmarks; actual results vary.
            </p>
          </div>
          <p
            className="text-sm font-medium tracking-tight text-white/55 sm:text-right"
            title="Built with Cursor"
          >
            Cursor
          </p>
        </footer>
      </div>
    </section>
  );
}
