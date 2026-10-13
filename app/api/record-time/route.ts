import { connectDB } from "@/lib/mongodb";
import { TimeRecordModel } from "@/models/TimeRecord";

// GET so it can be triggered from a browser or a cron service.
export async function GET() {
  try {
    await connectDB();
    const record = await TimeRecordModel.create({ recordedAt: new Date() });

    return Response.json(
      { ok: true, id: record._id, recordedAt: record.recordedAt },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to save time record:", error);
    return Response.json(
      { ok: false, error: "Failed to save time record" },
      { status: 500 },
    );
  }
}
