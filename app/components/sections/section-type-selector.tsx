import type { SectionType } from '~/types/section';
import { sectionTypes } from '~/lib/section-types';

interface SectionTypeSelectorProps {
  selectedType: SectionType;
  onChange: (type: SectionType) => void;
}

export function SectionTypeSelector({
  selectedType,
  onChange,
}: SectionTypeSelectorProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {sectionTypes.map(({ type, label, description, icon }) => (
        <label
          key={type}
          className={`relative flex cursor-pointer rounded-lg border p-6 ${
            selectedType === type
              ? 'border-primary bg-primary/5'
              : 'border-border hover:bg-accent'
          }`}
        >
          <input
            type="radio"
            name="type"
            value={type}
            checked={selectedType === type}
            onChange={(e) => onChange(e.target.value as SectionType)}
            className="sr-only"
          />
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`rounded-lg p-2 ${
                  selectedType === type
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d={icon} />
                </svg>
              </div>
              <h3 className="font-medium">{label}</h3>
            </div>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
          {selectedType === type && (
            <div className="text-primary absolute top-4 right-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          )}
        </label>
      ))}
    </div>
  );
}
