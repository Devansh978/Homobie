import React from 'react';

const CategoryCard = ({ category, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(category.key)}
      className="bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-[#4f46e5] rounded-xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group"
    >
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
        {category.icon}
      </div>
      <h3 className="text-xl font-bold text-[#4f46e5] mb-2">{category.name}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{category.description}</p>
      <div className="mt-4 text-[#4f46e5] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        View options →
      </div>
    </div>
  );
};

export default CategoryCard;