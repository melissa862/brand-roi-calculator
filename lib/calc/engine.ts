import { benchmarks } from "./benchmarks";
import type { CalculatorInputs, CalculatorResult } from "./types";

function roundWhole(value: number): number {
  return Math.round(value);
}

function roundDollars(value: number): number {
  return Math.round(value);
}

export function calculate(inputs: CalculatorInputs): CalculatorResult {
  const months = inputs.timeframeDays / 30;
  const reachFactor = benchmarks.contentTypeReachFactors[inputs.contentType];
  const industryBenchmarks = benchmarks.industries[inputs.industry];
  const { creativeDevCost, managementCostPerMonth, adFatiguePenalty } =
    benchmarks.adHiddenCosts;

  const impressions = roundWhole(
    inputs.followers * reachFactor * inputs.postsPerMonth * months
  );
  const engagements = roundWhole(impressions * (inputs.engagementRate / 100));
  const clicks = engagements;
  const leads = roundWhole(engagements * industryBenchmarks.creatorEngToLeadRate);
  const creatorCost = roundDollars(inputs.creatorRate);

  let adBase: number;
  switch (inputs.goal) {
    case "awareness":
      adBase = (impressions / 1000) * industryBenchmarks.cpm;
      break;
    case "traffic":
      adBase = clicks * industryBenchmarks.cpc;
      break;
    case "leads":
      adBase = leads * industryBenchmarks.costPerLead;
      break;
  }

  adBase = roundDollars(adBase);
  const adFatigue = roundDollars(adBase * adFatiguePenalty);
  const adSpendWithFatigue = adBase + adFatigue;
  const managementCost = roundDollars(managementCostPerMonth * months);
  const roundedCreativeDevCost = roundDollars(creativeDevCost);
  const adTotal = roundDollars(
    adSpendWithFatigue + roundedCreativeDevCost + managementCost
  );
  const roiMultiplier =
    creatorCost === 0 ? 0 : Math.round((adTotal / creatorCost) * 100) / 100;
  const savings = roundDollars(adTotal - creatorCost);

  return {
    impressions,
    engagements,
    clicks,
    leads,
    creatorCost,
    adBase,
    adFatigue,
    creativeDevCost: roundedCreativeDevCost,
    managementCost,
    adTotal,
    roiMultiplier,
    savings,
  };
}
