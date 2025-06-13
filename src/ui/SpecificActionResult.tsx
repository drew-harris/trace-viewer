import { useEffect, useState } from "react";
import type { Action } from "../schemas/attempts";

export const SpecificActionView = ({ action }: { action: Action }) => {
  const [previewType, setPreviewType] = useState<"html" | "image">("html");
  return (
    <div className="bg-red-500 py-2">
      <div>{action.id}</div>
      <div>{action.beforeSnapshot}</div>
      {previewType === "html" ? (
        <SnapshotView action={action} />
      ) : (
        <div>Image here</div>
      )}
    </div>
  );
};

export const SnapshotView = ({ action }: { action: Action }) => {
  return (
    <div className="bg-white">
      <div>{action.beforeSnapshot}</div>
      <iframe
        src={`http://localhost:3000/api/snapshot/1/${action.id}/before.html`}
      ></iframe>
    </div>
  );
};
