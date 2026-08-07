import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: string;
  trendPositive?: boolean;
  children?: React.ReactNode;
  className?: string;
  accentColor?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendPositive = true,
  children,
  className,
  onClick,
}) => {
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 4px 12px 0 rgb(0 0 0 / 0.10)' }}
      transition={{ duration: 0.2 }}
      className={clsx(
        'card p-5 cursor-pointer',
        className,
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-charcoal mt-1">{value}</p>
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-500 flex-shrink-0">
            {icon}
          </div>
        )}
      </div>

      {subtitle && (
        <p className="text-sm text-gray-600 mb-3">{subtitle}</p>
      )}

      {trend && (
        <div className={clsx(
          'inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
          trendPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600',
        )}>
          {trendPositive ? '↑' : '↓'} {trend}
        </div>
      )}

      {children && <div className="mt-3">{children}</div>}
    </motion.div>
  );
};
