"use client";
// Bar chart of predicted prices across recent estimates (the "visual chart" for Property Estimator).
// recharts renders in the browser, so this is a client component.
import {Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import type {Estimate} from "@/lib/types";

export function ResultChart({estimates}: { estimates: Estimate[] }) {
    const data = estimates
        .slice(0, 8)
        .reverse()
        .map((e) => ({name: e.label || `#${e.id}`, price: e.predictedPrice}));

    if (data.length === 0) {
        return <p className="text-sm text-gray-500">No data yet</p>;
    }
    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{top: 8, right: 8, bottom: 8, left: 8}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="name" fontSize={12}/>
                    <YAxis fontSize={12} width={70} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}/>
                    <Tooltip formatter={(v: number) => `$${Number(v).toLocaleString()}`}/>
                    <Bar dataKey="price" fill="#2563eb" radius={[4, 4, 0, 0]}/>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
