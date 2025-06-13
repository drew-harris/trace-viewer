import { z } from "zod";

const resultDetailSchema = z.object({
  beforeUrl: z.string(),
  afterUrl: z.string(),
  beforeSnapshot: z.string(),
  afterSnapshot: z.string(),
  startedAt: z.string().datetime(),
  finishedAt: z.string().datetime(),
  viewport: z
    .object({
      height: z.number(),
      width: z.number(),
    })
    .optional(),
  status: z.enum(["SUCCESS", "FAILED"]),
  elementInteracted: z.string().optional(),
  message: z.string().optional(), // Added for FAILED status
});

const commandSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(["TYPE", "PRESS", "CLICK", "AI_ASSERTION"]),
  clearContent: z.boolean().optional(),
  pressEnter: z.boolean().optional(),
  target: z
    .object({
      type: z.string(),
      elementDescriptor: z.string(),
    })
    .optional(),
  value: z.string().optional(),
  assertion: z.string().optional(),
  contextChoice: z.string().optional(),
});

const presetActionResultSchema = z.object({
  beforeUrl: z.string(),
  afterUrl: z.string(),
  message: z.string().optional(), // Made optional
  beforeSnapshot: z.string(),
  afterSnapshot: z.string(),
  startedAt: z.string().datetime(),
  finishedAt: z.string().datetime(),
  status: z.enum(["SUCCESS", "FAILED"]),
  beforeTestContext: z.object({
    env: z.record(z.string(), z.string()),
  }),
  afterTestContext: z.object({
    env: z.record(z.string(), z.string()),
  }),
  id: z.string().uuid(),
  type: z.literal("PRESET_ACTION"),
  command: commandSchema,
  results: z.array(resultDetailSchema),
  failureReason: z.string().optional(), // Added for FAILED status
});

const moduleResultSchema = z.object({
  beforeUrl: z.string(),
  afterUrl: z.string(),
  beforeSnapshot: z.string(),
  afterSnapshot: z.string(),
  startedAt: z.string().datetime(),
  finishedAt: z.string().datetime(),
  status: z.enum(["SUCCESS", "FAILED"]),
  beforeTestContext: z.object({
    env: z.record(z.string(), z.string()),
  }),
  afterTestContext: z.object({
    env: z.record(z.string(), z.string()),
  }),
  id: z.string().uuid(),
  inputs: z.record(z.string(), z.string()).optional(),
  type: z.literal("MODULE"),
  moduleId: z.string().uuid(),
  moduleName: z.string(),
  results: z.array(presetActionResultSchema),
});

export const attemptSchema = z.object({
  schemaVersion: z.string(),
  startedAt: z.string().datetime(),
  status: z.enum(["PASSED", "FAILED"]),
  finishedAt: z.string().datetime(),
  results: z.array(z.union([presetActionResultSchema, moduleResultSchema])),
});

export type Attempt = z.infer<typeof attemptSchema>;
export type Result = Attempt["results"][0];

export type Module = z.infer<typeof moduleResultSchema>;

export type Action = z.infer<typeof presetActionResultSchema>;

export const isModule = (result: Result): result is Module =>
  result.type === "MODULE";

export const isPresetAction = (result: Result): result is Action =>
  result.type === "PRESET_ACTION";
