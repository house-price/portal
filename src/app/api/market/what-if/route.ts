// POST /api/market/what-if -> proxied "what-if" price prediction (via Java -> ML).
import {NextResponse} from "next/server";
import {whatIf} from "@/lib/api";
import type {PropertyFeatures} from "@/lib/types";

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as PropertyFeatures;
        return NextResponse.json(await whatIf(body));
    } catch (e) {
        return NextResponse.json({error: String(e)}, {status: 502});
    }
}
