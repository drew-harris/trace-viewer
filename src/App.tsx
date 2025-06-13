import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { client } from "./fetch";
import { RunGroupStatusBar } from "./ui/RunGroupStatusBar";
import { useMemo, useState } from "react";
import { SpecificActionView } from "./ui/SpecificActionResult";
import { ActionListItem } from "./ui/ActionListItem";
import { isModule, isPresetAction, type Action } from "./schemas/attempts";
import { ModuleListItem } from "./ui/ModuleListItem";
import { ConsoleView } from "./ui/ConsoleView";

export const App = () => {
  const { data } = useSuspenseQuery({
    queryKey: ["runGroupMetadata"],
    queryFn: () => client.api.runGroup.$get({ json: {} }).then((r) => r.json()),
  });

  const { data: results } = useSuspenseQuery({
    queryKey: ["attempt", 1],
    queryFn: () =>
      client.api.runGroup.attempt[":id"]
        .$get({ json: {}, param: { id: "1" } })
        .then((r) => r.json())
        .then((s) => s.results),
  });

  const allActions = useMemo(
    () =>
      results.flatMap((result) =>
        isPresetAction(result)
          ? [result]
          : isModule(result)
            ? result.results
            : [],
      ),
    [results],
  ) satisfies Action[];

  const [selectedAction, setSelectedAction] = useState<string | null>(
    // @ts-ignore
    results?.at(0)?.type === "PRESET_ACTION" ? results?.at(0)?.id : null,
  );

  return (
    <div className="h-screen flex flex-col max-h-screen overflow-hidden">
      <RunGroupStatusBar runGroup={data} />
      <ResizablePanelGroup
        className="items-stretch flex-grow"
        direction="vertical"
      >
        <ResizablePanel defaultSize={70}>
          <ResizablePanelGroup className="items-stretch" direction="horizontal">
            <ResizablePanel>
              <div className="flex p-2 flex-col gap-2">
                {results.map((r) =>
                  isModule(r) ? (
                    <ModuleListItem
                      module={r}
                      select={(id) => setSelectedAction(id)}
                      selectedId={selectedAction}
                    />
                  ) : (
                    <ActionListItem
                      action={r}
                      select={() => setSelectedAction(r.id)}
                      isSelected={selectedAction === r.id}
                    />
                  ),
                )}
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={60} className="h-full">
              <div className="bg-neutral-700">
                {selectedAction ? (
                  <SpecificActionView
                    action={
                      allActions.find(
                        (r) => !isModule(r) && r.id === selectedAction,
                      )! as Action
                    }
                  />
                ) : (
                  <div>Select an action</div>
                )}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle />

        <ResizablePanel defaultSize={30} className="">
          <ConsoleView />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
