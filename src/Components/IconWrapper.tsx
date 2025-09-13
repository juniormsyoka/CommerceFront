// components/IconWrapper.tsx
import React from 'react';
import { IconType } from 'react-icons';

interface IconWrapperProps {
  icon: IconType;
  size?: number;
  className?: string;
  color?: string;
}

const IconWrapper: React.FC<IconWrapperProps> = ({ 
  icon: Icon, 
  size = 18, 
  className = '',
  color 
}) => {
  // Use type assertion to handle the ReactNode issue
  const IconComponent = Icon as React.ComponentType<{ 
    size?: number; 
    className?: string; 
    color?: string;
  }>;
  
  return <IconComponent size={size} className={className} color={color} />;
};

export default IconWrapper;