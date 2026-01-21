import React from 'react';

export default function ProgressCircle({ percent }) {
  if (!percent || percent <= 0) {
    return <div className="w-5 h-5"></div>;
  }

  const radius = 8;
  const circumference = 2 * Math.PI * radius;
  const dash = (circumference * percent) / 100;

  return (
    <svg width="20" height="20" viewBox="0 0 20 20" className="mx-auto">
      <circle cx="10" cy="10" r={radius} stroke="#e5e7eb" strokeWidth="2" fill="none" />
      <circle
        cx="10"
        cy="10"
        r={radius}
        stroke="#FF6803"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circumference}`}
        transform="rotate(-90 10 10)"
      />
    </svg>
  );
}
