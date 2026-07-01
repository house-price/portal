// Client-side form validation. Mirrors the backend constraints so users get
// instant feedback before a request is sent.
import type {PropertyFeatures} from "./types";

export type FormErrors = Partial<Record<keyof PropertyFeatures, string>>;

// Returns an errors object; empty object means valid.
export function validateFeatures(f: Partial<PropertyFeatures>): FormErrors {
    const e: FormErrors = {};
    const num = (v: unknown) => typeof v === "number" && !Number.isNaN(v);

    if (!num(f.squareFootage) || (f.squareFootage as number) <= 0)
        e.squareFootage = "Must be greater than 0";
    if (!num(f.bedrooms) || (f.bedrooms as number) < 0)
        e.bedrooms = "Must be 0 or more";
    if (!num(f.bathrooms) || (f.bathrooms as number) < 0)
        e.bathrooms = "Must be 0 or more";
    if (!num(f.yearBuilt) || (f.yearBuilt as number) < 1800 || (f.yearBuilt as number) > 2100)
        e.yearBuilt = "Must be 1800-2100";
    if (!num(f.lotSize) || (f.lotSize as number) <= 0)
        e.lotSize = "Must be greater than 0";
    if (!num(f.distanceToCityCenter) || (f.distanceToCityCenter as number) < 0)
        e.distanceToCityCenter = "Must be 0 or more";
    if (!num(f.schoolRating) || (f.schoolRating as number) < 0 || (f.schoolRating as number) > 10)
        e.schoolRating = "Must be 0-10";

    return e;
}
