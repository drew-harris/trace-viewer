import { useState, useEffect } from "react";
import type { Action } from "../schemas/attempts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const SpecificActionView = ({ action }: { action: Action }) => {
  const [previewType, setPreviewType] = useState<"html" | "image" | "rawHtml">(
    "image",
  );
  const [previewPeriod, setPreviewPeriod] = useState<"before" | "after">(
    "after",
  );
  return (
    <div className="py-2">
      <div className="flex justify-between px-4 gap-2">
        <Select
          onValueChange={(value) =>
            setPreviewPeriod(value as "before" | "after")
          }
          value={previewPeriod}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="before">Before</SelectItem>
            <SelectItem value="after">After</SelectItem>
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => setPreviewType(value as "html" | "image")}
          value={previewType}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="html">HTML</SelectItem>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="rawHtml">Raw HTML</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>{action.id}</div>
      <div>{action.beforeSnapshot}</div>
      {previewType === "html" ? (
        <SnapshotView action={action} period={previewPeriod} />
      ) : previewType === "rawHtml" ? (
        <RawHtmlView action={action} period={previewPeriod} />
      ) : (
        <ImageView action={action} period={previewPeriod} />
      )}
    </div>
  );
};

export const SnapshotView = ({
  action,
  period,
}: {
  action: Action;
  period: "before" | "after";
}) => {
  return (
    <div className="bg-white">
      <div>
        {period === "before" ? action.beforeSnapshot : action.afterSnapshot}
      </div>
      <iframe
        src={`http://localhost:3000/api/snapshot/1/${action.id}/${period}.html`}
      />
    </div>
  );
};

export const ImageView = ({
  action,
  period,
}: {
  action: Action;
  period: "before" | "after";
}) => {
  return (
    <div className="bg-white p-4">
      <img
        src={`http://localhost:3000/api/image/1/${action.id}/${period}.jpeg`}
        alt={`${period} snapshot`}
        className="max-w-full h-auto"
      />
    </div>
  );
};

export const RawHtmlView = ({
  action,
  period,
}: {
  action: Action;
  period: "before" | "after";
}) => {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHtml = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/snapshot/1/${action.id}/${period}.html`,
        );
        const text = await response.text();
        setHtmlContent(text);
      } catch (error) {
        console.error("Error fetching HTML:", error);
        setHtmlContent("Error loading HTML content");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHtml();
  }, [action.id, period]);

  return (
    <div className="p-4">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <pre className="font-mono bg-neutral-700 text-sm whitespace-pre-wrap break-words">
          {htmlContent}
        </pre>
      )}
    </div>
  );
};
