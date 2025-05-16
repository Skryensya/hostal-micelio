import * as React from "react";
import { useMemo } from "react";

// import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { Button } from "@/components/ui/button";
import ROOM_AMENITIES from "@/db/ROOM_AMENITIES.json";
import {
  Dialog,
  DialogContent,
  //   DialogDescription,
  DialogHeader,
  DialogTitle,
  //   DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  //   DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  //   DrawerTrigger,
} from "@/components/ui/drawer";
import { Room, RoomImage } from "@/lib/types";
import ROOMS from "@/db/ROOMS.json";
import ROOM_IMAGES from "@/db/ROOM_IMAGES.json";
import { ImagesShowcaseGrid } from "@/components/ImagesShowcaseGrid";
import { BedIcons } from "@/components/BedIcons";

import { RoomAmenities } from "./RoomAmenities";
import { RoomBeds } from "./RoomBeds";

// import { RoomConfigurationToggle } from "@/components/RoomConfigurationToggle";
export function RoomModal({
  open,
  setOpen,
  roomSlug,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  roomSlug: string;
}) {
  const room: Room | undefined = ROOMS.find(
    (room) => room.slug === roomSlug
  ) as Room | undefined;
  const roomImages: RoomImage[] | undefined =
    ROOM_IMAGES[roomSlug as keyof typeof ROOM_IMAGES];

  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader className="pb-2 px-2 -translate-y-1">
            <div className="flex items-end gap-12">
              <div>
                <span className="text-xs font-bold font-mono text-text-muted leading-[10px] mb-1 ">
                  Parque Nacional
                </span>
                <DialogTitle>{room?.name}</DialogTitle>
              </div>

              {/* <div>
                <div className="flex items-center mb-0.5 text-xs">
                  <User className="w-4 h-4" /> {room?.capacity}
                </div>
              </div> */}
            </div>
          </DialogHeader>

          <RoomDashboard room={room} roomImages={roomImages} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader className="text-left ">
          <DrawerTitle>{room?.name}</DrawerTitle>
          <div className="flex items-center gap-2">
            <BedIcons beds={room?.beds || []} />
          </div>
        </DrawerHeader>
        <RoomDashboard room={room} roomImages={roomImages} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cerrar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

const RoomDashboard = ({
  room,
  roomImages,
}: {
  room: Room | undefined;
  roomImages: RoomImage[] | undefined;
}) => {
  const amenities = useMemo(() => {
    const searchBy = room?.defaultFormat;
    if (!searchBy) return null;
    let roomAmenities = ROOM_AMENITIES.filter(
      (amenity) => searchBy.includes(amenity.id) && amenity.featured
    );

    const PrivateBathroomAmenity = ROOM_AMENITIES.find(
      (amenity) => amenity.id === "private-bathroom"
    );
    const FemaleOnlyRoomAmenity = ROOM_AMENITIES.find(
      (amenity) => amenity.id === "female-only-room"
    );
    const MaleOnlyRoomAmenity = ROOM_AMENITIES.find(
      (amenity) => amenity.id === "male-only-room"
    );

    if (room?.hasPrivateToilet) {
      roomAmenities.push(PrivateBathroomAmenity);
      // remote the shared bathroom
      roomAmenities = roomAmenities.filter(
        (amenity) => amenity.id !== "shared-bathroom"
      );
    }
    if (room?.gender === "male") roomAmenities.push(MaleOnlyRoomAmenity);
    if (room?.gender === "female") roomAmenities.push(FemaleOnlyRoomAmenity);

    if (room?.defaultFormat && room?.defaultFormat !== "HCO") {
      roomAmenities = roomAmenities.filter(
        (amenity) => amenity.id !== "female-only-room"
      );
      roomAmenities = roomAmenities.filter(
        (amenity) => amenity.id !== "male-only-room"
      );
    }

    return roomAmenities.sort((a, b) => a.order - b.order);
  }, [room?.defaultFormat, room?.hasPrivateToilet, room?.gender]);

  return (
    <div>
      <div className="bg-surface-1  px-6 md:px-2 -mx-4 py-2 -my-2 h-[266px] md:h-[316px] ">
        {roomImages && roomImages.length > 0 ? (
          <ImagesShowcaseGrid imgs={roomImages} />
        ) : null}
      </div>
      <div className="my-4 px-2">
        {/* <RoomConfigurationToggle beds={room?.beds || []} /> */}
        <p>{room?.description || "No hay descripción"}</p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          quos.
        </p>
        <div className="flex items-center justify-between gap-2 mt-4">
          <div className="w-1/2">
            <RoomBeds beds={room?.beds || []} />
          </div>
          <div className="w-1/2">
            <RoomAmenities amenities={amenities || []} />
          </div>
        </div>
      </div>
    </div>
  );
};
