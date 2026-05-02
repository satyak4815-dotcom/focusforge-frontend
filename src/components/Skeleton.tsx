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
      className={`animate-pulse bg-gray-300 border-[2px] border-[#111827] shadow-[2px_2px_0px_#111827] ${pill ? 'rounded-full' : 'rounded-xl'} ${className}`}
      style={{ width, height }}
    />
  );
}
