import type { MomenticTest } from "@/schemas/testGroup";

export const RunGroupStatusBar = ({ runGroup }: { runGroup: MomenticTest }) => {
  return (
    <div className="p-2 flex justify-between items-center bg-neutral-800 border-b border-b-neutral-600">
      <div className="flex gap-4 items-center">
        <div className="font-bold px-2">{runGroup.testName}</div>
        <div>{runGroup.status}</div>
        <div>{runGroup.attempts} Attempts</div>
      </div>
      <div className="text-sm opacity-80 pr-4">Trigger: {runGroup.trigger}</div>
    </div>
  );
};
