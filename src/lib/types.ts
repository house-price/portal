// Shared TypeScript types. The frontend uses camelCase everywhere; the Python
// estimator backend speaks snake_case, so route handlers map between them (see api.ts).

// The 7 property features the user inputs
export interface PropertyFeatures {
    squareFootage: number;
    bedrooms: number;
    bathrooms: number;
    yearBuilt: number;
    lotSize: number;
    distanceToCityCenter: number;
    schoolRating: number;
}

// One saved estimate (Property Estimator)
export interface Estimate extends PropertyFeatures {
    id: number;
    createdAt: string;
    label: string | null;
    predictedPrice: number;
}

// Per-segment stats (Market Analysis)
export interface SegmentStats {
    segment: string;
    count: number;
    avgPrice: number;
    minPrice: number;
    maxPrice: number;
    avgPricePerSqft: number;
}

// Overall market stats (Market Analysis, matches Java camelCase)
export interface MarketStats {
    count: number;
    avgPrice: number;
    medianPrice: number;
    minPrice: number;
    maxPrice: number;
    avgPricePerSqft: number;
    avgSquareFootage: number;
    byBedrooms: SegmentStats[];
}

// Market filter (Market Analysis)
export interface MarketFilter {
    bedrooms?: number;
    minPrice?: number;
    maxPrice?: number;
    minYearBuilt?: number;
    maxYearBuilt?: number;
}

export interface WhatIfResponse {
    predictedPrice: number;
    marketAvgPrice: number;
    differenceFromMarketAvg: number;
}
