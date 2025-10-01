
export interface Feature {
  id: 'area' | 'bedrooms' | 'bathrooms' | 'proximity' | 'year_built' | 'square_footage_basement' | 'has_garage';
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  baseValue: number;
  weight: number;
  formatValue: (value: number) => string;
}

export interface ShapValue {
  label: string;
  featureValue: string;
  contribution: number;
}