"use client";
// Top navigation shared by both apps. "use client" because it reads the current
// path (a browser-only hook) to highlight the active link.
import Link from "next/link";
import {usePathname} from "next/navigation";

const links = [
    {href: "/estimator", label: "Property Estimator"},
    {href: "/market", label: "Market Analysis"},
];

export function Nav() {
    const pathname = usePathname();
    return (
        <nav className="border-b border-gray-200 bg-white">
            <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
                <Link href="/" className="text-lg font-bold text-brand">
                    House&nbsp;Price
                </Link>
                <div className="flex gap-1">
                    {links.map((l) => {
                        const active = pathname.startsWith(l.href);
                        return (
                            <Link
                                key={l.href}
                                href={l.href}
                                aria-current={active ? "page" : undefined}
                                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                                    active ? "bg-brand-light text-brand-dark" : "text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                {l.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
