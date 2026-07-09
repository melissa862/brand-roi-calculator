import { describe, expect, it } from "vitest";
import { calculate } from "./engine";

describe("calculate", () => {
  it("should calculate ROI correctly for sanity case", () => {
    const result = calculate({
      followers: 25000,
      engagementRate: 3.5,
      contentType: "carousel",
      postsPerMonth: 4,
      creatorRate: 5000,
      industry: "SaaS",
      goal: "leads",
      timeframeDays: 30,
    });

    expect(result.creatorCost).toBe(5000);

    // Ad equivalent should be a realistic multi-thousand figure well above creator cost
    expect(result.adTotal).toBeGreaterThan(5000);
    expect(result.adTotal).toBeGreaterThanOrEqual(15000);
    expect(result.adTotal).toBeLessThanOrEqual(25000);

    expect(result.roiMultiplier).toBeGreaterThan(2);

    const wholeNumberFields = [
      result.impressions,
      result.engagements,
      result.clicks,
      result.leads,
      result.creatorCost,
      result.adBase,
      result.adFatigue,
      result.creativeDevCost,
      result.managementCost,
      result.adTotal,
      result.savings,
    ] as const;

    for (const value of wholeNumberFields) {
      expect(Number.isInteger(value)).toBe(true);
    }
  });
});
