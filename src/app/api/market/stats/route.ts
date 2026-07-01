// GET /api/market/stats?bedrooms=&minPrice=... -> proxied market statistics.
import {NextResponse} from "next/server";
import {getMarketStats} from "@/lib/api";
import type {MarketFilter} from "@/lib/types";

export async function GET(request: Request) {
    try {
        const sp = new URL(request.url).searchParams;
        const numOrUndef = (k: string) =>
            sp.get(k) != null && sp.get(k) !== "" ? Number(sp.get(k)) : undefined;
        const filter: MarketFilter = {
            bedrooms: numOrUndef("bedrooms"),
            minPrice: numOrUndef("minPrice"),
            maxPrice: numOrUndef("maxPrice"),
            minYearBuilt: numOrUndef("minYearBuilt"),
            maxYearBuilt: numOrUndef("maxYearBuilt"),
        };
        return NextResponse.json(await getMarketStats(filter));
    } catch (e) {
        return NextResponse.json({error: String(e)}, {status: 502});
    }
}
