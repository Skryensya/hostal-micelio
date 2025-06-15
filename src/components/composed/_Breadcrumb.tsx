import {
  Breadcrumb as BreadcrumbUI,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

export type BreadcrumbLevel = {
  label: string;
  href: string;
};

export function Breadcrumb({ levels }: { levels: BreadcrumbLevel[] }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      <BreadcrumbUI>
        <BreadcrumbList className="text-lg">
          {levels.map((level, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem key={index}>
                {index === levels.length - 1 ? (
                  <BreadcrumbPage>{level.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={level.href}>
                    {level.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < levels.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </BreadcrumbUI>
    </div>
  );
}
