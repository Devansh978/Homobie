import React from 'react';

const RecommendationCard = ({ title, icon, loan, value, subtitle }) => {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 text-center p-6 rounded-2xl shadow-2xl hover:bg-white/10 transition-all duration-300">
      <h3 className="text-xl font-bold text-white mb-3 flex items-center justify-center gap-2">
        {icon} {title}
      </h3>
      <div>
        <p className="text-green-100 font-medium mb-1">{loan.name}</p>
        <p className="text-white text-2xl font-bold">{value}</p>
        <p className="text-green-100 text-sm mt-1">{subtitle}</p>
      </div>
    </div>
  );
};

export default RecommendationCard;
