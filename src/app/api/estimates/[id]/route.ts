// DELETE /api/estimates/{id} -> remove one history entry.
import {NextResponse} from "next/server";
import {deleteEstimate} from "@/lib/api";

// In Next 15, dynamic route params are async (a Promise) and must be awaited.
export async function DELETE(
    _request: Request,
    {params}: { params: Promise<{ id: string }> },
) {
    const {id} = await params;
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) {
        return NextResponse.json({error: "Invalid id"}, {status: 400});
    }
    try {
        await deleteEstimate(numericId);
        return new NextResponse(null, {status: 204});
    } catch (e) {
        return NextResponse.json({error: String(e)}, {status: 502});
    }
}
