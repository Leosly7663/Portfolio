import React from 'react';

const Highlights: React.FC<{ subtitle: string }> = ({ subtitle }) => {
  return (
    <div className="highlights flex">
      <button className="highlight-button">{subtitle}</button>
      <button className="highlight-button">{subtitle}</button>
    </div>
  );
};

export default Highlights;