"use client";
// Average price by bedroom segment (the dashboard's main visualization).
import {PriceBarChart} from "@/components/ui/PriceBarChart";
import type {SegmentStats} from "@/lib/types";

export function PriceChart({segments}: { segments: SegmentStats[] }) {
    const data = segments.map((s) => ({name: s.segment, value: s.avgPrice}));
    return <PriceBarChart data={data} seriesName="Avg price" emptyText="No data for this filter"/>;
}
