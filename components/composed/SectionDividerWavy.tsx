export function SectionDividerWavy({
  backgroundClassNames = ["bg-white", "bg-white", "bg-surface-light"],
}: {
  backgroundClassNames?: string[];
}) {
  return (
    <div className={"-mt-4 " + backgroundClassNames[0]}>
      <div className={"section-wave h-5 " + backgroundClassNames[0]}></div>
      <div
        className={"section-wave w-full h-5 -mt-4 " + backgroundClassNames[1]}
      ></div>
      <div
        className={"section-wave w-full h-4 -mt-4 " + backgroundClassNames[2]}
      ></div>
    </div>
  );
}
