"use client";
// Custom hooks for Market Analysis: re-fetch market stats by filter, and run what-if predictions.
// Both talk to the same-origin /api/market/* route handlers.
import {useCallback, useState} from "react";
import type {MarketFilter, MarketStats, PropertyFeatures, WhatIfResponse} from "@/lib/types";

export function useMarketStats(initial: MarketStats) {
    const [stats, setStats] = useState<MarketStats>(initial);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const apply = useCallback(async (filter: MarketFilter) => {
        setLoading(true);
        setError(null);
        try {
            const qs = new URLSearchParams();
            Object.entries(filter).forEach(([k, v]) => {
                if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
            });
            const res = await fetch(`/api/market/stats?${qs.toString()}`);
            if (!res.ok) throw new Error(`Request failed (${res.status})`);
            setStats((await res.json()) as MarketStats);
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setLoading(false);
        }
    }, []);

    return {stats, loading, error, apply};
}

export function useWhatIf() {
    const [result, setResult] = useState<WhatIfResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const run = useCallback(async (features: PropertyFeatures) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/market/what-if", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(features),
            });
            if (!res.ok) throw new Error(`Request failed (${res.status})`);
            setResult((await res.json()) as WhatIfResponse);
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setLoading(false);
        }
    }, []);

    return {result, loading, error, run};
}
