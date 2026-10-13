import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const timeRecordSchema = new Schema({
  recordedAt: { type: Date, required: true, default: Date.now },
});

export type TimeRecord = InferSchemaType<typeof timeRecordSchema>;

// Reuse the compiled model across hot reloads to avoid OverwriteModelError.
export const TimeRecordModel: Model<TimeRecord> =
  (models.TimeRecord as Model<TimeRecord>) ?? model("TimeRecord", timeRecordSchema);
