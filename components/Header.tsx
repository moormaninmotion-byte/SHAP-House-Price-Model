
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-2">
        Interactive SHAP Explainer
      </h1>
      <p className="max-w-3xl mx-auto text-lg text-slate-400">
        Understand how a machine learning model makes predictions. Adjust the features of a house and see in real-time how each one contributes to the final price prediction using SHAP values.
      </p>
    </header>
  );
};

export default Header;
