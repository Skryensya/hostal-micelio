import React from "react";
import Link from "next/link";
import Image from "next/image";

interface HoverCardProps {
  title: string;
  description: string;
  imgUrl: string;
  link: string;
  alt?: string; // Optional alt property
}

// HoverCard component
export const HoverCard: React.FC<HoverCardProps> = ({
  title,
  description,
  imgUrl,
  link,
  alt,
}) => {
  return (
    <Link
      href={link}
      className="aspect-square w-full relative overflow-hidden group rounded cursor-pointer"
    >
      <div className="relative h-full">
        <Image
          src={imgUrl}
          alt={alt || title} // Use alt if provided, otherwise use title
          layout="fill"
          className="transition-transform duration-500 delay-100 ease-out group-hover:scale-110 group-focus:scale-110 object-cover"
        />
        <div className="absolute inset-0 z-10 p-4 text-white flex flex-col justify-end group-hover:from-10% bg-gradient-to-t from-0% to-40% from-black/60 to-transparent group-hover:to-50% group-focus:from-10% group-focus:to-50% group-hover:from-black/50 group-focus:from-black/40">
          <h3 className="text-2xl font-bold">{title}</h3>
          <p className="text-sm mt-2 opacity-0 max-h-0 overflow-hidden transition-all duration-500 delay-100 ease-out group-hover:opacity-100 group-hover:max-h-20 group-focus:opacity-100 group-focus:max-h-20">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};
