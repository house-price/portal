// Reusable button with variants (part of the shared design system).
import type {ButtonHTMLAttributes} from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "danger";
};

const styles: Record<string, string> = {
    primary: "bg-brand text-white hover:bg-brand-dark",
    secondary: "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
};

export function Button({variant = "primary", className = "", ...rest}: Props) {
    return (
        <button
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]} ${className}`}
            {...rest}
        />
    );
}
