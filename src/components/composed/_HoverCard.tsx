import React from "react";
import Link from "next/link";
import Image from "next/image";

interface HoverCardProps {
  title: string;
  description: string;
  imgUrl: string;
  blurUrl?: string;
  link: string;
  alt?: string; // Optional alt property
  color?: string;
}

// HoverCard component
export const HoverCard: React.FC<HoverCardProps> = ({
  title,
  description,
  imgUrl,
  blurUrl,
  link,
  alt,
  color,
}) => {
  return (
    <Link
      href={link}
      className="md:aspect-[2/1.6] aspect-[2/1.2] w-full relative overflow-hidden group cursor-pointer rounded-xl"
    >
      <div
        className="relative h-full shadow-3xl "
        style={{ backgroundColor: color ? color : "transparent" }}
      >
        <Image
          src={blurUrl}
          alt={alt || title} // Use alt if provided, otherwise use title
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover blur-sm"
        />
        <Image
          src={imgUrl}
          alt={alt || title} // Use alt if provided, otherwise use title
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="transition-transform duration-500 delay-100 ease-out group-hover:scale-105 object-cover"
        />
        <div className="px-6 md:px-8 absolute inset-0 z-10 pb-8 text-text-dark flex flex-col justify-end bottom-gradient--soft">
          <h3 className="text-2xl font-bold">{title}</h3>
          <p className="text-lg font-medium mt-2 opacity-100 max-h-20 overflow-hidden transition-all duration-500 ease-out md:opacity-0 md:max-h-0 md:group-hover:opacity-100 md:group-hover:max-h-20">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};
