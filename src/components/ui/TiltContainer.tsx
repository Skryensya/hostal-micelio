import { useState, cloneElement, isValidElement } from "react";

interface TiltContainerProps {
  children: React.ReactElement;
  tiltIntensity?: number;
  inverted?: boolean;
  transitionSpeed?: number;
  resetSpeed?: number;
  disableShadow?: boolean;
  shineEffect?: boolean;
}

export default function TiltContainer({
  children,
  tiltIntensity = 20,
  inverted = false,
  transitionSpeed = 0.1,
  resetSpeed = 0.3,
  disableShadow = false,
  shineEffect = true,
}: TiltContainerProps) {
  const [tiltStyle, setTiltStyle] = useState({ container: {}, shine: {} });

  if (!isValidElement(children)) {
    throw new Error('TiltContainer: children must be a valid React element');
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const width = rect.width;
    const height = rect.height;
    
    // Calculate tilt based on mouse position
    const normalizedX = ((x / width) - 0.5);
    const normalizedY = ((y / height) - 0.5);
    
    // Apply intensity and inversion
    const rotateX = normalizedY * (inverted ? -tiltIntensity : tiltIntensity);
    const rotateY = normalizedX * (inverted ? tiltIntensity : -tiltIntensity);
    
    // Calculate shadow based on tilt direction
    const shadowX = rotateY * 0.5; // Shadow moves opposite to tilt
    const shadowY = rotateX * 0.5;
    const shadowBlur = Math.abs(rotateX) + Math.abs(rotateY) + 10; // Dynamic blur
    const shadowOpacity = Math.min((Math.abs(rotateX) + Math.abs(rotateY)) * 0.01 + 0.1, 0.3);
    
    // Enhanced 3D shine effect with light source
    const shineX = (normalizedX + 0.5) * 100;
    const shineY = (normalizedY + 0.5) * 100;
    
    const shineIntensity = Math.abs(rotateX) + Math.abs(rotateY);
    const shineOpacity = Math.min(shineIntensity * 0.06, 0.4);
    
    // Light source positioned at top-left
    const lightSourceX = 20; // Light from top-left
    const lightSourceY = 20;
    
    // Calculate distance from light source to create depth
    const lightDistance = Math.sqrt(
      Math.pow(shineX - lightSourceX, 2) + Math.pow(shineY - lightSourceY, 2)
    );
    const lightIntensity = Math.max(0, 1 - lightDistance / 100);
    
    // Create multiple gradients for 3D effect
    const centerShine = `radial-gradient(circle 300px at ${shineX}% ${shineY}%, rgba(255, 255, 255, ${shineOpacity * 0.8}) 0%, rgba(255, 255, 255, ${shineOpacity * 0.3}) 40%, transparent 70%)`;
    const edgeShine = `radial-gradient(ellipse 800px 400px at ${shineX}% ${shineY}%, rgba(255, 255, 255, ${shineOpacity * 0.2}) 0%, transparent 50%)`;
    const lightReflection = `radial-gradient(circle 150px at ${lightSourceX}% ${lightSourceY}%, rgba(255, 255, 255, ${lightIntensity * 0.3}) 0%, transparent 60%)`;
    
    const containerStyle: React.CSSProperties = {
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      transition: `transform ${transitionSpeed}s ease-out, box-shadow ${transitionSpeed}s ease-out`,
    };
    
    if (!disableShadow) {
      containerStyle.boxShadow = `${shadowX}px ${shadowY + 10}px ${shadowBlur}px rgba(0, 0, 0, ${shadowOpacity})`;
    }

    const shineStyle = shineEffect ? {
      background: `${centerShine}, ${edgeShine}, ${lightReflection}`,
      transition: 'background 0.1s ease-out',
      mixBlendMode: 'overlay' as const,
    } : {};
    
    setTiltStyle({ container: containerStyle, shine: shineStyle });
  };

  const handleMouseLeave = () => {
    // Subtle 3D shine when not interacting
    const restingShine = `radial-gradient(circle 200px at 30% 30%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 40%, transparent 70%)`;
    const ambientLight = `radial-gradient(circle 400px at 20% 20%, rgba(255, 255, 255, 0.08) 0%, transparent 60%)`;
    
    const containerStyle: React.CSSProperties = {
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
      transition: `transform ${resetSpeed}s ease-out, box-shadow ${resetSpeed}s ease-out`,
    };
    
    if (!disableShadow) {
      containerStyle.boxShadow = '0px 5px 10px rgba(0, 0, 0, 0.05)';
    }

    const shineStyle = shineEffect ? {
      background: `${restingShine}, ${ambientLight}`,
      transition: `background ${resetSpeed * 2}s ease-out`,
      mixBlendMode: 'overlay' as const,
    } : {};
    
    setTiltStyle({ container: containerStyle, shine: shineStyle });
  };

  return cloneElement(children, {
    ...(children.props || {}),
    className: `${children.props?.className || ''} relative`.trim(),
    style: {
      ...(children.props?.style || {}),
      ...tiltStyle.container,
    },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    children: (
      <>
        {children.props?.children}
        {shineEffect && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={tiltStyle.shine}
          />
        )}
      </>
    ),
  });
}