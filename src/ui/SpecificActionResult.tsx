import { useEffect, useState } from "react";
import type { Action } from "../schemas/attempts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const SpecificActionView = ({ action }: { action: Action }) => {
  const [previewType, setPreviewType] = useState<"html" | "image">("html");
  return (
    <div className="py-2">
      <div className="px-8 py-8">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
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
