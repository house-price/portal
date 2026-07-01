"use client";
// EstimatorApp = the interactive core of Property Estimator. Client component because it holds form
// state and handles clicks. Combines: input form (with validation), latest result table,
// a chart, history list, and a side-by-side comparison of selected properties.
import {useMemo, useState} from "react";
import {Button} from "@/components/ui/Button";
import {Card} from "@/components/ui/Card";
import {Field} from "@/components/ui/Field";
import {ResultChart} from "@/components/estimator/ResultChart";
import {useEstimates} from "@/hooks/useEstimates";
import {type FormErrors, validateFeatures} from "@/lib/validation";
import type {Estimate, PropertyFeatures} from "@/lib/types";

type FormState = Partial<Record<keyof PropertyFeatures, number | "">> & { label: string };

const EMPTY: FormState = {
    squareFootage: "", bedrooms: "", bathrooms: "", yearBuilt: "",
    lotSize: "", distanceToCityCenter: "", schoolRating: "", label: "",
};

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

export function EstimatorApp({initialHistory}: { initialHistory: Estimate[] }) {
    const {estimates, submitting, error, create, remove} = useEstimates(initialHistory);
    const [form, setForm] = useState<FormState>(EMPTY);
    const [errors, setErrors] = useState<FormErrors>({});
    const [latest, setLatest] = useState<Estimate | null>(null);
    const [selected, setSelected] = useState<number[]>([]); // ids chosen for comparison

    const setField = (k: keyof PropertyFeatures) => (v: number | "") =>
        setForm((f) => ({...f, [k]: v}));

    async function onSubmit() {
        // convert "" to undefined for validation
        const features = {
            squareFootage: form.squareFootage, bedrooms: form.bedrooms, bathrooms: form.bathrooms,
            yearBuilt: form.yearBuilt, lotSize: form.lotSize,
            distanceToCityCenter: form.distanceToCityCenter, schoolRating: form.schoolRating,
        } as Partial<PropertyFeatures>;

        const errs = validateFeatures(features);
        setErrors(errs);
        if (Object.keys(errs).length > 0) return; // stop on validation errors

        const created = await create({...(features as PropertyFeatures), label: form.label || null});
        setLatest(created);
    }

    const toggleSelect = (id: number) =>
        setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

    const compared = useMemo(
        () => estimates.filter((e) => selected.includes(e.id)),
        [estimates, selected],
    );

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold text-gray-800">Property Value Estimator</h1>

            {/* ---- input form ---- */}
            <Card title="Enter property details">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Field label="Square footage" name="squareFootage" value={form.squareFootage ?? ""} onChange={setField("squareFootage")}
                           error={errors.squareFootage}/>
                    <Field label="Bedrooms" name="bedrooms" value={form.bedrooms ?? ""} onChange={setField("bedrooms")} step="1"
                           error={errors.bedrooms}/>
                    <Field label="Bathrooms" name="bathrooms" value={form.bathrooms ?? ""} onChange={setField("bathrooms")} step="0.5"
                           error={errors.bathrooms}/>
                    <Field label="Year built" name="yearBuilt" value={form.yearBuilt ?? ""} onChange={setField("yearBuilt")} step="1"
                           error={errors.yearBuilt}/>
                    <Field label="Lot size" name="lotSize" value={form.lotSize ?? ""} onChange={setField("lotSize")}
                           error={errors.lotSize}/>
                    <Field label="Distance to city center" name="distanceToCityCenter" value={form.distanceToCityCenter ?? ""}
                           onChange={setField("distanceToCityCenter")} error={errors.distanceToCityCenter}/>
                    <Field label="School rating (0-10)" name="schoolRating" value={form.schoolRating ?? ""}
                           onChange={setField("schoolRating")} error={errors.schoolRating}/>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="label" className="text-sm font-medium text-gray-700">Label (optional)</label>
                        <input id="label" value={form.label}
                               onChange={(e) => setForm((f) => ({...f, label: e.target.value}))}
                               className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"/>
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                    <Button onClick={onSubmit} disabled={submitting}>
                        {submitting ? "Estimating..." : "Estimate"}
                    </Button>
                    <Button variant="secondary" onClick={() => {
                        setForm(EMPTY);
                        setErrors({});
                    }}>
                        Reset
                    </Button>
                    {error && <span role="alert" className="text-sm text-red-600">{error}</span>}
                </div>
            </Card>

            {/* ---- latest result as a table ---- */}
            {latest && (
                <Card title="Result">
                    <p className="mb-3 text-2xl font-bold text-brand">{money(latest.predictedPrice)}</p>
                    <table className="w-full text-sm">
                        <tbody>
                        {([
                            ["Square footage", latest.squareFootage],
                            ["Bedrooms", latest.bedrooms],
                            ["Bathrooms", latest.bathrooms],
                            ["Year built", latest.yearBuilt],
                            ["Lot size", latest.lotSize],
                            ["Distance to city center", latest.distanceToCityCenter],
                            ["School rating", latest.schoolRating],
                        ] as [string, number][]).map(([k, v]) => (
                            <tr key={k} className="border-b border-gray-100">
                                <td className="py-1.5 text-gray-500">{k}</td>
                                <td className="py-1.5 text-right font-medium">{v}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </Card>
            )}

            {/* ---- chart ---- */}
            <Card title="Predicted prices (recent)">
                <ResultChart estimates={estimates}/>
            </Card>

            {/* ---- history with select-to-compare + delete ---- */}
            <Card title="History">
                {estimates.length === 0 ? (
                    <p className="text-sm text-gray-500">No estimates yet</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="border-b border-gray-200 text-left text-gray-500">
                                <th className="py-2">Compare</th>
                                <th className="py-2">Label</th>
                                <th className="py-2 text-right">Sqft</th>
                                <th className="py-2 text-right">Beds</th>
                                <th className="py-2 text-right">Price</th>
                                <th className="py-2"></th>
                            </tr>
                            </thead>
                            <tbody>
                            {estimates.map((e) => (
                                <tr key={e.id} className="border-b border-gray-100">
                                    <td className="py-2">
                                        <input type="checkbox" checked={selected.includes(e.id)}
                                               onChange={() => toggleSelect(e.id)}
                                               aria-label={`Select estimate ${e.id} for comparison`}/>
                                    </td>
                                    <td className="py-2">{e.label || `#${e.id}`}</td>
                                    <td className="py-2 text-right">{e.squareFootage}</td>
                                    <td className="py-2 text-right">{e.bedrooms}</td>
                                    <td className="py-2 text-right font-medium">{money(e.predictedPrice)}</td>
                                    <td className="py-2 text-right">
                                        <button onClick={() => remove(e.id)} className="text-xs text-red-600 hover:underline">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* ---- side-by-side comparison of selected properties ---- */}
            {compared.length >= 2 && (
                <Card title={`Comparison (${compared.length})`}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="border-b border-gray-200 text-left text-gray-500">
                                <th className="py-2">Feature</th>
                                {compared.map((e) => (
                                    <th key={e.id} className="py-2 text-right">{e.label || `#${e.id}`}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {([
                                ["Price", (e: Estimate) => money(e.predictedPrice)],
                                ["Square footage", (e: Estimate) => e.squareFootage],
                                ["Bedrooms", (e: Estimate) => e.bedrooms],
                                ["Bathrooms", (e: Estimate) => e.bathrooms],
                                ["Year built", (e: Estimate) => e.yearBuilt],
                                ["Lot size", (e: Estimate) => e.lotSize],
                                ["School rating", (e: Estimate) => e.schoolRating],
                            ] as [string, (e: Estimate) => number | string][]).map(([label, fn]) => (
                                <tr key={label} className="border-b border-gray-100">
                                    <td className="py-2 text-gray-500">{label}</td>
                                    {compared.map((e) => (
                                        <td key={e.id} className="py-2 text-right font-medium">{fn(e)}</td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );
}
