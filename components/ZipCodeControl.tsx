
import React from 'react';

interface ZipCodeControlProps {
  zipCode: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ZipCodeControl: React.FC<ZipCodeControlProps> = ({ zipCode, onChange }) => {
  return (
    <div className="space-y-2 pt-6 border-t border-slate-700">
      <label htmlFor="zip-code" className="font-medium text-slate-300">
        Location (Zip Code)
      </label>
      <p className="text-xs text-slate-500">
        The location affects the base price of the property.
      </p>
      <input
        id="zip-code"
        type="text"
        value={zipCode}
        onChange={onChange}
        placeholder="e.g., 90210"
        maxLength={5}
        pattern="[0-9]*"
        className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
};

export default ZipCodeControl;
