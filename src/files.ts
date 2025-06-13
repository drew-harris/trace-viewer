import { errAsync, fromPromise, ResultAsync } from "neverthrow";
import unzipper from "unzipper";
import type { z, ZodSchema } from "zod";

export const unzipFile = (
  file: string,
): ResultAsync<unzipper.CentralDirectory, Error> => {
  const result = fromPromise(
    unzipper.Open.file(file),
    (e) => new Error("Couldn't unzip file"),
  );
  return result;
};

export const parseZipPath = <Z extends ZodSchema>(
  directory: unzipper.CentralDirectory,
  path: string,
  schema: Z,
): ResultAsync<z.infer<Z>, Error> => {
  const file = directory.files.find((f) => f.path === path);
  if (!file) {
    return errAsync(new Error("Couldn't find file"));
  }
  console.log(file);
  const result = fromPromise(
    file.buffer(),
    (e) => new Error("Couldn't find file and get buffer"),
  )
    // TODO: Fix error
    .map((buffer) => JSON.parse(buffer.toString()))
    .andTee((parsed) => {
      console.log(parsed);
    })
    .andThen((parsed) =>
      fromPromise(
        schema.parseAsync(parsed),
        (e) => new Error("Couldn't parse file", { cause: e }),
      ),
    );
  return result;
};
