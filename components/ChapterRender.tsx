import React from 'react';
import { Chapter } from '../types';
import { CheckSquare, Square } from 'lucide-react';

interface Props {
  chapter: Chapter;
  chapterNumber: number;
}

export const ChapterRender: React.FC<Props> = ({ chapter, chapterNumber }) => {
  return (
    <div className="w-full max-w-[800px] mx-auto bg-white p-16 shadow-lg mb-8 print:shadow-none print:mb-0 page-break">
      
      {/* Chapter Header */}
      <div className="border-b-4 border-[#2c3e50] pb-5 mb-8">
        <span className="block font-sans text-sm uppercase tracking-[2px] text-[#e74c3c] font-bold mb-1">
          Chapter {chapterNumber}
        </span>
        <h1 className="text-[32px] text-[#2c3e50] m-0 leading-[1.2]">
          {chapter.chapter_title}
        </h1>
      </div>

      {/* Overview Box */}
      {chapter.overview && (
        <div className="bg-[#f9f9f9] border-l-[5px] border-[#e74c3c] p-5 italic mb-8 text-[#555]">
          <strong className="text-[#333]">Overview:</strong> {chapter.overview}
        </div>
      )}

      {/* Key Concepts */}
      {chapter.key_concepts.length > 0 && (
        <div className="mb-10">
          <div className="flex flex-wrap gap-2">
            {chapter.key_concepts.map((concept, idx) => (
              <span 
                key={idx} 
                className="inline-block bg-[#2c3e50] text-white px-3 py-1 rounded-full text-xs font-sans"
              >
                {concept}
              </span>
            ))}
          </div>
        </div>
      )}

      <hr className="border-0 border-t border-[#eee] my-8" />

      {/* Practical Sections */}
      {chapter.practical_sections.map((section, idx) => (
        <div key={idx} className="mb-10 avoid-break">
          <div className="font-sans text-[22px] text-[#2c3e50] mb-4 font-bold">
            {idx + 1}. {section.section_title}
          </div>
          
          {section.explanation && (
            <p className="mb-4 text-[#333] leading-[1.6]">
              {section.explanation}
            </p>
          )}

          {section.example && (
            <div className="bg-[#eef2f5] p-4 rounded text-[0.95em] my-4 border-l-4 border-[#2980b9]">
              <span className="font-bold text-[#2980b9] uppercase text-[0.8em] block mb-1 font-sans">
                Real Life Example
              </span>
              {section.example}
            </div>
          )}

          {section.action_steps.length > 0 && (
            <div className="mt-4">
              <span className="font-bold block mb-2 text-[#333]">Action Steps:</span>
              <ul className="list-disc pl-5 space-y-2 text-[#444]">
                {section.action_steps.map((step, sIdx) => (
                  <li key={sIdx}>{step}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}

      {/* Case Study */}
      {chapter.case_study && (
        <div className="border-2 border-[#2c3e50] p-6 my-10 bg-white relative avoid-break">
          <div className="bg-[#2c3e50] text-white px-4 py-1 absolute -top-4 left-5 font-sans text-sm font-bold uppercase">
            Case Study
          </div>
          {/* We assume case_study might contain simple HTML or line breaks, 
              but based on prompt data it's a string. We'll render it cleanly. */}
          <div className="mt-2 whitespace-pre-wrap leading-relaxed text-[#333]">
             {/* If the string has HTML-like structure in the data, we might parse it, 
                 but for safety we assume text. 
                 Since the prompt example had bolding, let's process bold markers if strictly needed,
                 otherwise render text. */}
             {chapter.case_study}
          </div>
        </div>
      )}

      {/* Checklist */}
      {chapter.checklist.length > 0 && (
        <div className="bg-[#fff8f8] border border-dashed border-[#e74c3c] p-6 mb-10 avoid-break">
          <h3 className="mt-0 text-[#c0392b] font-bold text-lg mb-4 font-sans uppercase">
            Chapter {chapterNumber} Checklist
          </h3>
          <div className="space-y-3">
            {chapter.checklist.map((item, idx) => (
              <div key={idx} className="flex items-start font-sans text-[#333]">
                <Square className="w-5 h-5 text-[#e74c3c] mr-3 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      {chapter.summary && (
        <div className="bg-[#2c3e50] text-white p-8 text-center rounded avoid-break">
          <span className="uppercase tracking-widest font-bold mb-3 block text-[#e74c3c] text-sm">
            Chapter Summary
          </span>
          <p className="italic leading-relaxed">
            {chapter.summary}
          </p>
        </div>
      )}
    </div>
  );
};