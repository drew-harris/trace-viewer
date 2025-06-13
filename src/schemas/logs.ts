import { z } from "zod";

const LocationSchema = z.object({
  url: z.string(),
  lineNumber: z.number(),
  columnNumber: z.number(),
});

const LogEntrySchema = z.object({
  url: z.string(),
  location: LocationSchema,
  type: z.enum(["warning", "info", "log", "error", "verbose"]),
  text: z.string(),
  args: z.array(z.unknown()),
  tabIndex: z.number(),
  timestamp: z.number(),
});

export const LogSchema = z.array(z.array(LogEntrySchema));

export type LogEntry = z.infer<typeof LogEntrySchema>;
export type Log = z.infer<typeof LogSchema>;
