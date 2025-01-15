"use client";

import React from "react";
import { DateRangePicker } from "@/components/DateRangePicker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { StayingTypeSelector } from "./StayingTypeSelector";

export const MobileView: React.FC = () => {
  return (
    <div className="md:hidden flex justify-center items-center my-10">
      <Dialog>
        <DialogTrigger asChild>
          <div className={cn(buttonVariants({ variant: "outline" }))}>
            Open Dialog
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="h-fit">
            <DialogTitle className="hidden">Cotiza tu estadía</DialogTitle>
            <StayingTypeSelector />
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-2 px-4 h-full">
            <DateRangePicker />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <div className={cn(buttonVariants({ variant: "outline" }))}>
                Close
              </div>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
