export function WavyDivider({
  backgroundClassNames = [
    "bg-transparent",
    "bg-white",
    "bg-surface-light dark:bg-surface-dark",
  ],
  direction = "top",
}: {
  backgroundClassNames?: string[];
  direction?: "top" | "bottom";
}) {
  if (direction === "top") {
    return (
      <div className={"relative h-2"}>
        <div
          className={
            "section-wave absolute  h-5 inset-0 translate-y-[-20.5px] " +
            backgroundClassNames[0]
          }
        ></div>
        <div
          className={
            "section-wave absolute z-10 h-5 inset-0 translate-y-[-15.5px] " +
            backgroundClassNames[1]
          }
        ></div>
        <div
          className={
            "section-wave absolute  z-20 h-5 inset-0  translate-y-[-11.5px] " +
            backgroundClassNames[2]
          }
        ></div>
      </div>
    );
  }
  return (
    <div className={"relative -translate-y-1.5 "}>
      <div
        className={
          "section-wave--bottom absolute z-20 h-5 inset-0 translate-y-1 " +
          backgroundClassNames[0]
        }
      ></div>
      <div
        className={
          "section-wave--bottom absolute z-10 h-6 inset-0 translate-y-1 " +
          backgroundClassNames[1]
        }
      ></div>
      <div
        className={
          "section-wave--bottom absolute  h-6 inset-0 translate-y-2 " +
          backgroundClassNames[2]
        }
      ></div>
    </div>
  );
}
