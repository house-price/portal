// Server-side backend access. Imported ONLY by RSC and route handlers (never the
// browser), so backend URLs stay server-only and there is no CORS.
import type {Estimate, MarketFilter, MarketStats, PropertyFeatures, WhatIfResponse} from "./types";
import {toQueryString} from "./format";

const ESTIMATOR = process.env.ESTIMATOR_API_URL ?? "http://localhost:8080";
const MARKET = process.env.MARKET_API_URL ?? "http://localhost:8081";

// ---- field mapping: frontend camelCase <-> estimator snake_case ----
function toSnake(f: PropertyFeatures & { label?: string | null }) {
    return {
        label: f.label ?? null,
        square_footage: f.squareFootage,
        bedrooms: f.bedrooms,
        bathrooms: f.bathrooms,
        year_built: f.yearBuilt,
        lot_size: f.lotSize,
        distance_to_city_center: f.distanceToCityCenter,
        school_rating: f.schoolRating,
    };
}

// Accepts a raw snake_case record from the estimator and returns a camelCase Estimate
function toCamel(r: Record<string, unknown>): Estimate {
    return {
        id: r.id as number,
        createdAt: r.created_at as string,
        label: (r.label as string) ?? null,
        squareFootage: r.square_footage as number,
        bedrooms: r.bedrooms as number,
        bathrooms: r.bathrooms as number,
        yearBuilt: r.year_built as number,
        lotSize: r.lot_size as number,
        distanceToCityCenter: r.distance_to_city_center as number,
        schoolRating: r.school_rating as number,
        predictedPrice: r.predicted_price as number,
    };
}

// ---- Property Estimator ----
export async function listEstimates(): Promise<Estimate[]> {
    const res = await fetch(`${ESTIMATOR}/estimates?limit=50`, {cache: "no-store"});
    if (!res.ok) throw new Error(`Estimator error ${res.status}`);
    const rows = (await res.json()) as Record<string, unknown>[];
    return rows.map(toCamel);
}

export async function createEstimate(
    input: PropertyFeatures & { label?: string | null },
): Promise<Estimate> {
    const res = await fetch(`${ESTIMATOR}/estimates`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(toSnake(input)),
        cache: "no-store",
    });
    if (!res.ok) throw new Error(`Estimator error ${res.status}`);
    return toCamel(await res.json());
}

export async function deleteEstimate(id: number): Promise<void> {
    const res = await fetch(`${ESTIMATOR}/estimates/${id}`, {method: "DELETE", cache: "no-store"});
    if (!res.ok && res.status !== 404) throw new Error(`Estimator error ${res.status}`);
}

// ---- Market Analysis (Java already camelCase) ----
export async function getMarketStats(filter: MarketFilter): Promise<MarketStats> {
    const res = await fetch(`${MARKET}/api/market/stats?${toQueryString(filter)}`, {cache: "no-store"});
    if (!res.ok) throw new Error(`Market error ${res.status}`);
    return (await res.json()) as MarketStats;
}

export async function whatIf(features: PropertyFeatures): Promise<WhatIfResponse> {
    const res = await fetch(`${MARKET}/api/market/what-if`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(features),
        cache: "no-store",
    });
    if (!res.ok) throw new Error(`Market error ${res.status}`);
    return (await res.json()) as WhatIfResponse;
}
