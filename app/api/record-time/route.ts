import { timingSafeEqual } from "node:crypto";
import { connectDB } from "@/lib/mongodb";
import { TimeRecordModel } from "@/models/TimeRecord";

// Expects `Authorization: Bearer <CRON_SECRET>` from the cron service.
function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const expected = Buffer.from(`Bearer ${secret}`);
  const received = Buffer.from(request.headers.get("authorization") ?? "");
  return (
    received.length === expected.length && timingSafeEqual(received, expected)
  );
}

// GET so it can be triggered from a cron service.
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

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
