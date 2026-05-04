import React from 'react';

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  pill?: boolean;
}

export default function Skeleton({ width = '100%', height = '24px', className = '', pill = false }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-xl border-2 border-pop-maroon bg-pop-teal/20 shadow-pop ${pill ? 'rounded-full' : ''} ${className}`}
      style={{ width, height }}
    />
  );
}
