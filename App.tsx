
import React, { useState, useMemo, useCallback } from 'react';
import type { Feature, ShapValue } from './types';
import Header from './components/Header';
import FeatureControl from './components/FeatureControl';
import ShapPlot from './components/ShapPlot';
import ExplanationCard from './components/ExplanationCard';
import { generateShapExplanation } from './services/geminiService';
import ZipCodeControl from './components/ZipCodeControl';

const INITIAL_FEATURES: Feature[] = [
  {
    id: 'area',
    label: 'Area',
    value: 1800,
    min: 500,
    max: 5000,
    step: 50,
    baseValue: 2000,
    weight: 120, // $/sq ft
    formatValue: (v) => `${v.toLocaleString()} sq ft`,
  },
  {
    id: 'bedrooms',
    label: 'Bedrooms',
    value: 3,
    min: 1,
    max: 8,
    step: 1,
    baseValue: 3,
    weight: 25000, // $/bedroom
    formatValue: (v) => `${v} beds`,
  },
  {
    id: 'bathrooms',
    label: 'Bathrooms',
    value: 2,
    min: 1,
    max: 6,
    step: 1,
    baseValue: 2,
    weight: 20000, // $/bathroom
    formatValue: (v) => `${v} baths`,
  },
  {
    id: 'year_built',
    label: 'Year Built',
    value: 1990,
    min: 1900,
    max: 2023,
    step: 1,
    baseValue: 1980,
    weight: 500, // $/year newer is better
    formatValue: (v) => `${Math.round(v)}`,
  },
   {
    id: 'square_footage_basement',
    label: 'Basement Area',
    value: 0,
    min: 0,
    max: 2000,
    step: 50,
    baseValue: 500,
    weight: 60, // $/sq ft
    formatValue: (v) => `${v.toLocaleString()} sq ft`,
  },
  {
    id: 'has_garage',
    label: 'Has Garage',
    value: 1,
    min: 0,
    max: 1,
    step: 1,
    baseValue: 0, // Base assumption is no garage
    weight: 15000, // flat value for having a garage
    formatValue: (v) => (v === 1 ? 'Yes' : 'No'),
  },
  {
    id: 'proximity',
    label: 'Proximity to City Center',
    value: 10,
    min: 1,
    max: 50,
    step: 1,
    baseValue: 20,
    weight: -3000, // $/km (negative impact)
    formatValue: (v) => `${v} km`,
  },
];

const App: React.FC = () => {
  const [features, setFeatures] = useState<Feature[]>(INITIAL_FEATURES);
  const [explanation, setExplanation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('90210');

  const calculateBasePrice = useCallback((zip: string): number => {
    const defaultPrice = 350000;
    if (!zip || zip.length < 3) {
      return defaultPrice;
    }
    // Simple hash to create variability based on zip code
    let hash = 0;
    for (let i = 0; i < zip.length; i++) {
      const char = zip.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    const variance = (hash % 200001) - 100000; // variance between -100k and +100k
    return defaultPrice + variance;
  }, []);

  const [basePrice, setBasePrice] = useState<number>(() => calculateBasePrice(zipCode));

  const handleFeatureChange = (id: Feature['id'], newValue: number) => {
    setFeatures(prevFeatures =>
      prevFeatures.map(f => (f.id === id ? { ...f, value: newValue } : f))
    );
  };
  
  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newZip = e.target.value.replace(/[^0-9]/g, '').slice(0, 5);
      setZipCode(newZip);
      setBasePrice(calculateBasePrice(newZip));
  };


  const { shapValues, predictedPrice } = useMemo(() => {
    const calculatedShapValues: ShapValue[] = features.map(feature => {
      const contribution = Math.round((feature.value - feature.baseValue) * feature.weight);
      return {
        label: feature.label,
        featureValue: feature.formatValue(feature.value),
        contribution,
      };
    });
    
    const totalContribution = calculatedShapValues.reduce((sum, v) => sum + v.contribution, 0);
    const finalPrice = basePrice + totalContribution;
    
    return { shapValues: calculatedShapValues, predictedPrice: finalPrice };
  }, [features, basePrice]);

  const handleExplain = useCallback(async () => {
    setIsLoading(true);
    setError('');
    setExplanation('');
    try {
      const result = await generateShapExplanation(basePrice, predictedPrice, shapValues);
      setExplanation(result);
    } catch (e: any) {
      setError(e.message || 'Failed to generate explanation.');
    } finally {
      setIsLoading(false);
    }
  }, [basePrice, predictedPrice, shapValues]);

  return (
    <div className="min-h-screen bg-slate-900 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />

        <main className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700">
            <h2 className="text-2xl font-bold text-slate-100 mb-6 border-b border-slate-600 pb-4">
              House Features
            </h2>
            <div className="space-y-6">
              {features.map(feature => (
                <FeatureControl
                  key={feature.id}
                  {...feature}
                  onChange={(e) => handleFeatureChange(feature.id, Number(e.target.value))}
                />
              ))}
              <ZipCodeControl zipCode={zipCode} onChange={handleZipCodeChange} />
            </div>
          </div>

          <div className="lg:col-span-3 bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700 flex flex-col">
             <h2 className="text-2xl font-bold text-slate-100 mb-2">
              Prediction Explanation
            </h2>
            <p className="text-slate-400 mb-4">Visualizing feature contributions to the final price.</p>
            <p className="text-sm text-slate-400 mb-6 bg-slate-800 p-3 rounded-lg border border-slate-700">
              The <strong className="text-sky-300">Base Price</strong> is the average price for a given location, serving as our starting point. The bars below show how each feature you've selected pushes the final prediction away from this average.
            </p>
            <div className="flex-grow">
              <ShapPlot basePrice={basePrice} predictedPrice={predictedPrice} shapValues={shapValues} />
            </div>
            <div className="mt-6">
              <ExplanationCard
                onExplain={handleExplain}
                explanation={explanation}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;