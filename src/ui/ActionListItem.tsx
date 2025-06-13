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
      <div className="flex items-center gap-2 w-full">
        <div className="font-bold flex-shrink-0">
          <CommandTypeIcon type={command.type} />
        </div>
        <div className="flex text-left flex-col items-start w-full">
          <div className="flex items-baseline gap-2 w-full">
            {command.type === "TYPE" && (
              <>
                <span className="text-neutral-100 text-sm">Type:</span>
                <span className="font-mono text-neutral-100">
                  {command.value}
                </span>
              </>
            )}
            {command.type === "PRESS" && (
              <>
                <span className="text-sm text-neutral-100">Press:</span>
                <span className="font-mono text-neutral-100">
                  {command.value}
                </span>
              </>
            )}
            {command.type === "CLICK" && (
              <>
                <span className="text-sm text-neutral-100">Click</span>
                <span className="text-neutral-100 "></span>
              </>
            )}
            {command.type === "AI_ASSERTION" && (
              <>
                <span className="text-sm text-neutral-100">Assert:</span>
                <span className="text-xs text-neutral-400 mb-1 block">
                  <span className="font-normal">{command.assertion}</span>
                </span>
              </>
            )}
            {command.type === "JAVASCRIPT" && (
              <>
                <span className="text-sm text-neutral-100">JS:</span>
                <span className="font-mono text-xs text-neutral-100 break-words">
                  {command.code}
                </span>
              </>
            )}
          </div>
          {command.target?.elementDescriptor &&
            command.type !== "CLICK" &&
            command.type !== "AI_ASSERTION" && (
              <span className="text-xs text-neutral-400 mb-1 block">
                <span className="font-normal">
                  Target: {command.target.elementDescriptor}
                </span>
              </span>
            )}
        </div>
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
