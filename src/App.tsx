import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { client } from "./fetch";
import { RunGroupStatusBar } from "./ui/RunGroupStatusBar";
import { useState } from "react";
import { SpecificActionView } from "./ui/SpecificActionResult";
import { ActionListItem } from "./ui/ActionListItem";

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

  const [selectedAction, setSelectedAction] = useState<string | null>(
    results?.at(0)?.id || null,
  );

  return (
    <div className="h-screen">
      <RunGroupStatusBar runGroup={data} />
      <ResizablePanelGroup className="items-stretch" direction="horizontal">
        <ResizablePanel>
          <div className="p-2 flex flex-col gap-2">
            {results.map((r) => (
              <ActionListItem
                action={r}
                select={() => setSelectedAction(r.id)}
                isSelected={selectedAction === r.id}
              />
            ))}
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={60} className="h-full">
          <div className="bg-neutral-700">
            {selectedAction ? (
              <SpecificActionView
                action={results.find((r) => r.id === selectedAction)!}
              />
            ) : (
              <div>Select an action</div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
