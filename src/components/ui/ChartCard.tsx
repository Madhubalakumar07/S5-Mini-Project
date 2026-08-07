import React from 'react';
import { clsx } from 'clsx';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  children,
  className,
  action,
}) => {
  return (
    <div className={clsx('card p-6', className)}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="font-semibold text-charcoal text-base">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
      {children}
    </div>
  );
};
