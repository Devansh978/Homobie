import React from 'react';

const RecommendationCard = ({ title, icon, loan, value, subtitle }) => {
  return (
    <div className="bg-black border border-white text-center p-6 rounded-xl">
      <h3 className="text-xl font-bold text-white mb-3">{icon} {title}</h3>
      <div>
        <p className="text-green-100 font-medium mb-1">{loan.name}</p>
        <p className="text-white text-2xl font-bold">{value}</p>
        <p className="text-green-100 text-sm mt-1">{subtitle}</p>
      </div>
    </div>
  );
};

export default RecommendationCard;