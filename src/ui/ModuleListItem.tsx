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
  const verticalLine = (
    <div className="mx-3 w-[2px] min-w-[2px] bg-neutral-700/80"></div>
  );

  return (
    <div className={cn("rounded w-full justify-between gap-2 items-center")}>
      <div className="flex font-mono text-sm rounded w-full justify-between p-2 border border-neutral-700 gap-2 bg-neutral-800 items-center">
        {module.moduleName}
      </div>
      <div className="flex flex-col">
        {module.results.map((r) => (
          <div className="flex items-stretch">
            {verticalLine}
            <div className="w-full pt-2 py-1">
              <ActionListItem
                action={r}
                select={() => select(r.id)}
                isSelected={selectedId === r.id}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
