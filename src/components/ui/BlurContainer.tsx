
import React from 'react';
import { cn } from '@/lib/utils';

interface BlurContainerProps {
  children: React.ReactNode;
  className?: string;
}

const BlurContainer: React.FC<BlurContainerProps> = ({ children, className }) => {
  return (
    <div className={cn('glass-morphism rounded-lg p-4', className)}>
      {children}
    </div>
  );
};

export default BlurContainer;
