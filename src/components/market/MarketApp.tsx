"use client";
// MarketApp = the interactive dashboard (Market Analysis). Holds filter + sort state, re-fetches
// stats via the custom hook, renders summary cards, a chart, a sortable/exportable
// table, and the what-if panel.
import {useMemo, useState} from "react";
import {Button} from "@/components/ui/Button";
import {Card} from "@/components/ui/Card";
import {PriceChart} from "@/components/market/PriceChart";
import {WhatIfPanel} from "@/components/market/WhatIfPanel";
import {useMarketStats} from "@/hooks/useMarket";
import {exportCsv, exportPdf} from "@/lib/export";
import type {MarketFilter, MarketStats, SegmentStats} from "@/lib/types";

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;
type FilterForm = Record<keyof MarketFilter, number | "">;
const EMPTY_FILTER: FilterForm = {
    bedrooms: "", minPrice: "", maxPrice: "", minYearBuilt: "", maxYearBuilt: "",
};

// columns used for the table + exports
const COLUMNS: [keyof SegmentStats, string][] = [
    ["segment", "Segment"],
    ["count", "Count"],
    ["avgPrice", "Avg price"],
    ["minPrice", "Min price"],
    ["maxPrice", "Max price"],
    ["avgPricePerSqft", "Avg $/sqft"],
];

export function MarketApp({initialStats}: { initialStats: MarketStats }) {
    const {stats, loading, error, apply} = useMarketStats(initialStats);
    const [filter, setFilter] = useState<FilterForm>(EMPTY_FILTER);
    const [sortKey, setSortKey] = useState<keyof SegmentStats>("segment");
    const [sortAsc, setSortAsc] = useState(true);

    const setF = (k: keyof MarketFilter, v: number | "") => setFilter((f) => ({...f, [k]: v}));

    function applyFilter() {
        const clean: MarketFilter = {};
        (Object.keys(filter) as (keyof MarketFilter)[]).forEach((k) => {
            if (filter[k] !== "") clean[k] = filter[k] as number;
        });
        apply(clean);
    }

    // client-side sorting of the segment table
    const sorted = useMemo(() => {
        const rows = [...stats.byBedrooms];
        rows.sort((a, b) => {
            const av = a[sortKey];
            const bv = b[sortKey];
            const cmp = typeof av === "number" && typeof bv === "number"
                ? av - bv
                : String(av).localeCompare(String(bv));
            return sortAsc ? cmp : -cmp;
        });
        return rows;
    }, [stats.byBedrooms, sortKey, sortAsc]);

    function toggleSort(k: keyof SegmentStats) {
        if (k === sortKey) setSortAsc((v) => !v);
        else {
            setSortKey(k);
            setSortAsc(true);
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold text-gray-800">Property Market Analysis</h1>

            {/* ---- filters ---- */}
            <Card title="Filters">
                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {([
                        ["bedrooms", "Bedrooms"],
                        ["minPrice", "Min price"],
                        ["maxPrice", "Max price"],
                        ["minYearBuilt", "Min year"],
                        ["maxYearBuilt", "Max year"],
                    ] as [keyof MarketFilter, string][]).map(([k, label]) => (
                        <div key={k} className="flex flex-col gap-1">
                            <label htmlFor={k} className="text-sm font-medium text-gray-700">{label}</label>
                            <input id={k} type="number" value={filter[k]}
                                   onChange={(e) => setF(k, e.target.value === "" ? "" : Number(e.target.value))}
                                   className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"/>
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex items-center gap-3">
                    <Button onClick={applyFilter} disabled={loading}>
                        {loading ? "Loading..." : "Apply"}
                    </Button>
                    <Button variant="secondary" onClick={() => {
                        setFilter(EMPTY_FILTER);
                        apply({});
                    }}>
                        Clear / 清除
                    </Button>
                    {error && <span role="alert" className="text-sm text-red-600">{error}</span>}
                </div>
            </Card>

            {/* ---- summary cards ---- */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {([
                    ["Properties", String(stats.count)],
                    ["Average price", money(stats.avgPrice)],
                    ["Median price", money(stats.medianPrice)],
                    ["Avg $/sqft", `$${stats.avgPricePerSqft.toFixed(2)}`],
                ] as [string, string][]).map(([label, value]) => (
                    <div key={label} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                        <p className="text-xs text-gray-500">{label}</p>
                        <p className="text-xl font-bold text-gray-800">{value}</p>
                    </div>
                ))}
            </div>

            {/* ---- chart ---- */}
            <Card title="Average price by bedrooms">
                <PriceChart segments={stats.byBedrooms}/>
            </Card>

            {/* ---- sortable + exportable table ---- */}
            <Card title="Segments">
                <div className="mb-3 flex gap-2">
                    <Button variant="secondary" onClick={() => exportCsv("market-segments.csv", sorted, COLUMNS)}>
                        Export CSV
                    </Button>
                    <Button variant="secondary" onClick={() => exportPdf("market-segments.pdf", "Market segments", sorted, COLUMNS)}>
                        Export PDF
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="border-b border-gray-200 text-left text-gray-500">
                            {COLUMNS.map(([k, label]) => (
                                <th key={String(k)} className="cursor-pointer py-2 select-none" onClick={() => toggleSort(k)}
                                    aria-sort={sortKey === k ? (sortAsc ? "ascending" : "descending") : "none"}>
                                    {label}{sortKey === k ? (sortAsc ? " ▲" : " ▼") : ""}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {sorted.map((s) => (
                            <tr key={s.segment} className="border-b border-gray-100">
                                <td className="py-2">{s.segment}</td>
                                <td className="py-2">{s.count}</td>
                                <td className="py-2">{money(s.avgPrice)}</td>
                                <td className="py-2">{money(s.minPrice)}</td>
                                <td className="py-2">{money(s.maxPrice)}</td>
                                <td className="py-2">${s.avgPricePerSqft.toFixed(2)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* ---- what-if ---- */}
            <Card title="What-if analysis">
                <WhatIfPanel/>
            </Card>
        </div>
    );
}
