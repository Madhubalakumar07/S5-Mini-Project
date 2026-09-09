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
  accentColor,
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
          <p className="text-sm text-slate-500 font-medium">{title}</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">{value}</p>
        </div>
        {icon && (
          <div
            className={clsx(
              'w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform duration-200',
              accentColor || 'bg-indigo-50 text-indigo-600 border border-indigo-100/80'
            )}
          >
            {icon}
          </div>
        )}
      </div>

      {subtitle && (
        <p className="text-sm text-slate-600 mb-3 font-medium">{subtitle}</p>
      )}

      {trend && (
        <div
          className={clsx(
            'inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border',
            trendPositive
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
              : 'bg-rose-50 text-rose-700 border-rose-200/80'
          )}
        >
          {trendPositive ? '↑' : '↓'} {trend}
        </div>
      )}

      {children && <div className="mt-3">{children}</div>}
    </motion.div>
  );
};
