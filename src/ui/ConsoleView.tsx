import { useSuspenseQuery } from "@tanstack/react-query";
import { client } from "../fetch";
import type { LogEntry } from "@/schemas/logs";

export const ConsoleView = () => {
  const { data } = useSuspenseQuery({
    queryKey: ["logs", 1],
    queryFn: () =>
      client.api.runGroup.logs[":id"]
        .$get({ json: {}, param: { id: "1" } })
        .then((r) => r.json())
        .then((r) => r.flatMap((l) => l)),
  });
  return (
    <div className="max-h-full overflow-scroll">
      <div>
        {data.map((line) => (
          <LogLine key={line.url} line={line} />
        ))}
      </div>
    </div>
  );
};

export const LogLine = ({ line }: { line: LogEntry }) => {
  return (
    <div className="flex items-center gap-2">
      {/* <div className="w-8 h-8 bg-red-500 rounded-full"></div> */}
      <div className="flex flex-col">
        <div className="text-sm">{line.text}</div>
        <div className="text-xs text-neutral-500">
          {line.timestamp} {line.tabIndex}
        </div>
      </div>
    </div>
  );
};
