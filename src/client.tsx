import "./styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";
import { App } from "./App";

const queryClient = new QueryClient({
  // defaultOptions: {
  //   queries: {
  //     // Speed up development
  //     retry: false,
  //   },
  // },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
]);

document.addEventListener("DOMContentLoaded", () => {
  const root = createRoot(document.getElementById("root")!);
  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
});
