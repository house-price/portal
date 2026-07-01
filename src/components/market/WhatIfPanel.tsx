"use client";
// "What-if" tool: enter hypothetical features, get a predicted price (Java -> ML) plus
// how it compares to the market average.
import {useState} from "react";
import {Button} from "@/components/ui/Button";
import {Field} from "@/components/ui/Field";
import {useWhatIf} from "@/hooks/useMarket";
import {type FormErrors, validateFeatures} from "@/lib/validation";
import type {PropertyFeatures} from "@/lib/types";

type FormState = Partial<Record<keyof PropertyFeatures, number | "">>;
const EMPTY: FormState = {
    squareFootage: "", bedrooms: "", bathrooms: "", yearBuilt: "",
    lotSize: "", distanceToCityCenter: "", schoolRating: "",
};
const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

export function WhatIfPanel() {
    const {result, loading, error, run} = useWhatIf();
    const [form, setForm] = useState<FormState>(EMPTY);
    const [errors, setErrors] = useState<FormErrors>({});

    const setField = (k: keyof PropertyFeatures) => (v: number | "") =>
        setForm((f) => ({...f, [k]: v}));

    async function onRun() {
        const errs = validateFeatures(form as Partial<PropertyFeatures>);
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;
        await run(form as PropertyFeatures);
    }

    return (
        <div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Square footage" name="wi-squareFootage" value={form.squareFootage ?? ""} onChange={setField("squareFootage")}
                       error={errors.squareFootage}/>
                <Field label="Bedrooms" name="wi-bedrooms" value={form.bedrooms ?? ""} onChange={setField("bedrooms")} step="1"
                       error={errors.bedrooms}/>
                <Field label="Bathrooms" name="wi-bathrooms" value={form.bathrooms ?? ""} onChange={setField("bathrooms")} step="0.5"
                       error={errors.bathrooms}/>
                <Field label="Year built" name="wi-yearBuilt" value={form.yearBuilt ?? ""} onChange={setField("yearBuilt")} step="1"
                       error={errors.yearBuilt}/>
                <Field label="Lot size" name="wi-lotSize" value={form.lotSize ?? ""} onChange={setField("lotSize")} error={errors.lotSize}/>
                <Field label="Distance to city center" name="wi-distance" value={form.distanceToCityCenter ?? ""}
                       onChange={setField("distanceToCityCenter")} error={errors.distanceToCityCenter}/>
                <Field label="School rating (0-10)" name="wi-school" value={form.schoolRating ?? ""} onChange={setField("schoolRating")}
                       error={errors.schoolRating}/>
            </div>
            <div className="mt-4 flex items-center gap-3">
                <Button onClick={onRun} disabled={loading}>
                    {loading ? "Predicting..." : "Run what-if"}
                </Button>
                {error && <span role="alert" className="text-sm text-red-600">{error}</span>}
            </div>

            {result && (
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-md bg-brand-light p-3">
                        <p className="text-xs text-gray-600">Predicted price</p>
                        <p className="text-xl font-bold text-brand-dark">{money(result.predictedPrice)}</p>
                    </div>
                    <div className="rounded-md bg-gray-100 p-3">
                        <p className="text-xs text-gray-600">Market average</p>
                        <p className="text-xl font-bold text-gray-800">{money(result.marketAvgPrice)}</p>
                    </div>
                    <div className="rounded-md bg-gray-100 p-3">
                        <p className="text-xs text-gray-600">Difference</p>
                        <p className={`text-xl font-bold ${result.differenceFromMarketAvg >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {result.differenceFromMarketAvg >= 0 ? "+" : ""}{money(result.differenceFromMarketAvg)}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
