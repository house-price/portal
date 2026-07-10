// Small shared helpers used by both apps (client and server safe).

// Format a number as a whole-dollar amount, e.g. 123456.7 -> "$123,457"
export const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

// Build a query string from a params object, skipping empty values.
export function toQueryString(params: object): string {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
    }
    return qs.toString();
}
