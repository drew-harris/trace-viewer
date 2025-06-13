import { hc } from "hono/client";
import type { ApiType } from "./api";

export const client = hc<ApiType>("/", {
  async fetch(input, requestInit, _) {
    const response = await fetch(input, { ...requestInit });
    if (!response.ok) {
      throw new Error(((await response.json()) as { error: string }).error);
    }
    return response;
  },
});
