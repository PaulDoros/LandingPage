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
      <div className="bg-card rounded-lg border p-6">
        <h3 className="text-card-foreground mb-4 text-lg font-medium">
          QR Code Generator
        </h3>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="url"
              className="text-foreground block text-sm font-medium"
            >
              URL or Text
            </label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL or text"
              className="border-input bg-background text-foreground focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:ring-1 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="qrColor"
                className="text-foreground block text-sm font-medium"
              >
                QR Code Color
              </label>
              <input
                type="color"
                id="qrColor"
                value={qrColor}
                onChange={(e) => setQrColor(e.target.value)}
                className="border-input mt-1 h-10 w-full rounded-md border"
              />
            </div>
            <div>
              <label
                htmlFor="bgColor"
                className="text-foreground block text-sm font-medium"
              >
                Background Color
              </label>
              <input
                type="color"
                id="bgColor"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="border-input mt-1 h-10 w-full rounded-md border"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="size"
              className="text-foreground block text-sm font-medium"
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
              className="border-input text-primary focus:ring-primary h-4 w-4 rounded"
            />
            <label
              htmlFor="includeMargin"
              className="text-foreground ml-2 block text-sm"
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
              className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 w-full rounded-md px-4 py-2 text-sm font-medium"
            >
              Download QR Code
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
