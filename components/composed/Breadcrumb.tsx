import {
  Breadcrumb as BreadcrumbUI,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

export function Breadcrumb({
  levels,
}: {
  levels: { label: string; href: string }[];
}) {
  return (
    <div className="container mx-auto py-4">
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
