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

const fieldClassName =
  "mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-foreground outline-none transition focus:border-white/30 focus:ring-2 focus:ring-white/10";

const labelClassName = "block text-sm font-medium text-foreground/80";

export default function CalculatorForm() {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);
  const [calculatorResult, setCalculatorResult] = useState<CalculatorResult>(
    () => calculate(DEFAULT_INPUTS)
  );

  useEffect(() => {
    const result = calculate(inputs);
    setCalculatorResult(result);
  }, [inputs]);

  function updateNumber<K extends keyof CalculatorInputs>(
    key: K,
    value: string
  ) {
    const parsed = Number(value);
    setInputs((prev) => ({
      ...prev,
      [key]: Number.isFinite(parsed) ? parsed : prev[key],
    }));
  }

  return (
    <form
      className="w-full max-w-5xl"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="grid gap-10 md:grid-cols-2 md:gap-12">
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
              min={0}
              step={1}
              value={inputs.followers}
              onChange={(event) => updateNumber("followers", event.target.value)}
              className={fieldClassName}
            />
          </div>

          <div>
            <label htmlFor="engagementRate" className={labelClassName}>
              Engagement rate %
            </label>
            <input
              id="engagementRate"
              type="number"
              min={0}
              step={0.1}
              value={inputs.engagementRate}
              onChange={(event) =>
                updateNumber("engagementRate", event.target.value)
              }
              className={fieldClassName}
            />
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
              min={0}
              step={1}
              value={inputs.postsPerMonth}
              onChange={(event) =>
                updateNumber("postsPerMonth", event.target.value)
              }
              className={fieldClassName}
            />
          </div>

          <div>
            <label htmlFor="creatorRate" className={labelClassName}>
              Creator rate $
            </label>
            <input
              id="creatorRate"
              type="number"
              min={0}
              step={1}
              value={inputs.creatorRate}
              onChange={(event) =>
                updateNumber("creatorRate", event.target.value)
              }
              className={fieldClassName}
            />
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
            >
              {GOALS.map((goal) => (
                <option key={goal} value={goal} className="bg-background">
                  {goal.charAt(0).toUpperCase() + goal.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className={labelClassName}>Timeframe</span>
            <div
              className="mt-2 grid grid-cols-3 gap-2"
              role="group"
              aria-label="Timeframe"
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
                    className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                      selected
                        ? "border-white/40 bg-white/15 text-foreground"
                        : "border-white/10 bg-white/5 text-foreground/70 hover:border-white/20 hover:text-foreground"
                    }`}
                    aria-pressed={selected}
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
        <ResultsPanel result={calculatorResult} />
      </div>
    </form>
  );
}
