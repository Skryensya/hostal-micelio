import React from "react";
import { colors } from "../../../../tailwind.config";
import { ModeToggle } from "@/components/ModeToggle";
import { ButtonShowcase } from "@/components/sections/ButtonShowcase";
// Add metadata to disable layout

const ColorCard = ({ color, name, value }) => (
  <div className="flex grow items-center rounded-lg border border-border bg-white/50 dark:bg-black/50 overflow-hidden">
    <div
      className="w-20 h-20  mr-4  border-r border-border"
      style={{ backgroundColor: removeAlpha(color) }}
    ></div>
    <div className="p-2">
      <div className="text-sm text-text capitalize">{name}</div>
      <div className="text-xs text-text-muted">{removeAlpha(value)}</div>
    </div>
  </div>
);

const removeAlpha = (color) => color.replace(" / <alpha-value>", "");

const ColorsPage = () => {
  // Function to check if a value is an object (nested color)
  const isObject = (item) =>
    typeof item === "object" && !Array.isArray(item) && item !== null;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-end fixed top-4 right-4 ">
        <ModeToggle />
      </div>
      <ButtonShowcase />
      <h1 className="text-2xl font-bold mb-4">Color Palette</h1>
      <div className="flex flex-col gap-4">
        {/* Combined Grid for Objects and Single Colors */}
        {Object.entries(colors).map(([colorName, colorValue]) => {
          // console.log(colorName, colorValue);
          if (isObject(colorValue)) {
            // Nested color (e.g., neutral, primary)
            return (
              <div
                key={colorName}
                className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 mb-4"
              >
                {/* Takes full width for title and nested colors */}
                <h2 className="text-lg font-semibold capitalize mb-2">
                  {colorName}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(colorValue).map(([shade, hslValue]) => (
                    <ColorCard
                      key={`${colorName}-${shade}`}
                      color={hslValue}
                      name={shade}
                      value={hslValue}
                    />
                  ))}
                </div>
              </div>
            );
          } else if (
            colorName !== "inherit" &&
            colorName !== "current" &&
            colorName !== "transparent"
          ) {
            // Single color value - occupies 1 of 6 columns
            return (
              <ColorCard
                key={colorName}
                color={colorValue}
                name={colorName}
                value={colorValue}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default ColorsPage;
