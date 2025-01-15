import { DesktopView } from "./DesktopView";
import { MobileView } from "./MobileView";

export function CheckAvailability() {
  return (
    <>
      <MobileView />
      <DesktopView />
    </>
  );
}
