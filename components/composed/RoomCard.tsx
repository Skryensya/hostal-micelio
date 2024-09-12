import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Card } from "../../../OLD-hostal-micelio-pages/src/components/ui/card";

export default function RoomCard() {
  return (
    <Card>
      <div className="object-cover w-4/12">
        <Image
          src="https://dummyimage.com/250/eaeaea/000000"
          height={400}
          width={400}
          alt="Room"
          className="w-full height-full"
        ></Image>
      </div>
    </Card>
  );
}
