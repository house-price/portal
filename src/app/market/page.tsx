// Market Analysis page. Server Component: fetches the initial (unfiltered) market stats on the
// server, then hands them to the interactive dashboard.
import {MarketApp} from "@/components/market/MarketApp";
import {getMarketStats} from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function MarketPage() {
    const stats = await getMarketStats({});
    return <MarketApp initialStats={stats}/>;
}
