import { useState } from 'react';
import { Button } from './Button';
import { Input } from './input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog';

interface ImagePickerProps {
  label: string;
  name: string;
  value?: string;
  onChange: (value: string) => void;
}

const defaultImages = [
  {
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop',
    title: 'Abstract Waves'
  },
  {
    url: 'https://images.unsplash.com/photo-1579546929662-711aa81148cf?q=80&w=2070&auto=format&fit=crop',
    title: 'Gradient Sphere'
  },
  {
    url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=2067&auto=format&fit=crop',
    title: 'Colorful Background'
  },
  {
    url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop',
    title: 'Neon Lights'
  }
];

export function ImagePicker({ label, name, value, onChange }: ImagePickerProps) {
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
                  alt="Selected"
                  className="h-8 w-8 rounded object-cover"
                />
                <span className="truncate">{value}</span>
              </div>
            ) : (
              'Select Image'
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Choose an Image</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <form onSubmit={handleCustomUrlSubmit} className="flex gap-2">
              <Input
                placeholder="Enter image URL"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
              />
              <Button type="submit" disabled={!customUrl}>
                Add
              </Button>
            </form>
            <div className="grid grid-cols-2 gap-4">
              {defaultImages.map((image) => (
                <button
                  key={image.url}
                  className="group relative aspect-video overflow-hidden rounded-lg border"
                  onClick={() => {
                    onChange(image.url);
                    setIsOpen(false);
                  }}
                >
                  <img
                    src={image.url}
                    alt={image.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="text-sm font-medium text-white">
                      {image.title}
                    </span>
                  </div>
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