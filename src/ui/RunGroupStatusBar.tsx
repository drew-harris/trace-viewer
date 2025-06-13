import type { MomenticTest } from "@/schemas/testGroup";
import { Check, CircleOff, Radio, X } from "lucide-react";

export const RunGroupStatusBar = ({ runGroup }: { runGroup: MomenticTest }) => {
  return (
    <div className="p-2 flex justify-between items-center bg-neutral-800 border-b border-b-neutral-600">
      <div className="flex gap-4 items-center">
        <div className="font-bold px-2">{runGroup.testName}</div>
        <RunGroupStatus status={runGroup.status as any} />
        <div>{runGroup.attempts} Attempts</div>
      </div>
      <div className="text-sm opacity-80 pr-4">Trigger: {runGroup.trigger}</div>
    </div>
  );
};

export const RunGroupStatus = ({
  status,
}: {
  status: MomenticTest["status"];
}) => {
  const getStatusConfig = (status: MomenticTest["status"]) => {
    switch (status) {
      case "PASSED":
        return {
          icon: <Check size={14} />,
          text: "Passed",
          className: "bg-green-400/10 text-green-400 border-green-400/20",
        };
      case "FAILED":
        return {
          icon: <X size={14} />,
          text: "Failed",
          className: "bg-red-400/10 text-red-400 border-red-400/20",
        };
      case "SKIPPED":
        return {
          icon: <CircleOff size={14} />,
          text: "Skipped",
          className: "bg-neutral-500/10 text-neutral-500 border-neutral-500/20",
        };
      case "RUNNING":
        return {
          icon: <Radio size={14} />,
          text: "Running",
          className: "bg-blue-400/10 text-blue-400 border-blue-400/20",
        };
      default:
        return status satisfies never;
    }
  };

  const config = getStatusConfig(status);

  return (
    <div
      className={`flex items-center gap-1.5 px-2 py-1 rounded-full border ${config.className}`}
    >
      {config.icon}
      <span className="text-xs font-medium">{config.text}</span>
    </div>
  );
};
