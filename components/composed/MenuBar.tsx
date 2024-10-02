import React from "react";

export function MenuBar() {
  return (
    <div className="flex items-center justify-between py-10">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-standar bg-primary-500"></div>
        <div className="h-10 w-10 rounded-standar bg-primary-500"></div>
      </div>
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-standar bg-primary-500"></div>
        <button className="h-10 w-10 rounded-standar bg-primary-500"></button>
      </div>
    </div>
  );
}
