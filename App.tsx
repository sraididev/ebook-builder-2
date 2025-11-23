import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedEbook } from './types';
import { CoverPage } from './components/CoverPage';
import { CopyrightPage } from './components/CopyrightPage';
import { TableOfContents } from './components/TableOfContents';
import { ChapterRender } from './components/ChapterRender';
import { Printer, FileText, Sparkles, Loader2, ArrowLeft } from 'lucide-react';

// --- SCHEMA DEFINITION FOR GEMINI ---
const EBOOK_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    ebook: {
      type: Type.OBJECT,
      properties: {
        cover_page: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            author: { type: Type.STRING }
          },
          required: ['title', 'subtitle', 'author']
        },
        copyright_page: {
          type: Type.OBJECT,
          properties: {
            copyright_notice: { type: Type.STRING },
            disclaimer: { type: Type.STRING },
            website_or_contact: { type: Type.STRING }
          },
          required: ['copyright_notice', 'disclaimer', 'website_or_contact']
        },
        table_of_contents: {
          type: Type.OBJECT,
          properties: {
            chapters: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['chapters']
        }
      },
      required: ['cover_page', 'copyright_page', 'table_of_contents']
    },
    chapters: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          chapter_title: { type: Type.STRING },
          overview: { type: Type.STRING },
          key_concepts: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          practical_sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                section_title: { type: Type.STRING },
                explanation: { type: Type.STRING },
                example: { type: Type.STRING },
                action_steps: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING } 
                }
              },
              required: ['section_title', 'explanation', 'example', 'action_steps']
            }
          },
          case_study: { type: Type.STRING },
          checklist: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          summary: { type: Type.STRING }
        },
        required: ['chapter_title', 'overview', 'key_concepts', 'practical_sections', 'case_study', 'checklist', 'summary']
      }
    }
  },
  required: ['ebook', 'chapters']
};

const App: React.FC = () => {
  const [topic, setTopic] = useState("");
  const [status, setStatus] = useState<"idle" | "generating" | "complete" | "error">("idle");
  const [generatedData, setGeneratedData] = useState<GeneratedEbook | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const generateEbook = async () => {
    if (!topic.trim()) return;

    setStatus("generating");
    setErrorMessage(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `Write a comprehensive, professional, and practical ebook about: "${topic}".
      
      The ebook should have:
      1. A catchy title and subtitle.
      2. A realistic copyright page.
      3. A table of contents with 3 to 5 engaging chapters.
      4. 3 to 5 detailed chapters. Each chapter must include:
         - An overview.
         - Key concepts (tags).
         - 2-3 Practical Subchapters (sections) with explanations, real-life examples, and actionable steps.
         - A short case study.
         - A checklist for the reader.
         - A summary.

      Ensure the content is high-quality, educational, and formatted strictly according to the JSON schema provided.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: EBOOK_SCHEMA,
          // Higher temperature for creativity
          temperature: 0.7,
        }
      });

      const text = response.text;
      if (!text) throw new Error("No content generated");

      const data = JSON.parse(text) as GeneratedEbook;
      setGeneratedData(data);
      setStatus("complete");
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to generate ebook. Please try again or check your API key.");
      setStatus("error");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setTopic("");
    setGeneratedData(null);
  };

  // --- VIEW: INPUT / HERO ---
  if (status === "idle" || status === "generating" || status === "error") {
    return (
      <div className="min-h-screen bg-[#f4f4f4] flex flex-col items-center justify-center p-4">
        <div className="max-w-xl w-full bg-white p-10 rounded-lg shadow-xl border-t-8 border-[#2c3e50]">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-[#fef2f2] rounded-full flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-[#e74c3c]" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-[#2c3e50] text-center mb-2 font-sans">
            AI Ebook Generator
          </h1>
          <p className="text-gray-500 text-center mb-8">
            Enter a niche or topic, and we'll write a professionally styled ebook for you in seconds.
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="topic" className="block text-sm font-bold text-[#2c3e50] mb-2 uppercase tracking-wide">
                What is your ebook about?
              </label>
              <input
                type="text"
                id="topic"
                placeholder="e.g. Urban Gardening, Python for Beginners, Stoicism..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={status === "generating"}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:outline-none focus:border-[#e74c3c] text-lg transition-colors"
                onKeyDown={(e) => e.key === 'Enter' && generateEbook()}
              />
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-600 rounded text-sm text-center">
                {errorMessage}
              </div>
            )}

            <button
              onClick={generateEbook}
              disabled={status === "generating" || !topic.trim()}
              className="w-full bg-[#2c3e50] hover:bg-[#34495e] disabled:bg-gray-400 text-white font-bold py-4 rounded-md text-lg transition-all flex items-center justify-center gap-3"
            >
              {status === "generating" ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Generating Content...
                </>
              ) : (
                <>
                  <FileText className="w-6 h-6" />
                  Build Ebook
                </>
              )}
            </button>
          </div>
        </div>
        <p className="mt-8 text-gray-400 text-sm">Powered by Gemini API</p>
      </div>
    );
  }

  // --- VIEW: PREVIEW & PRINT ---
  return (
    <div className="min-h-screen bg-[#e0e0e0] py-10 print:p-0 print:bg-white">
      
      {/* Control Bar (Hidden in Print) */}
      <div className="fixed top-0 left-0 w-full bg-[#2c3e50] text-white p-4 shadow-md z-50 flex justify-between items-center no-print">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Create New
          </button>
          <div className="h-6 w-px bg-gray-600"></div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#e74c3c]" />
            <span className="font-bold text-lg hidden sm:inline truncate max-w-[200px]">
              {generatedData?.ebook.cover_page.title}
            </span>
          </div>
        </div>
        
        <button 
          onClick={handlePrint}
          className="bg-[#e74c3c] hover:bg-[#c0392b] text-white px-6 py-2 rounded font-bold flex items-center gap-2 transition-colors shadow-sm"
        >
          <Printer className="w-4 h-4" />
          <span className="hidden sm:inline">Save as PDF</span>
        </button>
      </div>

      {/* Main Content Area */}
      {generatedData && (
        <div className="mt-12 print:mt-0">
          
          {/* Cover Page */}
          <CoverPage data={generatedData.ebook.cover_page} />

          {/* Copyright Page */}
          <CopyrightPage data={generatedData.ebook.copyright_page} />

          {/* Table of Contents */}
          <TableOfContents data={generatedData.ebook.table_of_contents} />

          {/* Chapters */}
          {generatedData.chapters.map((chapter, index) => (
            <ChapterRender 
              key={index} 
              chapter={chapter} 
              chapterNumber={index + 1} 
            />
          ))}

        </div>
      )}

      <div className="text-center text-gray-500 mt-10 no-print pb-10">
        <p>End of Preview</p>
      </div>
    </div>
  );
};

export default App;