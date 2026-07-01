// Route handler = a same-origin backend endpoint provided by Next.
// GET  /api/estimates  -> list history ; POST /api/estimates -> create an estimate.
// The browser calls these (no CORS); Next forwards to the Python estimator backend.
import {NextResponse} from "next/server";
import {createEstimate, listEstimates} from "@/lib/api";
import type {PropertyFeatures} from "@/lib/types";

export async function GET() {
    try {
        return NextResponse.json(await listEstimates());
    } catch (e) {
        return NextResponse.json({error: String(e)}, {status: 502});
    }
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as PropertyFeatures & { label?: string | null };
        const created = await createEstimate(body);
        return NextResponse.json(created, {status: 201});
    } catch (e) {
        return NextResponse.json({error: String(e)}, {status: 502});
    }
}
