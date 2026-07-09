import type { ContentType, Industry } from "./benchmarks";

export type CalculatorGoal = "awareness" | "traffic" | "leads";

export type CalculatorTimeframeDays = 30 | 60 | 90;

export type CalculatorInputs = {
  followers: number;
  /** Engagement rate as a percent, e.g. 3.5 for 3.5% */
  engagementRate: number;
  contentType: ContentType;
  postsPerMonth: number;
  creatorRate: number;
  industry: Industry;
  goal: CalculatorGoal;
  timeframeDays: CalculatorTimeframeDays;
};

export type CalculatorResult = {
  impressions: number;
  engagements: number;
  clicks: number;
  leads: number;
  creatorCost: number;
  adBase: number;
  adFatigue: number;
  creativeDevCost: number;
  managementCost: number;
  adTotal: number;
  roiMultiplier: number;
  savings: number;
};
