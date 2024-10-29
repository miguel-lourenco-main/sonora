import { getPlanTier } from "@kit/shared/utils";

export function calculateTieredCost(pageCountValue: number, tiers: {
    cost: number;
    upTo: number | "unlimited";
}[]) {

    const tiersUpTo = tiers.map((tier) => tier.upTo)

    // Convert pageCount to a number, defaulting to 0 if it's not a valid number
    const pageCount = Number(pageCountValue) || 0;

    let index = getPlanTier(pageCount, tiersUpTo);
    
    let cost = tiers[index]?.cost ?? 0; 

    // Apply the cost of the applicable tier to all pages
    const costPerPage = Number(cost);
    return costPerPage * pageCount
}