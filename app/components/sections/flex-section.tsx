import { useState } from 'react';
import type { FlexContent, FlexComponent, ThemeStyles } from '~/types/section';

interface FlexSectionProps {
  content: FlexContent;
  themeStyles?: ThemeStyles;
  isEditing?: boolean;
}

function RangeInput({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = 'px',
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-muted-foreground text-sm">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

function ComponentEditor({
  component,
  onUpdate,
}: {
  component: FlexComponent;
  onUpdate: (updated: FlexComponent) => void;
}) {
  const updateStyle = <K extends keyof FlexComponent['styles']>(
    key: K,
    value: FlexComponent['styles'][K],
  ) => {
    onUpdate({
      ...component,
      styles: {
        ...component.styles,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{component.type}</h3>
        <button
          onClick={() => {
            /* Add remove handler */
          }}
          className="text-sm text-red-500 hover:text-red-600"
        >
          Remove
        </button>
      </div>

      {/* Content Editor */}
      {component.type === 'text' && (
        <textarea
          value={component.content.text}
          onChange={(e) =>
            onUpdate({
              ...component,
              content: { ...component.content, text: e.target.value },
            })
          }
          className="w-full rounded-md border p-2"
          rows={3}
        />
      )}

      {/* Style Controls */}
      <div className="space-y-4">
        <RangeInput
          label="Width"
          value={component.styles.width}
          onChange={(value) => updateStyle('width', value)}
          unit="%"
        />

        {component.type !== 'spacer' && (
          <>
            <RangeInput
              label="Font Size"
              value={component.styles.fontSize || 16}
              onChange={(value) => updateStyle('fontSize', value)}
              min={8}
              max={72}
            />

            <RangeInput
              label="Border Radius"
              value={component.styles.borderRadius || 0}
              onChange={(value) => updateStyle('borderRadius', value)}
              max={50}
            />

            <RangeInput
              label="Border Width"
              value={component.styles.borderWidth || 0}
              onChange={(value) => updateStyle('borderWidth', value)}
              max={10}
            />

            <RangeInput
              label="Opacity"
              value={component.styles.opacity || 100}
              onChange={(value) => updateStyle('opacity', value)}
              unit="%"
            />
          </>
        )}

        {/* Spacing Controls */}
        <div className="grid grid-cols-2 gap-4">
          <RangeInput
            label="Margin Top"
            value={component.styles.margin.top}
            onChange={(value) =>
              updateStyle('margin', { ...component.styles.margin, top: value })
            }
          />
          <RangeInput
            label="Margin Bottom"
            value={component.styles.margin.bottom}
            onChange={(value) =>
              updateStyle('margin', {
                ...component.styles.margin,
                bottom: value,
              })
            }
          />
        </div>
      </div>
    </div>
  );
}

export function FlexSection({
  content,
  themeStyles,
  isEditing = false,
}: FlexSectionProps) {
  const [components, setComponents] = useState(content.components);

  const addComponent = (type: FlexComponent['type']) => {
    const newComponent: FlexComponent = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: {},
      styles: {
        width: 100,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
      },
    };
    setComponents([...components, newComponent]);
  };

  const updateComponent = (id: string, updated: FlexComponent) => {
    setComponents(components.map((c) => (c.id === id ? updated : c)));
  };

  const renderComponent = (component: FlexComponent) => {
    const style = {
      width: `${component.styles.width}%`,
      marginTop: component.styles.margin.top,
      marginRight: component.styles.margin.right,
      marginBottom: component.styles.margin.bottom,
      marginLeft: component.styles.margin.left,
      padding: `${component.styles.padding.top}px ${component.styles.padding.right}px ${component.styles.padding.bottom}px ${component.styles.padding.left}px`,
      fontSize: component.styles.fontSize
        ? `${component.styles.fontSize}px`
        : undefined,
      fontWeight: component.styles.fontWeight,
      lineHeight: component.styles.lineHeight,
      letterSpacing: component.styles.letterSpacing
        ? `${component.styles.letterSpacing}px`
        : undefined,
      textAlign: component.styles.textAlign,
      color: component.styles.textColor || themeStyles?.text,
      backgroundColor: component.styles.backgroundColor,
      borderWidth: component.styles.borderWidth
        ? `${component.styles.borderWidth}px`
        : undefined,
      borderColor: component.styles.borderColor,
      borderStyle: component.styles.borderStyle,
      borderRadius: component.styles.borderRadius
        ? `${component.styles.borderRadius}px`
        : undefined,
      opacity: component.styles.opacity
        ? component.styles.opacity / 100
        : undefined,
      boxShadow: component.styles.shadow
        ? `${component.styles.shadow.x}px ${component.styles.shadow.y}px ${component.styles.shadow.blur}px ${component.styles.shadow.spread}px ${component.styles.shadow.color}`
        : undefined,
      transition: component.styles.transition
        ? `${component.styles.transition.property} ${component.styles.transition.duration}ms ${component.styles.transition.timing}`
        : undefined,
    } as React.CSSProperties;

    switch (component.type) {
      case 'heading':
        return <h2 style={style}>{component.content.text}</h2>;
      case 'text':
        return <p style={style}>{component.content.text}</p>;
      case 'image':
        return (
          <img
            src={component.content.images?.[0]}
            alt=""
            style={style}
            className="object-cover"
          />
        );
      case 'carousel':
        return (
          <div style={style} className="relative overflow-hidden">
            {/* Add carousel implementation */}
          </div>
        );
      case 'button':
        return (
          <a
            href={component.content.link}
            style={style}
            className="inline-block text-center"
          >
            {component.content.text}
          </a>
        );
      case 'divider':
        return <hr style={style} />;
      case 'spacer':
        return <div style={style} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div
        className={
          content.layout === 'grid'
            ? `grid gap-${content.gap || 4} grid-cols-${content.columns || 1}`
            : 'flex flex-wrap'
        }
        style={{ gap: content.gap }}
      >
        {components.map((component) => (
          <div key={component.id} className="group relative">
            {renderComponent(component)}
            {isEditing && (
              <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity group-hover:opacity-100">
                <ComponentEditor
                  component={component}
                  onUpdate={(updated) => updateComponent(component.id, updated)}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => addComponent('heading')}
            className="bg-primary rounded-md px-4 py-2 text-sm text-white"
          >
            Add Heading
          </button>
          <button
            onClick={() => addComponent('text')}
            className="bg-primary rounded-md px-4 py-2 text-sm text-white"
          >
            Add Text
          </button>
          <button
            onClick={() => addComponent('image')}
            className="bg-primary rounded-md px-4 py-2 text-sm text-white"
          >
            Add Image
          </button>
          <button
            onClick={() => addComponent('button')}
            className="bg-primary rounded-md px-4 py-2 text-sm text-white"
          >
            Add Button
          </button>
          <button
            onClick={() => addComponent('spacer')}
            className="bg-primary rounded-md px-4 py-2 text-sm text-white"
          >
            Add Spacer
          </button>
        </div>
      )}
    </div>
  );
}
