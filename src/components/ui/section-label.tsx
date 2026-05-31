import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function SectionLabel({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("section-label", className)} {...rest} />;
}
