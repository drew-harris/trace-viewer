import { z } from "zod";

const CommandTypeSchema = z.enum(["TYPE", "PRESS", "CLICK", "AI_ASSERTION"]);

const TargetSchema = z.object({
  type: z.enum(["description"]),
  elementDescriptor: z.string(),
});

const CommandSchema = z.discriminatedUnion("type", [
  z.object({
    id: z.string().uuid(),
    clearContent: z.boolean().optional(),
    type: z.literal("TYPE"),
    target: TargetSchema.optional(),
    value: z.string(),
  }),
  z.object({
    id: z.string().uuid(),
    type: z.literal("PRESS"),
    value: z.string(),
  }),
  z.object({
    id: z.string().uuid(),
    type: z.literal("CLICK"),
    target: TargetSchema,
  }),
  z.object({
    id: z.string().uuid(),
    type: z.literal("AI_ASSERTION"),
    assertion: z.string(),
  }),
]);

const StepSnapshotSchema = z.object({
  id: z.string().uuid(),
  type: z.literal("PRESET_ACTION"),
  command: CommandSchema,
});

export const MomenticTestSchema = z.object({
  stepsSnapshot: z.array(StepSnapshotSchema),
  runGroupId: z.string().uuid(),
  testId: z.string().uuid(),
  testName: z.string(),
  trigger: z.literal("CLI"),
  status: z.enum(["PASSED", "FAILED", "SKIPPED", "RUNNING"]), // Added other possible statuses
  resolvedBaseUrl: z.string().url(),
  cliVersion: z.string(),
  schemaVersion: z.string(),
  startedAt: z.string().datetime(),
  attempts: z.number().int().positive(),
  finishedAt: z.string().datetime(),
  flake: z.boolean(),
});

export type MomenticTest = z.infer<typeof MomenticTestSchema>;
