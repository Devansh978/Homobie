import React from "react";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  avatarUrl: string;
}

export function TestimonialCard({
  quote,
  name,
  role,
  avatarUrl,
}: TestimonialCardProps) {
  return (
    <div className="p-6 rounded-xl border border-neutral-100 bg-neutral-50 relative">
      <div className="text-[#FFB800] text-3xl absolute -top-3 -left-1">"</div>
      <p className="text-neutral-700 mb-6">{quote}</p>
      <div className="flex items-center">
        <img
          src={avatarUrl}
          alt={name}
          className="w-12 h-12 rounded-full mr-4 object-cover"
        />
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-neutral-500 text-sm">{role}</p>
        </div>
      </div>
    </div>
  );
}
