"use client";
// Custom hook: encapsulates history state + create/delete calls to the same-origin
// /api/estimates route handlers. This is the "custom hooks for shared functionality"
// the task asks for. Seeded with `initial` (fetched on the server) to avoid a refetch.
import {useCallback, useState} from "react";
import type {Estimate, PropertyFeatures} from "@/lib/types";

export function useEstimates(initial: Estimate[]) {
    const [estimates, setEstimates] = useState<Estimate[]>(initial);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = useCallback(
        async (input: PropertyFeatures & { label?: string | null }) => {
            setSubmitting(true);
            setError(null);
            try {
                const res = await fetch("/api/estimates", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(input),
                });
                if (!res.ok) throw new Error(`Request failed (${res.status})`);
                const created = (await res.json()) as Estimate;
                setEstimates((prev) => [created, ...prev]); // newest first
                return created;
            } catch (e) {
                setError(e instanceof Error ? e.message : String(e));
                throw e;
            } finally {
                setSubmitting(false);
            }
        },
        [],
    );

    const remove = useCallback(async (id: number) => {
        setError(null);
        try {
            const res = await fetch(`/api/estimates/${id}`, {method: "DELETE"});
            if (!res.ok) throw new Error(`Request failed (${res.status})`);
            setEstimates((prev) => prev.filter((e) => e.id !== id));
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        }
    }, []);

    return {estimates, submitting, error, create, remove};
}
