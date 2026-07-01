// Simple card container
import type {ReactNode} from "react";

export function Card({title, children}: { title?: string; children: ReactNode }) {
    return (
        <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            {title && <h2 className="mb-3 text-lg font-semibold text-gray-800">{title}</h2>}
            {children}
        </section>
    );
}
