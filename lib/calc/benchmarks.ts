export type Industry =
  | "SaaS"
  | "HR Tech"
  | "Finance"
  | "Enterprise Software"
  | "Other B2B";

export type ContentType = "image" | "carousel" | "video";

export type IndustryBenchmarks = {
  cpm: number;
  cpc: number;
  costPerLead: number;
  creatorEngToLeadRate: number;
};

export type BenchmarksConfig = {
  industries: Record<Industry, IndustryBenchmarks>;
  contentTypeReachFactors: Record<ContentType, number>;
  adHiddenCosts: {
    creativeDevCost: number;
    managementCostPerMonth: number;
    adFatiguePenalty: number;
  };
  adCtr: number;
};

export const benchmarks: BenchmarksConfig = {
  industries: {
    SaaS: {
      cpm: 6.5,
      cpc: 5.5,
      costPerLead: 130,
      creatorEngToLeadRate: 0.03,
    },
    "HR Tech": {
      cpm: 6.0,
      cpc: 5.0,
      costPerLead: 110,
      creatorEngToLeadRate: 0.04,
    },
    Finance: {
      cpm: 8.0,
      cpc: 7.0,
      costPerLead: 200,
      creatorEngToLeadRate: 0.015,
    },
    "Enterprise Software": {
      cpm: 7.0,
      cpc: 6.0,
      costPerLead: 160,
      creatorEngToLeadRate: 0.02,
    },
    "Other B2B": {
      cpm: 6.5,
      cpc: 5.5,
      costPerLead: 150,
      creatorEngToLeadRate: 0.025,
    },
  },
  contentTypeReachFactors: {
    image: 0.22,
    carousel: 0.28,
    video: 0.35,
  },
  adHiddenCosts: {
    creativeDevCost: 2500,
    managementCostPerMonth: 1500,
    adFatiguePenalty: 0.25,
  },
  adCtr: 0.005,
};
