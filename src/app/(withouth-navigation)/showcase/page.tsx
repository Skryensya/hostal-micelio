import React from "react";
import { colors } from "../../../../tailwind.config";
// import { ModeToggle } from "@/components/ModeToggle";
import { ButtonShowcase } from "@/components/sections/ButtonShowcase";
// Add metadata to disable layout

const ColorCard = ({ color, name, value }) => (
  <div className="border-border flex grow items-center overflow-hidden rounded-lg border bg-white/50">
    <div
      className="border-border mr-4 h-20 w-20 border-r"
      style={{ backgroundColor: removeAlpha(color) }}
    ></div>
    <div className="p-2">
      <div className="text-text text-sm capitalize">{name}</div>
      <div className="text-text-muted text-xs">{removeAlpha(value)}</div>
    </div>
  </div>
);

const removeAlpha = (color) => color.replace(" / <alpha-value>", "");

const ColorsPage = () => {
  // Function to check if a value is an object (nested color)
  const isObject = (item) =>
    typeof item === "object" && !Array.isArray(item) && item !== null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* <div className="flex justify-end fixed top-4 right-4 ">
        <ModeToggle />
      </div> */}
      <ButtonShowcase />
      <h1 className="mb-4 text-2xl font-bold">Color Palette</h1>
      <div className="flex flex-col gap-4">
        {/* Combined Grid for Objects and Single Colors */}
        {Object.entries(colors).map(([colorName, colorValue]) => {
          // console.log(colorName, colorValue);
          if (isObject(colorValue)) {
            // Nested color (e.g., neutral, primary)
            return (
              <div
                key={colorName}
                className="col-span-1 mb-4 sm:col-span-2 md:col-span-3 lg:col-span-4"
              >
                {/* Takes full width for title and nested colors */}
                <h2 className="mb-2 text-lg font-semibold capitalize">
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
