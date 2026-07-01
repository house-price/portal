// Landing page: brief intro + links into the two apps.
import Link from "next/link";
import {Card} from "@/components/ui/Card";

export default function HomePage() {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold text-gray-800">House Price Platform</h1>
            <div className="grid gap-4 sm:grid-cols-2">
                <Link href="/estimator">
                    <Card title="Property Estimator">
                        <p className="text-sm text-gray-600">
                            Enter property details to predict its price, view results as a chart, and compare saved properties.
                        </p>
                    </Card>
                </Link>
                <Link href="/market">
                    <Card title="Market Analysis">
                        <p className="text-sm text-gray-600">
                            Explore market statistics with filters, run what-if predictions, and export data.
                        </p>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
