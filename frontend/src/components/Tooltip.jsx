import React, { useState } from "react";

export default function ToolTip({
  containerClassName,
  className,
  tooltip,
  children,
}) {
  const [hoveredButton, setHoveredButton] = useState(null);
  return (
    <div
      className={`m-0 p-0 ${containerClassName}`}
      onMouseEnter={() => setHoveredButton(true)}
      onMouseLeave={() => setHoveredButton(false)}
    >
      {children}
      {hoveredButton && (
        <div className={`absolute ${className}`}>{tooltip}</div>
      )}
    </div>
  );
}
