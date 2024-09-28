import React from "react";
import Link from "next/link";
import Image from "next/image";

// Define the Attraction type with an optional alt property
interface Attraction {
  title: string;
  description: string;
  imgUrl: string;
  link: string;
  alt?: string; // Optional alt property
}

// Props type for the AttractionCard component
interface AttractionCardProps {
  attraction: Attraction;
}

// AttractionCard component
export const AttractionCard: React.FC<AttractionCardProps> = ({
  attraction,
}) => {
  return (
    <Link
      href={attraction.link}
      className="aspect-square w-full relative overflow-hidden group rounded cursor-pointer"
    >
      <div className="relative h-full">
        <Image
          src={attraction.imgUrl}
          alt={attraction.alt || attraction.title} // Use alt if provided, otherwise use title
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-500 delay-100 ease-out group-hover:scale-110 group-focus:scale-110"
        />
        {/* Content Overlay */}
        <div className="absolute inset-0 z-10 p-4 text-white flex flex-col justify-end group-hover:from-10% bg-gradient-to-t from-0% to-40% from-black/60 to-transparent group-hover:to-50% group-focus:from-10% group-focus:to-50% group-hover:from-black/50 group-focus:from-black/40">
          {/* Title - pushed up on hover */}
          <h3 className="text-2xl font-bold">{attraction.title}</h3>

          {/* Description - trims to 3 lines and animates on hover */}
          <p className="text-sm mt-2 opacity-0 max-h-0 overflow-hidden transition-all duration-500 delay-100 ease-out group-hover:opacity-100 group-hover:max-h-20 group-focus:opacity-100 group-focus:max-h-20">
            {attraction.description}
          </p>
        </div>
      </div>
    </Link>
  );
};
