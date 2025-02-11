import React from 'react';

interface ColorPickerProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorPicker({ label, name, value, onChange }: ColorPickerProps) {
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
          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
    </div>
  );
}