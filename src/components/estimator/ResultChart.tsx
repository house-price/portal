"use client";
// Bar chart of predicted prices across recent estimates (the "visual chart" for Property Estimator).
import {PriceBarChart} from "@/components/ui/PriceBarChart";
import type {Estimate} from "@/lib/types";

export function ResultChart({estimates}: { estimates: Estimate[] }) {
    const data = estimates
        .slice(0, 8)
        .reverse()
        .map((e) => ({name: e.label || `#${e.id}`, value: e.predictedPrice}));
    return <PriceBarChart data={data} seriesName="Predicted price" emptyText="No data yet"/>;
}
