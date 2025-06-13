import { useSuspenseQuery } from "@tanstack/react-query";
import { client } from "../fetch";
import type { LogEntry } from "@/schemas/logs";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const ConsoleView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data } = useSuspenseQuery({
    queryKey: ["logs", 1],
    queryFn: () =>
      client.api.runGroup.logs[":id"]
        .$get({ json: {}, param: { id: "1" } })
        .then((r) => r.json())
        .then((r) => r.flatMap((l) => l)),
  });

  const filteredLogs = data.filter((line) =>
    line.text.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-0 border-b border-neutral-700/40">
        <input
          type="text"
          placeholder="Search logs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-0 focus:ring-blue-500"
        />
      </div>
      <div className="flex-1 overflow-auto">
        <div>
          {filteredLogs.map((line) => (
            <LogLine key={line.timestamp} line={line} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const LogLine = ({ line }: { line: LogEntry }) => {
  const getTypeColor = (type: LogEntry["type"]) => {
    switch (type) {
      case "error":
        return "text-red-400";
      case "warning":
        return "text-yellow-400";
      case "info":
        return "text-blue-300";
      case "verbose":
        return "text-gray-500";
      default:
        return "text-white";
    }
  };

  return (
    <div
      className={cn(
        "flex p-2 border-b border-b-neutral-700/40 items-center gap-2",
      )}
    >
      <div className="flex flex-col">
        <div className={cn("text-sm font-mono", getTypeColor(line.type))}>
          {line.text}
        </div>
        <div className="text-xs text-neutral-500">
          {format(new Date(line.timestamp), "MMM d, yyyy 'at' h:mm:ss a")}
        </div>
      </div>
    </div>
  );
};
