import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";

interface SectionButtonProps {
  title?: string;
  description?: string;
  isSelected?: boolean;
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const SectionButton: FC<SectionButtonProps> = ({
  title,
  description,
  isSelected,
  children,
  className,
  onClick,
}) => {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={cn(
        "w-full cursor-pointer px-2 py-2 text-lg flex flex-col justify-between border-none",
        isSelected && "font-bold",
        className
      )}
    >
      <div
        className={cn("w-full flex justify-between items-center px-4", {
          "pt-2 pb-2": isSelected,
        })}
      >
        {title && <span className="font-bold">{title}</span>}
        {description && !isSelected && (
          <span className="font-thin text-base">{description}</span>
        )}
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
};
