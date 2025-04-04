import * as React from "react";

interface LightEffectProps {
  lightSize?: number; 
}

const LightEffect: React.FC<LightEffectProps> = ({
  lightSize = 400,
 
}) => {
  const [lightPosition, setLightPosition] = React.useState({ x: 0, y: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();

      // Update light position relative to the container
      setLightPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className={` absolute inset-0 rounded-[inherit] z-0 pointer-events-none overflow-hidden`}
    >
      <div
        className="absolute rounded-full pointer-events-none transition-opacity duration-200 light-effect"
        style={{
   
          width: `${lightSize}px`,
          height: `${lightSize}px`,
          left: lightPosition.x - lightSize / 2,
          top: lightPosition.y - lightSize / 2,
        }}
      />
    </div>
  );
};

export { LightEffect };
