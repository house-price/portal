// Labeled numeric input with an accessible error message.
type Props = {
    label: string;
    name: string;
    value: number | "";
    onChange: (v: number | "") => void;
    step?: string;
    error?: string;
};

export function Field({label, name, value, onChange, step = "any", error}: Props) {
    const errorId = `${name}-error`;
    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={name} className="text-sm font-medium text-gray-700">
                {label}
            </label>
            <input
                id={name}
                name={name}
                type="number"
                step={step}
                value={value}
                // aria-invalid / aria-describedby help screen readers announce the error (WCAG)
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
                onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
                className={`rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand ${
                    error ? "border-red-500" : "border-gray-300"
                }`}
            />
            {error && (
                <p id={errorId} role="alert" className="text-xs text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}
