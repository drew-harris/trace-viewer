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
  message: z.string(),
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

export const attemptSchema = z.object({
  schemaVersion: z.string(),
  startedAt: z.string().datetime(),
  status: z.enum(["PASSED", "FAILED"]),
  finishedAt: z.string().datetime(),
  results: z.array(presetActionResultSchema),
});

export type Attempt = z.infer<typeof attemptSchema>;
