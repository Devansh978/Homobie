import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface LoanFeature {
  text: string;
}

interface LoanCardProps {
  type: "home-loan" | "lap" | "bt-topup";
  title: string;
  description: string;
  features: LoanFeature[];
  imageSrc: string;
  buttonText: string;
  buttonColor: string;
  hoverColor: string;
}

export function LoanCard({
  type,
  title,
  description,
  features,
  imageSrc,
  buttonText,
  buttonColor,
  hoverColor,
}: LoanCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-neutral-100">
      <div className="h-48 bg-primary/10 p-8 flex items-center justify-center">
        <img src={imageSrc} alt={title} className="max-h-full object-cover" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-neutral-600 mb-4">{description}</p>
        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="text-green-600 mt-1 mr-2 h-5 w-5" />
              <span className="text-neutral-700">{feature.text}</span>
            </li>
          ))}
        </ul>
        <Link href={`/loan-application?type=${type}`}>
          <Button
            className="w-full text-white"
            style={{ backgroundColor: buttonColor }}
          >
            {buttonText}
          </Button>
        </Link>
      </div>
    </div>
  );
}
