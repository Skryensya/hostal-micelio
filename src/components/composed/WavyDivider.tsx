import { cn } from "@/lib/utils";

type WavyDividerProps = {
  backgroundClass?: string;
  direction?: "top" | "bottom";
  noAlpha?: boolean;
};

export function WavyDivider({
  backgroundClass,
  direction = "top",
  noAlpha = false,
}: WavyDividerProps) {
  const isTop = direction === "top";

  return (
    <div className={cn("relative", isTop ? "h-1" : "-translate-y-1.5 z-20")}>
      <div
        className={cn(
          isTop
            ? "wavy-divider h-5 -translate-y-5"
            : "wavy-divider--bottom h-6 translate-y-2",
          `absolute inset-0 ${noAlpha ? "" : "bg-white/20"}`
        )}
      />

      <div
        className={cn(
          isTop
            ? "wavy-divider h-5 -translate-y-[15px]"
            : "wavy-divider--bottom h-6 translate-y-1 z-10",
          "absolute inset-0",
          backgroundClass
        )}
      />
    </div>
  );
}
