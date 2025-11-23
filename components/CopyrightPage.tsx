import React from 'react';
import { CopyrightPage as CopyrightPageType } from '../types';

interface Props {
  data: CopyrightPageType;
}

export const CopyrightPage: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full max-w-[800px] mx-auto bg-white p-16 min-h-[1123px] flex flex-col justify-end shadow-lg mb-8 print:shadow-none print:mb-0 print:h-screen page-break">
      <div className="text-sm text-[#555]">
        <p className="font-bold mb-4">{data.copyright_notice}</p>
        <p className="mb-4 leading-relaxed">{data.disclaimer}</p>
        <p className="text-[#2980b9]">{data.website_or_contact}</p>
      </div>
    </div>
  );
};