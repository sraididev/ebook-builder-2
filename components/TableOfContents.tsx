import React from 'react';
import { TableOfContents as TOCType } from '../types';

interface Props {
  data: TOCType;
}

export const TableOfContents: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full max-w-[800px] mx-auto bg-white p-16 min-h-[1123px] shadow-lg mb-8 print:shadow-none print:mb-0 print:h-screen page-break">
      <h2 className="text-3xl font-bold text-[#2c3e50] border-b-4 border-[#2c3e50] pb-4 mb-10 sans-serif-font">
        Table of Contents
      </h2>
      <ul className="space-y-4">
        {data.chapters.map((title, index) => (
          <li key={index} className="flex items-baseline border-b border-gray-200 pb-2">
            <span className="text-[#e74c3c] font-bold mr-4 sans-serif-font w-8">
              {index + 1}.
            </span>
            <span className="text-lg text-[#333] font-serif flex-1">
              {title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};