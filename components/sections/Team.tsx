"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TEAM from "@/db/TEAM.json";
import { Flower2 } from "lucide-react";

const TeamMember = ({ person }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col items-center mb-8">
      <div
        className="relative w-32 h-32 mb-4 group" // Group to apply hover/focus/active states
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Avatar className="w-full h-full transition-opacity duration-300 ">
          <AvatarImage
            src={isHovered ? person.picture2 : person.picture1}
            alt={person.name}
            className="object-cover duration-300 border border-border-light rounded-full" // Apply hover, focus, active states
          />
          <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
      <h3 className="text-xl font-semibold mb-1 text-center">{person.name}</h3>
      <p className="text-base text-gray-600 mb-2 text-center">
        {person.subtitle}
      </p>
      <div className="max-w-[40ch] text-center text-base">
        {person.description}
      </div>
    </div>
  );
};

const Team = () => {
  return (
    <div className="container mx-auto py-8">
      <h2 className="mb-6 text-2xl flex items-center gap-2">
        <Flower2 />
        Conoce nuestro equipo
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-10">
        {TEAM &&
          TEAM.map((person, index) => (
            <TeamMember key={index} person={person} />
          ))}
      </div>
    </div>
  );
};

export { Team };
