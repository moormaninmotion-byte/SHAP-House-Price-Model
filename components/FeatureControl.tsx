
import React from 'react';

interface FeatureControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  formatValue: (value: number) => string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FeatureControl: React.FC<FeatureControlProps> = ({
  label,
  value,
  min,
  max,
  step,
  formatValue,
  onChange,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <label className="font-medium text-slate-300">{label}</label>
        <span className="text-indigo-300 font-semibold text-lg bg-indigo-900/50 px-3 py-1 rounded-md">
          {formatValue(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #818cf8 ${percentage}%, #334155 ${percentage}%)`,
        }}
      />
    </div>
  );
};

export default FeatureControl;
