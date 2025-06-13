import { cn } from "../lib/utils";
import type { Action } from "../schemas/attempts";

export const ActionListItem = ({
  action,
  select,
  isSelected,
}: {
  action: Action;
  select: () => void;
  isSelected: boolean;
}) => {
  const command = action.command;
  return (
    <button
      onClick={select}
      className={cn(
        "flex w-full justify-between p-2 border border-neutral-700 gap-2 items-center",
        isSelected && "bg-neutral-700 text-neutral-200",
        !isSelected && "bg-neutral-800 text-neutral-200",
      )}
    >
      <div className="flex items-center gap-2">
        <div className="font-bold">{command.type}</div>
        <div>{command.target?.type}</div>
        <div>{command.value}</div>
      </div>
      <div>{action.status}</div>
    </button>
  );
};
