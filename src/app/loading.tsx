// Layout-level loading UI: shown automatically while a route's server component loads.
import {Spinner} from "@/components/ui/Spinner";

export default function Loading() {
    return <Spinner label="Loading..."/>;
}
