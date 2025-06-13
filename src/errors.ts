import type { ResultAsync } from "neverthrow";

export const mustAsync = async <T>(
  result: ResultAsync<T, Error>,
): Promise<T> => {
  const awaited = await result;
  if (awaited.isErr()) {
    console.error(awaited.error.message);
    process.exit(1);
  }
  return awaited.value;
};
