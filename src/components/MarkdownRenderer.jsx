import { cn } from "@/lib/utils";
import Markdown from "react-markdown";

export function MarkdownRenderer({ className, ...props }) {
  return (
    <div
      className={cn(
        "max-w-none prose prose-neutral dark:prose-invert font-sans",
        className
      )}
    >
      <Markdown {...props} />
    </div>
  );
}
