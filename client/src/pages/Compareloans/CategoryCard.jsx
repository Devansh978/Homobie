import React from 'react';

const CategoryCard = ({ category, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(category.key)}
      className=" hover:bg-gray-700  border-gray-600 cursor-pointer transform hover:scale-105 hover:shadow-2xl group shadow-2xl text-left backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
    >
      <h3 className="text-2xl font-bold text-[#5a53dd] mb-2">{category.name}</h3>
      <p className="text-gray-400 text-md leading-relaxed">{category.description}</p>
      <div className="mt-4 text-[#4f46e5] text-md font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        View options →
      </div>
    </div>
  );
};

export default CategoryCard;