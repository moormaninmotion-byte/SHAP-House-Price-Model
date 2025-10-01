
import React from 'react';

export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 8L20 10L22 8" />
    <path d="M10 2L12 4L14 2" />
    <path d="M4 14L2 12L4 10" />
    <path d="M12 22L10 20L12 18" />
    <path d="m10 10 1.5 1.5 1.5-1.5 1.5 1.5-1.5 1.5-1.5-1.5-1.5 1.5z" />
  </svg>
);
