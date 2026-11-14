import { cn } from "@/src/lib/cn";

interface FormMessageProps {
  tone: "error" | "notice";
  children?: React.ReactNode;
}

/** Inline result of a form or action. Renders nothing when there's no message. */
export function FormMessage({ tone, children }: FormMessageProps) {
  if (!children) return null;
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "border-l-4 pl-3 text-sm",
        tone === "error" ? "border-plate-red text-plate-red" : "border-chalk text-chalk",
      )}
    >
      {children}
    </p>
  );
}
