import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeGeneratorProps {
  className?: string;
}

export function QRCodeGenerator({ className }: QRCodeGeneratorProps) {
  const [url, setUrl] = useState('');
  const [qrColor, setQrColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(256);
  const [includeMargin, setIncludeMargin] = useState(true);

  const handleDownload = () => {
    const svg = document.querySelector('#qr-code svg') as SVGElement;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0);

      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'qr-code.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className={className}>
      <div className="rounded-lg border bg-card p-6">
        <h3 className="mb-4 text-lg font-medium text-card-foreground">
          QR Code Generator
        </h3>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="url"
              className="block text-sm font-medium text-foreground"
            >
              URL or Text
            </label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL or text"
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="qrColor"
                className="block text-sm font-medium text-foreground"
              >
                QR Code Color
              </label>
              <input
                type="color"
                id="qrColor"
                value={qrColor}
                onChange={(e) => setQrColor(e.target.value)}
                className="mt-1 h-10 w-full rounded-md border border-input"
              />
            </div>
            <div>
              <label
                htmlFor="bgColor"
                className="block text-sm font-medium text-foreground"
              >
                Background Color
              </label>
              <input
                type="color"
                id="bgColor"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="mt-1 h-10 w-full rounded-md border border-input"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="size"
              className="block text-sm font-medium text-foreground"
            >
              Size: {size}px
            </label>
            <input
              type="range"
              id="size"
              min="128"
              max="512"
              step="32"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="mt-1 w-full"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeMargin"
              checked={includeMargin}
              onChange={(e) => setIncludeMargin(e.target.checked)}
              className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
            />
            <label
              htmlFor="includeMargin"
              className="ml-2 block text-sm text-foreground"
            >
              Include margin
            </label>
          </div>

          <div className="flex justify-center" id="qr-code">
            {url && (
              <QRCodeSVG
                value={url}
                size={size}
                fgColor={qrColor}
                bgColor={bgColor}
                includeMargin={includeMargin}
                level="H"
              />
            )}
          </div>

          {url && (
            <button
              onClick={handleDownload}
              className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Download QR Code
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 