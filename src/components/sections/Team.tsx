"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Flower2 } from "lucide-react";
import TEAM from "@/db/TEAM.json";
import Image from "next/image";

const TeamHoverImage = ({ picture1, picture2, alt }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-full h-full mb-6 group rounded-lg overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src={picture1}
        alt={alt}
        fill
        className={`absolute object-cover transition-opacity duration-300 ${
          isHovered ? "opacity-0" : "opacity-100"
        }`}
        priority
      />
      <Image
        src={picture2}
        alt={alt}
        fill
        className={`absolute object-cover transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        priority
      />
    </div>
  );
};

const Member = ({ person, isOwner }) => {
  return (
    <div
      className={`flex ${isOwner ? "gap-8 items-start " : "items-start gap-4"}`}
    >
      <div className={cn(" aspect-square", isOwner ? "w-3/12" : "w-2/12")}>
        <TeamHoverImage
          picture1={person.picture1}
          picture2={person.picture2}
          alt={person.name}
        />
      </div>
      <div className={cn("w-9/12", isOwner ? "w-9/12" : "w-10/12")}>
        <h3 className={`text-${isOwner ? "2xl" : "lg"} font-semibold mb-2`}>
          {person.name}
        </h3>
        {isOwner ? (
          <div className="max-w-[50ch] text-lg">{person.description}</div>
        ) : (
          <>
            {person.subtitle && (
              <p className="text-base text-gray-600 mb-2">{person.subtitle}</p>
            )}
            <div className="max-w-[85ch] text-base">{person.description}</div>
          </>
        )}
      </div>
    </div>
  );
};

const SingleContributionMember = ({ person }) => (
  <li className="mb-3   flex flex-col  items-start border-b border-dashed border-border-light pb-4">
    <h3 className="text-lg font-semibold pb-1 ">{person.name}</h3>
    <p className="text-base ">{person.description}</p>
  </li>
);

const Team = () => {
  const { owner, permanent, temporary } = TEAM;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6  ">
      <h2 className="mb-8 text-3xl flex items-center justify-start gap-2">
        Nuestro Equipo
        <Flower2 className="h-8 w-8" />
      </h2>

      <p className="text-lg mb-8 max-w-4xl">
        Estas personas maravillosas son las verdaderas estrellas detrás del
        hostal micelio. gracias a su pasión, energía y dedicación, hemos logrado
        crear algo único. cada uno de ellos, a su manera, ha dejado una huella
        imborrable que hace que este lugar sea lo que es hoy. les damos un
        gracias enorme por su increíble trabajo y por ser parte esencial de esta
        aventura. su contribución merece ser celebrada como corresponde.
      </p>

      <div className="max-w-4xl">
        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            Gerencia y Administración
            {/* <span className="text-sm text-gray-600">()</span> */}
          </h3>
          {owner.map((person, index) => (
            <Member key={`owner-${index}`} person={person} isOwner={true} />
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            Limpieza y Mantenimiento{" "}
            {/* <span className="text-sm text-gray-600">(Y buena onda)</span> */}
          </h3>
          {permanent.map((person, index) => (
            <Member
              key={`permanent-${index}`}
              person={person}
              isOwner={false}
            />
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            Contribuciones especificas{" "}
            {/* <span className="text-sm text-gray-600">(Y buena onda)</span> */}
          </h3>
          <ul className="grid grid-cols-1 gap-1  ">
            {temporary.map((person, index) => (
              <SingleContributionMember
                key={`temporary-${index}`}
                person={person}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export { Team };
