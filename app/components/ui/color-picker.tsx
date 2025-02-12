import React from 'react';

import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '~/lib/utils';

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align="center"
      sideOffset={4}
      className={cn(
        'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 rounded-md border p-4 shadow-md outline-none',
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

interface ColorPickerProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorPicker({
  label,
  name,
  value,
  onChange,
}: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="color"
          name={name}
          id={`${name}-picker`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-20"
        />
        <input
          type="text"
          name={name}
          id={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter hex color (#RRGGBB)"
          className="border-input bg-background flex-1 rounded-md border px-3 py-2 text-sm"
        />
      </div>
    </div>
  );
}
