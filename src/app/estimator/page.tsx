// Property Estimator page. Server Component: it fetches the initial history ON THE SERVER (RSC data
// loading) and passes it to the interactive client component. If the backend is down,
// the thrown error is caught by error.tsx below.
import {EstimatorApp} from "@/components/estimator/EstimatorApp";
import {listEstimates} from "@/lib/api";

export const dynamic = "force-dynamic"; // always fresh, never statically cached

export default async function EstimatorPage() {
    const history = await listEstimates();
    return <EstimatorApp initialHistory={history}/>;
}
