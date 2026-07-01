"use client";
// Average price by bedroom segment (the dashboard's main visualization).
import {Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import type {SegmentStats} from "@/lib/types";

export function PriceChart({segments}: { segments: SegmentStats[] }) {
    const data = segments.map((s) => ({name: s.segment, avgPrice: s.avgPrice}));
    if (data.length === 0) {
        return <p className="text-sm text-gray-500">No data for this filter / 该筛选下无数据</p>;
    }
    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{top: 8, right: 8, bottom: 8, left: 8}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="name" fontSize={12}/>
                    <YAxis fontSize={12} width={70} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}/>
                    <Tooltip formatter={(v: number) => `$${Number(v).toLocaleString()}`}/>
                    <Bar dataKey="avgPrice" fill="#2563eb" radius={[4, 4, 0, 0]}/>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
