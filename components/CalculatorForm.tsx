"use client";

import { useEffect, useState } from "react";
import { calculate } from "@/lib/calc/engine";
import type {
  CalculatorGoal,
  CalculatorInputs,
  CalculatorResult,
  CalculatorTimeframeDays,
} from "@/lib/calc/types";
import type { ContentType, Industry } from "@/lib/calc/benchmarks";
import ResultsPanel from "./ResultsPanel";

const DEFAULT_INPUTS: CalculatorInputs = {
  followers: 25000,
  engagementRate: 3.5,
  contentType: "carousel",
  postsPerMonth: 4,
  creatorRate: 5000,
  industry: "SaaS",
  goal: "leads",
  timeframeDays: 30,
};

const CONTENT_TYPES: ContentType[] = ["article", "carousel", "video"];

const INDUSTRIES: Industry[] = [
  "SaaS",
  "HR Tech",
  "Finance",
  "Enterprise Software",
  "Other B2B",
];

const GOALS: CalculatorGoal[] = ["awareness", "traffic", "leads"];

const TIMEFRAMES: CalculatorTimeframeDays[] = [30, 60, 90];

const FIELD_LIMITS = {
  followers: { min: 100, max: 10_000_000 },
  engagementRate: { min: 0.1, max: 100 },
  postsPerMonth: { min: 1, max: 100 },
  creatorRate: { min: 0, max: 1_000_000 },
} as const;

type NumericField = keyof typeof FIELD_LIMITS;

type FieldErrors = Partial<Record<NumericField, string>>;

const fieldClassName =
  "mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-base text-foreground outline-none transition focus:border-white/30 focus:ring-2 focus:ring-white/10 sm:text-sm";

const fieldErrorClassName =
  "mt-2 w-full rounded-lg border border-red-400/50 bg-red-500/10 px-3 py-2.5 text-base text-foreground outline-none transition focus:border-red-400/70 focus:ring-2 focus:ring-red-400/20 sm:text-sm";

const labelClassName = "block text-sm font-medium text-foreground/80";

function validateNumericFields(inputs: CalculatorInputs): FieldErrors {
  const errors: FieldErrors = {};

  (Object.keys(FIELD_LIMITS) as NumericField[]).forEach((key) => {
    const value = inputs[key];
    const { min, max } = FIELD_LIMITS[key];

    if (!Number.isFinite(value)) {
      errors[key] = "Enter a valid number.";
      return;
    }

    if (value < 0) {
      errors[key] = "Negative numbers are not allowed.";
      return;
    }

    if (value < min) {
      errors[key] = `Must be at least ${min.toLocaleString("en-US")}.`;
      return;
    }

    if (value > max) {
      errors[key] = `Must be at most ${max.toLocaleString("en-US")}.`;
    }
  });

  return errors;
}

