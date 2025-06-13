import { useSuspenseQuery } from "@tanstack/react-query";
import { client } from "./fetch";
import { RunGroupStatusBar } from "./ui/RunGroupStatusBar";

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

  return (
    <div className="h-screen">
      <RunGroupStatusBar runGroup={data} />
      {results.map((r) => (
        <div key={r.id}>{r.message}</div>
      ))}
    </div>
  );
};
