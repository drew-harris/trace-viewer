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
    pressEnter: z.boolean().optional(), // Added pressEnter
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
    contextChoice: z.enum(["VISION_ONLY"]).optional(), // Added contextChoice
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
  status: z.enum(["PASSED", "FAILED", "SKIPPED", "RUNNING"]),
  resolvedBaseUrl: z.string().url(),
  environmentName: z.string().optional(), // Added environmentName
  cliVersion: z.string(),
  schemaVersion: z.string(),
  startedAt: z.string().datetime(),
  attempts: z.number().int().positive(),
  finishedAt: z.string().datetime(),
  failureDetails: z
    .object({
      errorMessage: z.string(),
    })
    .optional(), // Added failureDetails
  failureReason: z.string().optional(), // Added failureReason
  flake: z.boolean(),
});

export type MomenticTest = z.infer<typeof MomenticTestSchema>;
