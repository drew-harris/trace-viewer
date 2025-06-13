import { ResultAsync } from "neverthrow";
import type { JSONValue } from "hono/utils/types";
import { z, type ZodSchema } from "zod";
import type { Context } from "hono";

export const safeRoute = <
  T extends JSONValue,
  M extends string,
  Z extends ZodSchema,
  W extends string = "json",
>(
  handler: (
    c: Context<
      any,
      M,
      {
        out: {
          [type in W]: z.infer<Z>;
        };
        in: {
          [type in W]: z.infer<Z>;
        };
      }
    >,
    input: z.infer<Z>,
  ) => ResultAsync<T, Error>,
  schema?: Z,
  inputMethod: W = "json" as W,
) => {
  return async (
    c: Context<
      any,
      M,
      {
        out: {
          [type in W]: z.infer<Z>;
        };
        in: {
          [type in W]: z.infer<Z>;
        };
      }
    >,
  ) => {
    let input: z.infer<Z> = null;
    if (schema) {
      if (inputMethod === "json") {
        input = schema.parse(await c.req.json());
      }
      if (inputMethod === "query") {
        input = schema.parse(c.req.query());
      }
    }

    const result = await handler(c, input);
    if (result.isOk()) {
      return c.json(result.value);
    } else {
      // have to throw error to keep types happy
      console.log(result.error);
      throw result.error;
    }
  };
};
