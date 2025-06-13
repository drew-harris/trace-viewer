import { z } from "zod";

const CommandTypeSchema = z.enum([
  "TYPE",
  "PRESS",
  "CLICK",
  "AI_ASSERTION",
  "JAVASCRIPT", // Added JAVASCRIPT
]);

const TargetSchema = z.object({
  type: z.enum(["description"]),
  elementDescriptor: z.string(),
});

const CommandSchema = z.discriminatedUnion("type", [
  z.object({
    id: z.string().uuid(),
    clearContent: z.boolean().optional(),
    pressEnter: z.boolean().optional(),
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
    contextChoice: z.enum(["VISION_ONLY"]).optional(),
  }),
  z.object({
    id: z.string().uuid(),
    type: z.literal("JAVASCRIPT"), // Added JAVASCRIPT command
    code: z.string(), // JAVASCRIPT commands have a 'code' field
  }),
]);

const PresetActionStepSchema = z.object({
  id: z.string().uuid(),
  type: z.literal("PRESET_ACTION"),
  command: CommandSchema,
  envKey: z.string().optional(), // Added envKey for PRESET_ACTION
});

// Define the schema for a resolved module in the stepsSnapshot
const ResolvedModuleStepSchema = z.object({
  moduleId: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  enabled: z.boolean(),
  parameters: z.array(z.any()), // Assuming parameters can be any type for now
  defaultParameters: z.record(z.string(), z.any()),
  defaultCacheKey: z.string().nullable(),
  defaultCacheTtl: z.number().nullable(),
  defaultCacheAllInvocations: z.boolean().nullable(),
  autoAuth: z.boolean().nullable(),
  advanced: z.record(z.string(), z.any()), // Assuming advanced can be any type
  steps: z.array(PresetActionStepSchema), // Steps within a resolved module are Preset Actions
  schemaVersion: z.string(),
  id: z.string().uuid(),
  type: z.literal("RESOLVED_MODULE"),
});

// Refactor StepSnapshotSchema to be a discriminated union
const StepSnapshotSchema = z.discriminatedUnion("type", [
  PresetActionStepSchema,
  ResolvedModuleStepSchema,
]);

export const MomenticTestSchema = z.object({
  stepsSnapshot: z.array(StepSnapshotSchema),
  runGroupId: z.string().uuid(),
  testId: z.string().uuid(),
  testName: z.string(),
  labels: z.array(z.string()).optional(), // Added labels from the example JSON
  trigger: z.literal("CLI"),
  status: z.enum(["PASSED", "FAILED", "SKIPPED", "RUNNING"]),
  resolvedBaseUrl: z.string().url(),
  environmentName: z.string().optional(),
  cliVersion: z.string(),
  schemaVersion: z.string(),
  startedAt: z.string().datetime(),
  attempts: z.number().int().positive(),
  finishedAt: z.string().datetime(),
  failureDetails: z
    .object({
      errorMessage: z.string(),
    })
    .optional(),
  failureReason: z.string().optional(),
  flake: z.boolean(),
});

export type MomenticTest = z.infer<typeof MomenticTestSchema>;
