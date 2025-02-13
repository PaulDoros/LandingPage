import * as React from 'react';
import { cn } from '~/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-foreground block text-sm font-medium">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
