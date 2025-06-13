import { Brain, Check, Keyboard, Pointer, X } from "lucide-react";
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
        "flex cursor-pointer rounded w-full justify-between p-2 border border-neutral-700 gap-2 items-center",
        isSelected && "bg-neutral-700 text-neutral-200",
        !isSelected && "bg-neutral-800 text-neutral-200",
      )}
    >
      <div className="flex items-center gap-2">
        <div className="font-bold">
          <CommandTypeIcon type={command.type} />
        </div>
        {command.target?.type && <div>{command.target?.type}</div>}
        <div>{command.value || action.command.assertion}</div>
      </div>
      <div>
        <CommandStatus status={action.status} />
      </div>
    </button>
  );
};

type CommandType = Action["command"]["type"];

export const CommandTypeIcon = ({ type }: { type: CommandType }) => {
  switch (type) {
    case "TYPE":
      return <Keyboard size={16} />;
    case "PRESS":
      return <Keyboard size={16} />;
    case "CLICK":
      return <Pointer size={16} />;
    case "AI_ASSERTION":
      return <Brain size={16} />;
    case "JAVASCRIPT":
      return <Brain size={16} />;
    default:
      return type satisfies never;
  }
};

export const CommandStatus = ({ status }: { status: Action["status"] }) => {
  switch (status) {
    case "SUCCESS":
      return <Check className="text-green-400" />;
    case "FAILED":
      return <X className="text-red-400" />;
    default:
      return status satisfies never;
  }
};
