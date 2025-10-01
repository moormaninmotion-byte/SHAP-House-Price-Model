
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface ExplanationCardProps {
  onExplain: () => void;
  explanation: string;
  isLoading: boolean;
  error: string;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center space-x-2">
    <div className="w-3 h-3 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-3 h-3 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-3 h-3 rounded-full bg-indigo-400 animate-bounce"></div>
    <span className="text-slate-300">Generating explanation...</span>
  </div>
);

const ExplanationCard: React.FC<ExplanationCardProps> = ({ onExplain, explanation, isLoading, error }) => {
  return (
    <div className="bg-slate-900/70 border border-slate-700 rounded-lg p-6 min-h-[150px] flex flex-col justify-center">
      {!explanation && !isLoading && !error && (
        <div className="text-center">
          <p className="text-slate-400 mb-4">Click the button to get an AI-powered explanation of this prediction.</p>
        </div>
      )}
      
      {isLoading && <LoadingSpinner />}
      
      {error && <p className="text-red-400 text-center">{error}</p>}
      
      {explanation && !isLoading && (
        <div className="prose prose-invert prose-sm max-w-none text-slate-300 whitespace-pre-wrap">
          <h3 className="text-lg font-semibold text-indigo-300 flex items-center gap-2">
             <SparklesIcon className="w-5 h-5" />
             AI Explanation
          </h3>
          {explanation}
        </div>
      )}

      <div className="flex justify-center mt-4">
        <button
          onClick={onExplain}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-full transition-all duration-200 ease-in-out shadow-lg shadow-indigo-900/50 transform hover:scale-105"
        >
          <SparklesIcon className="w-5 h-5" />
          {isLoading ? 'Thinking...' : 'Explain with Gemini'}
        </button>
      </div>
    </div>
  );
};

export default ExplanationCard;
