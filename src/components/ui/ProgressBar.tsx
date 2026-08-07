import React, { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';

interface ProgressBarProps {
  percentage: number;
  color?: string;
  trackColor?: string;
  height?: number;
  className?: string;
  animate?: boolean;
  showLabel?: boolean;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  color = '#006747',
  trackColor = '#E5F9F2',
  height = 8,
  className,
  animate = true,
  showLabel = false,
  label,
}) => {
  const [width, setWidth] = useState(animate ? 0 : percentage);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!animate) {
      setWidth(percentage);
      return;
    }
    setWidth(0);
    timeoutRef.current = setTimeout(() => {
      setWidth(percentage);
    }, 50);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [percentage, animate]);

  return (
    <div className={clsx('w-full', className)}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-xs text-gray-600 font-medium">{label}</span>}
          {showLabel && <span className="text-xs text-gray-500 font-medium">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ backgroundColor: trackColor, height: `${height}px` }}
      >
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};
