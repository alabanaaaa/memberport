import React from 'react';
import { clsx } from 'clsx';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant = 'default' }) => {
  const getVariant = () => {
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('active') || statusLower.includes('approved') || statusLower.includes('paid')) {
      return 'success';
    }
    if (statusLower.includes('pending') || statusLower.includes('review')) {
      return 'warning';
    }
    if (statusLower.includes('rejected') || statusLower.includes('inactive')) {
      return 'danger';
    }
    return 'info';
  };

  const actualVariant = variant === 'default' ? getVariant() : variant;

  const variantClasses = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };

  return (
    <span className={clsx(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      variantClasses[actualVariant]
    )}>
      {status}
    </span>
  );
};