export default function CalculatorForm() {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  // null until the first valid calculation — shows the empty state on initial load
  const [calculatorResult, setCalculatorResult] =
    useState<CalculatorResult | null>(null);

  useEffect(() => {
    const errors = validateNumericFields(inputs);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setCalculatorResult(null);
      return;
    }

    setCalculatorResult(calculate(inputs));
  }, [inputs]);

  function updateNumber(key: NumericField, value: string) {
    if (value.trim() === "") {
      setInputs((prev) => ({
        ...prev,
        [key]: Number.NaN,
      }));
      return;
    }

    const parsed = Number(value);
    setInputs((prev) => ({
      ...prev,
      [key]: parsed,
    }));
  }

  return (
    <div className="w-full max-w-[1200px]">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Creator Details
            </h2>
            <p className="mt-1 text-sm text-foreground/60">
              Audience size, content mix, and creator cost.
            </p>
          </div>

          <div>
            <label htmlFor="followers" className={labelClassName}>
              Followers
            </label>
            <input
              id="followers"
              type="number"
              min={FIELD_LIMITS.followers.min}
              max={FIELD_LIMITS.followers.max}
              step={1}
              value={Number.isFinite(inputs.followers) ? inputs.followers : ""}
              onChange={(event) => updateNumber("followers", event.target.value)}
              className={
                fieldErrors.followers ? fieldErrorClassName : fieldClassName
              }
              aria-label="Number of followers"
              aria-invalid={Boolean(fieldErrors.followers)}
              aria-describedby={
                fieldErrors.followers ? "followers-error" : undefined
              }
            />
            {fieldErrors.followers ? (
              <p
                id="followers-error"
                role="alert"
                className="mt-1.5 text-sm text-red-300"
              >
                {fieldErrors.followers}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="engagementRate" className={labelClassName}>
              Engagement rate %
            </label>
            <input
              id="engagementRate"
              type="number"
              min={FIELD_LIMITS.engagementRate.min}
              max={FIELD_LIMITS.engagementRate.max}
              step={0.1}
              value={
                Number.isFinite(inputs.engagementRate)
                  ? inputs.engagementRate
                  : ""
              }
              onChange={(event) =>
                updateNumber("engagementRate", event.target.value)
              }
              className={
                fieldErrors.engagementRate
                  ? fieldErrorClassName
                  : fieldClassName
              }
              aria-label="Engagement rate percentage"
              aria-invalid={Boolean(fieldErrors.engagementRate)}
              aria-describedby={
                fieldErrors.engagementRate ? "engagementRate-error" : undefined
              }
            />
            {fieldErrors.engagementRate ? (
              <p
                id="engagementRate-error"
                role="alert"
                className="mt-1.5 text-sm text-red-300"
              >
                {fieldErrors.engagementRate}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="contentType" className={labelClassName}>
              Content type
            </label>
            <select
              id="contentType"
              value={inputs.contentType}
              onChange={(event) =>
                setInputs((prev) => ({
                  ...prev,
                  contentType: event.target.value as ContentType,
                }))
              }
              className={fieldClassName}
              aria-label="Content type"
            >
              {CONTENT_TYPES.map((type) => (
                <option key={type} value={type} className="bg-background">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="postsPerMonth" className={labelClassName}>
              Posts per month
            </label>
            <input
              id="postsPerMonth"
              type="number"
              min={FIELD_LIMITS.postsPerMonth.min}
              max={FIELD_LIMITS.postsPerMonth.max}
              step={1}
              value={
                Number.isFinite(inputs.postsPerMonth)
                  ? inputs.postsPerMonth
                  : ""
              }
              onChange={(event) =>
                updateNumber("postsPerMonth", event.target.value)
              }
              className={
                fieldErrors.postsPerMonth
                  ? fieldErrorClassName
                  : fieldClassName
              }
              aria-label="Posts per month"
              aria-invalid={Boolean(fieldErrors.postsPerMonth)}
              aria-describedby={
                fieldErrors.postsPerMonth ? "postsPerMonth-error" : undefined
              }
            />
            {fieldErrors.postsPerMonth ? (
              <p
                id="postsPerMonth-error"
                role="alert"
                className="mt-1.5 text-sm text-red-300"
              >
                {fieldErrors.postsPerMonth}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="creatorRate" className={labelClassName}>
              Creator rate $
            </label>
            <input
              id="creatorRate"
              type="number"
              min={FIELD_LIMITS.creatorRate.min}
              max={FIELD_LIMITS.creatorRate.max}
              step={1}
              value={
                Number.isFinite(inputs.creatorRate) ? inputs.creatorRate : ""
              }
              onChange={(event) =>
                updateNumber("creatorRate", event.target.value)
              }
              className={
                fieldErrors.creatorRate ? fieldErrorClassName : fieldClassName
              }
              aria-label="Creator rate in dollars"
              aria-invalid={Boolean(fieldErrors.creatorRate)}
              aria-describedby={
                fieldErrors.creatorRate ? "creatorRate-error" : undefined
              }
            />
            {fieldErrors.creatorRate ? (
              <p
                id="creatorRate-error"
                role="alert"
                className="mt-1.5 text-sm text-red-300"
              >
                {fieldErrors.creatorRate}
              </p>
            ) : null}
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Campaign Goal
            </h2>
            <p className="mt-1 text-sm text-foreground/60">
              Industry context, objective, and campaign length.
            </p>
          </div>

          <div>
            <label htmlFor="industry" className={labelClassName}>
              Industry
            </label>
            <select
              id="industry"
              value={inputs.industry}
              onChange={(event) =>
                setInputs((prev) => ({
                  ...prev,
                  industry: event.target.value as Industry,
                }))
              }
              className={fieldClassName}
              aria-label="Industry"
            >
              {INDUSTRIES.map((industry) => (
                <option key={industry} value={industry} className="bg-background">
                  {industry}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="goal" className={labelClassName}>
              Goal
            </label>
            <select
              id="goal"
              value={inputs.goal}
              onChange={(event) =>
                setInputs((prev) => ({
                  ...prev,
                  goal: event.target.value as CalculatorGoal,
                }))
              }
              className={fieldClassName}
              aria-label="Campaign goal"
            >
              {GOALS.map((goal) => (
                <option key={goal} value={goal} className="bg-background">
                  {goal.charAt(0).toUpperCase() + goal.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className={labelClassName} id="timeframe-label">
              Timeframe
            </span>
            <div
              className="mt-2 grid grid-cols-3 gap-2"
              role="group"
              aria-labelledby="timeframe-label"
              aria-label="Campaign timeframe in days"
            >
              {TIMEFRAMES.map((days) => {
                const selected = inputs.timeframeDays === days;
                return (
                  <button
                    key={days}
                    type="button"
                    onClick={() =>
                      setInputs((prev) => ({
                        ...prev,
                        timeframeDays: days,
                      }))
                    }
                    className={`rounded-lg border px-2 py-2.5 text-sm font-medium transition sm:px-3 ${
                      selected
                        ? "border-white/40 bg-white/15 text-foreground"
                        : "border-white/10 bg-white/5 text-foreground/70 hover:border-white/20 hover:text-foreground"
                    }`}
                    aria-pressed={selected}
                    aria-label={`${days} day timeframe`}
                    title={`${days} day campaign timeframe`}
                  >
                    {days} days
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      <div className="mt-12">
        <ResultsPanel result={calculatorResult} inputs={inputs} />
      </div>
    </div>
  );
}
