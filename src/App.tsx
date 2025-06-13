import { useSuspenseQuery } from "@tanstack/react-query";
import { client } from "./fetch";
import { RunGroupStatusBar } from "./ui/RunGroupStatusBar";

export const App = () => {
  const { data } = useSuspenseQuery({
    queryKey: ["runGroupMetadata"],
    queryFn: () => client.api.runGroup.$get({ json: {} }).then((r) => r.json()),
  });
  return (
    <div className="h-screen">
      <RunGroupStatusBar runGroup={data} />
      <div>This is the app</div>
    </div>
  );
};
