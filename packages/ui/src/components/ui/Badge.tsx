/**
 * Badge Component
 * 
 * A reusable badge component for displaying status indicators,
 * HTTP methods, status codes, and other small pieces of information.
 * Supports different variants and sizes with TypeScript support.
 */

import React from 'react';

/**
 * Badge variant types
 */
export type BadgeVariant = 
  | 'default' 
  | 'success' 
  | 'warning' 
  | 'danger' 
  | 'info' 
  | 'secondary';

/**
 * Badge size types
 */
export type BadgeSize = 'sm' | 'md' | 'lg';

/**
 * Badge props interface
 */
export interface BadgeProps {
  /** Badge content */
  children: React.ReactNode;
  
  /** Badge variant */
  variant?: BadgeVariant;
  
  /** Badge size */
  size?: BadgeSize;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Click handler */
  onClick?: () => void;
}

/**
 * Badge component
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  onClick,
}) => {
  // Base classes
  const baseClasses = [
    'inline-flex',
    'items-center',
    'font-medium',
    'rounded-full',
    'transition-colors',
    'duration-200',
  ];

  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  // Variant classes
  const variantClasses = {
    default: [
      'bg-gray-100',
      'text-gray-800',
      'hover:bg-gray-200',
    ],
    success: [
      'bg-green-100',
      'text-green-800',
      'hover:bg-green-200',
    ],
    warning: [
      'bg-yellow-100',
      'text-yellow-800',
      'hover:bg-yellow-200',
    ],
    danger: [
      'bg-red-100',
      'text-red-800',
      'hover:bg-red-200',
    ],
    info: [
      'bg-blue-100',
      'text-blue-800',
      'hover:bg-blue-200',
    ],
    secondary: [
      'bg-gray-200',
      'text-gray-700',
      'hover:bg-gray-300',
    ],
  };

  // Interactive classes
  const interactiveClasses = onClick ? 'cursor-pointer' : '';

  // Combine all classes
  const classes = [
    ...baseClasses,
    sizeClasses[size],
    ...variantClasses[variant],
    interactiveClasses,
    className,
  ].join(' ');

  return (
    <span
      className={classes}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </span>
  );
};

/**
 * HTTP Method Badge
 * 
 * Specialized badge for displaying HTTP methods with appropriate colors
 */
export const HttpMethodBadge: React.FC<{
  method: string;
  size?: BadgeSize;
  className?: string;
}> = ({ method, size = 'md', className = '' }) => {
  const methodColors: Record<string, BadgeVariant> = {
    GET: 'success',
    POST: 'info',
    PUT: 'warning',
    PATCH: 'warning',
    DELETE: 'danger',
    HEAD: 'secondary',
    OPTIONS: 'secondary',
  };

  const variant = methodColors[method.toUpperCase()] || 'default';

  return (
    <Badge variant={variant} size={size} className={className}>
      {method.toUpperCase()}
    </Badge>
  );
};

/**
 * Status Code Badge
 * 
 * Specialized badge for displaying HTTP status codes with appropriate colors
 */
export const StatusCodeBadge: React.FC<{
  statusCode: number;
  size?: BadgeSize;
  className?: string;
}> = ({ statusCode, size = 'md', className = '' }) => {
  let variant: BadgeVariant = 'default';

  if (statusCode >= 200 && statusCode < 300) {
    variant = 'success';
  } else if (statusCode >= 300 && statusCode < 400) {
    variant = 'info';
  } else if (statusCode >= 400 && statusCode < 500) {
    variant = 'warning';
  } else if (statusCode >= 500) {
    variant = 'danger';
  }

  return (
    <Badge variant={variant} size={size} className={className}>
      {statusCode}
    </Badge>
  );
};

/**
 * Entry Type Badge
 * 
 * Specialized badge for displaying telescope entry types
 */
export const EntryTypeBadge: React.FC<{
  type: 'request' | 'exception';
  size?: BadgeSize;
  className?: string;
}> = ({ type, size = 'md', className = '' }) => {
  const variant: BadgeVariant = type === 'request' ? 'success' : 'danger';

  return (
    <Badge variant={variant} size={size} className={className}>
      {type === 'request' ? 'Request' : 'Exception'}
    </Badge>
  );
}; 