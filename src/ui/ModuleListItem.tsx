import { cn } from "../lib/utils";
import type { Action, Module } from "../schemas/attempts";
import { ActionListItem } from "./ActionListItem";

export const ModuleListItem = ({
  module,
  select,
  selectedId,
}: {
  module: Module;
  select: (id: string) => void;
  selectedId: string | null;
}) => {
  return (
    <div
      className={cn(
        "flex cursor-pointer rounded w-full justify-between p-2 border border-neutral-700 gap-2 items-center",
      )}
    >
      <div className="flex items-center gap-2">
        <div>{module.id}</div>
      </div>
      <div>
        {module.results.map((r) => (
          <ActionListItem
            action={r}
            select={() => select(r.id)}
            isSelected={selectedId === r.id}
          />
        ))}
      </div>
    </div>
  );
};
