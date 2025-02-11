import { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog';

interface IconPickerProps {
  label: string;
  name: string;
  value?: string;
  onChange: (value: string) => void;
}

const defaultIcons = [
  {
    url: 'https://api.iconify.design/heroicons:paint-brush.svg',
    title: 'Paint Brush'
  },
  {
    url: 'https://api.iconify.design/heroicons:device-phone-mobile.svg',
    title: 'Mobile Device'
  },
  {
    url: 'https://api.iconify.design/heroicons:rocket-launch.svg',
    title: 'Rocket Launch'
  },
  {
    url: 'https://api.iconify.design/heroicons:chart-bar.svg',
    title: 'Chart Bar'
  },
  {
    url: 'https://api.iconify.design/heroicons:cog.svg',
    title: 'Settings'
  },
  {
    url: 'https://api.iconify.design/heroicons:user.svg',
    title: 'User'
  },
  {
    url: 'https://api.iconify.design/heroicons:envelope.svg',
    title: 'Envelope'
  },
  {
    url: 'https://api.iconify.design/heroicons:globe-alt.svg',
    title: 'Globe'
  }
];

export function IconPicker({ label, name, value, onChange }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl) {
      onChange(customUrl);
      setIsOpen(false);
      setCustomUrl('');
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            {value ? (
              <div className="flex items-center gap-2">
                <img
                  src={value}
                  alt="Selected Icon"
                  className="h-5 w-5"
                />
                <span className="truncate">{value}</span>
              </div>
            ) : (
              'Select Icon'
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Choose an Icon</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <form onSubmit={handleCustomUrlSubmit} className="flex gap-2">
              <Input
                placeholder="Enter icon URL"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
              />
              <Button type="submit" disabled={!customUrl}>
                Add
              </Button>
            </form>
            <div className="grid grid-cols-4 gap-4">
              {defaultIcons.map((icon) => (
                <button
                  key={icon.url}
                  className="flex aspect-square items-center justify-center rounded-lg border p-2 hover:bg-accent"
                  onClick={() => {
                    onChange(icon.url);
                    setIsOpen(false);
                  }}
                >
                  <img
                    src={icon.url}
                    alt={icon.title}
                    className="h-6 w-6"
                  />
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <input type="hidden" name={name} value={value || ''} />
    </div>
  );
} 