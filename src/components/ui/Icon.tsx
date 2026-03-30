import { icons } from 'lucide-react';
import React from 'react';

export type IconName = keyof typeof icons;

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number | string;
  color?: string;
}

const Icon = ({ name, size = 24, color, className, ...props }: IconProps) => {
  const LucideIcon = icons[name];

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }

  return <LucideIcon size={size} color={color} className={className} {...props} />;
};

export default Icon;
