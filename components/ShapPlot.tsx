
import React from 'react';
import type { ShapValue } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';
import Tooltip from './Tooltip';
import { InfoIcon } from './icons/InfoIcon';


interface ShapPlotProps {
  basePrice: number;
  predictedPrice: number;
  shapValues: ShapValue[];
}

const formatCurrency = (value: number) => `$${Math.round(value).toLocaleString()}`;
const formatContribution = (value: number) => `${value > 0 ? '+' : ''}${formatCurrency(value)}`;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-700 p-3 rounded-lg border border-slate-600 shadow-lg text-sm">
        <p className="font-bold text-slate-200">{`${label}`}</p>
        <p className="text-slate-300">{`Value: ${data.featureValue}`}</p>
        <p className={`font-semibold ${data.contribution > 0 ? 'text-blue-400' : 'text-red-400'}`}>
          {`Contribution: ${formatContribution(data.contribution)}`}
        </p>
      </div>
    );
  }
  return null;
};


const ShapPlot: React.FC<ShapPlotProps> = ({ basePrice, predictedPrice, shapValues }) => {
  const plotData = [...shapValues].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

  return (
    <div className="w-full h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-4 px-4 sm:px-8">
        <div className="text-center">
            <div className="flex items-center justify-center gap-1.5">
              <p className="text-sm text-slate-400">Base Price</p>
              <Tooltip text="This is the average price of all houses in the dataset. It's the starting point for our prediction.">
                <InfoIcon className="w-4 h-4 text-slate-500" />
              </Tooltip>
            </div>
            <p className="text-2xl font-bold text-sky-300">{formatCurrency(basePrice)}</p>
        </div>
        <div className="text-center">
            <div className="flex items-center justify-center gap-1.5">
              <p className="text-sm text-slate-400">Final Prediction</p>
              <Tooltip text="The model's final estimated price after adding or subtracting the contributions from each feature to the Base Price.">
                <InfoIcon className="w-4 h-4 text-slate-500" />
              </Tooltip>
            </div>
            <p className="text-2xl font-bold text-indigo-300">{formatCurrency(predictedPrice)}</p>
        </div>
      </div>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={plotData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis type="number" stroke="#94a3b8" tickFormatter={formatCurrency} domain={['dataMin - 10000', 'dataMax + 10000']}/>
            <YAxis type="category" dataKey="label" stroke="#94a3b8" width={100} tick={{fontSize: 12}}/>
            <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(71, 85, 105, 0.5)' }} />
            <Bar dataKey="contribution" name="Contribution">
              {plotData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.contribution > 0 ? '#60a5fa' : '#f87171'} />
              ))}
              <LabelList dataKey="contribution" position="right" formatter={formatContribution} style={{ fill: '#e2e8f0', fontSize: 12 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center items-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-400 rounded"></div>
          <span className="text-slate-300">Increases Price</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-400 rounded"></div>
          <span className="text-slate-300">Decreases Price</span>
        </div>
      </div>
    </div>
  );
};

export default ShapPlot;
