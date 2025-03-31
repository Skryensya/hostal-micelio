export function WavyDivider({
  backgroundClassNames = ["bg-white", "bg-surface-light dark:bg-surface-dark",],
  direction = "top",
}: {
  backgroundClassNames?: string[];
  direction?: "top" | "bottom";
}) {
  if (direction === "top") {
    return (
      <div className={"relative h-1"}>
        <div
          className={
            "wavy-divider absolute  h-5 inset-0 translate-y-[-20px] " +
            backgroundClassNames[0]
          }
        ></div>
        <div
          className={
            "wavy-divider absolute z-10 h-5 inset-0 translate-y-[-15px] " +
            backgroundClassNames[1]
          }
        ></div>
      </div>
    );
  }
  return (
    <div className={"relative -translate-y-1.5  z-20"}>
      <div
        className={
          "wavy-divider--bottom absolute z-20 h-5 inset-0 translate-y-1 " +
          backgroundClassNames[0]
        }
      ></div>
      <div
        className={
          "wavy-divider--bottom absolute z-10 h-6 inset-0 translate-y-1 " +
          backgroundClassNames[1]
        }
      ></div>
      <div
        className={
          "wavy-divider--bottom absolute  h-6 inset-0 translate-y-2 " +
          backgroundClassNames[2]
        }
      ></div>
    </div>
  );
}
