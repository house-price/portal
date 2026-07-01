"use client";
import {Button} from "@/components/ui/Button";

export default function Error({error, reset}: { error: Error; reset: () => void }) {
    return (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-5">
            <h2 className="mb-2 font-semibold text-red-800">Market service unavailable</h2>
            <p className="mb-4 text-sm text-red-700">{error.message}</p>
            <Button variant="secondary" onClick={reset}>Try again</Button>
        </div>
    );
}
