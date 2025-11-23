import React from 'react';
import { CoverPage as CoverPageType } from '../types';

interface Props {
  data: CoverPageType;
}

export const CoverPage: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full max-w-[800px] mx-auto bg-white p-16 min-h-[1123px] flex flex-col justify-center items-center text-center shadow-lg mb-8 print:shadow-none print:mb-0 print:h-screen page-break">
      <div className="border-8 border-[#2c3e50] p-12 w-full h-full flex flex-col justify-center items-center">
        <h1 className="text-6xl font-bold text-[#2c3e50] mb-6 leading-tight sans-serif-font">
          {data.title}
        </h1>
        <h2 className="text-2xl text-[#e74c3c] uppercase tracking-widest mb-12 sans-serif-font">
          {data.subtitle}
        </h2>
        <div className="mt-auto">
          <p className="text-[#555] italic mb-2">Written by</p>
          <p className="text-xl font-bold text-[#333] sans-serif-font">{data.author}</p>
        </div>
      </div>
    </div>
  );
};