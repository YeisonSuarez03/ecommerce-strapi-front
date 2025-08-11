"use client";
import { useMemo, useState } from "react";

interface TooltipTextProps {
  children: string;
  numberOfLines?: number;
  numberOfCharacters?: number;
  className?: string;
}

const TOOLTIP_MAX_WIDTH = 350;

export default function TooltipText({
  children,
  numberOfLines,
  numberOfCharacters,
  className = "",
}: TooltipTextProps) {
  // Mapear el número de líneas a la clase CSS correspondiente
  const lineClampClassMap: Record<number, string> = useMemo(
    () => ({
      1: "line-clamp-1",
      2: "line-clamp-2",
      3: "line-clamp-3",
      4: "line-clamp-4",
      5: "line-clamp-5",
    }),
    []
  );

  const [showTooltip, setShowTooltip] = useState(false);

  const displayInfo = useMemo(() => {
    let displayText =  children;
    let isTruncated = false;

    if (numberOfCharacters && children.length > numberOfCharacters) {
      displayText = children.slice(0, numberOfCharacters) + "...";
      isTruncated = true;
    }
    return { displayText, isTruncated };
  }, [numberOfCharacters, children]);  

  const clampClass = useMemo(() => {
    return numberOfLines && lineClampClassMap[numberOfLines]
      ? lineClampClassMap[numberOfLines]
      : "";
  }, [numberOfLines, lineClampClassMap]);

  return (
    <span
      className={`relative inline-block ${clampClass} ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      style={{ maxWidth: TOOLTIP_MAX_WIDTH, verticalAlign: "bottom" }}
    >
      {displayInfo.displayText}
      {displayInfo.isTruncated && showTooltip && (
        <span
          className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-pre-line"
          style={{ maxWidth: TOOLTIP_MAX_WIDTH + 20, wordBreak: "break-word" }}
        >
          {children}
        </span>
      )}
    </span>
  );
}
