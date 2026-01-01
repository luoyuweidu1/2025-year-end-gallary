import React, { useState, useRef } from 'react';
import { Memory, Language, TEXTS } from '../types';

interface GalleryProps {
  memories: Memory[];
  onRestart: () => void;
  lang: Language;
}

const Gallery: React.FC<GalleryProps> = ({ memories, onRestart, lang }) => {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const t = TEXTS[lang];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth * 0.6; // Scroll about 60% of screen width
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="h-screen bg-stone-950 text-stone-100 font-serif overflow-hidden relative flex flex-col">
      {/* Wall Texture / Lighting Effect (Simulates curved wall) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-stone-800 via-stone-900 to-stone-950 pointer-events-none z-0"></div>

      {/* Header (Floating) */}
      <div className="absolute top-0 left-0 w-full p-6 text-center z-20 bg-gradient-to-b from-stone-950/80 to-transparent">
        <h1 className="text-2xl md:text-3xl font-bold tracking-[0.2em] text-amber-500 uppercase drop-shadow-md">
            {t.galleryTitle}
        </h1>
        <p className="text-xs text-stone-400 italic mt-1">{t.gallerySubtitle}</p>
      </div>

      {/* Horizontal Scroll Container */}
      <div 
        ref={scrollRef}
        className="flex-1 flex items-center gap-12 md:gap-24 overflow-x-auto snap-x snap-mandatory px-[15vw] md:px-[30vw] py-12 z-10 no-scrollbar"
        style={{ scrollBehavior: 'smooth' }}
      >
        {memories.map((memory, index) => (
          <div 
            key={memory.id}
            onClick={() => setSelectedMemory(memory)}
            className="snap-center shrink-0 relative group cursor-pointer transition-transform duration-500 hover:scale-105"
          >
             {/* The Frame */}
             <div className="relative bg-stone-800 p-3 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-sm border border-stone-700 min-w-[280px] w-[70vw] md:w-[45vh] max-w-[500px]">
                {/* Canvas Texture Overlay */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/canvas-orange.png')] opacity-10 pointer-events-none mix-blend-multiply"></div>
                
                {/* Top Spot Light Reflection on Frame */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-stone-500 to-transparent opacity-50"></div>

                <div className="overflow-hidden border-4 border-stone-900 aspect-square relative shadow-inner">
                    <img 
                        src={memory.paintingUrl} 
                        alt={memory.question} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                        draggable={false}
                    />
                </div>
                
                {/* Label Plate */}
                <div className="mt-6 mx-auto w-4/5 bg-[#1a1815] border border-[#2c2a26] p-4 text-center shadow-lg relative flex flex-col items-center justify-center gap-1">
                    {/* Screws */}
                    <div className="absolute top-1 left-1 w-1 h-1 bg-[#3a3835] rounded-full shadow-inner"></div>
                    <div className="absolute top-1 right-1 w-1 h-1 bg-[#3a3835] rounded-full shadow-inner"></div>
                    <div className="absolute bottom-1 left-1 w-1 h-1 bg-[#3a3835] rounded-full shadow-inner"></div>
                    <div className="absolute bottom-1 right-1 w-1 h-1 bg-[#3a3835] rounded-full shadow-inner"></div>
                    
                    <h3 className="text-[10px] text-amber-600 tracking-widest uppercase mb-1">{t.exhibit} {String(index + 1).padStart(2, '0')}</h3>
                    
                    {/* AI Generated Title */}
                    <p className="text-lg md:text-xl text-stone-200 font-serif leading-none mb-2">
                         {memory.title || "Untitled Memory"}
                    </p>

                    {/* Original Memory Excerpt */}
                    <p className="text-[10px] md:text-xs text-stone-500 line-clamp-1 italic font-light w-full border-t border-stone-800 pt-2">
                        "{memory.answer}"
                    </p>
                </div>
             </div>
             
             {/* Floor Reflection */}
             <div className="absolute -bottom-20 left-4 right-4 h-20 bg-gradient-to-b from-stone-500/20 to-transparent transform scale-y-[-1] blur-md opacity-30 pointer-events-none rounded-t-lg">
                <img src={memory.paintingUrl} className="w-full h-full object-cover opacity-50" alt="" />
             </div>
          </div>
        ))}

        {/* End of Gallery Card */}
        <div className="snap-center shrink-0 min-w-[280px] w-[70vw] md:w-[45vh] max-w-[500px] flex flex-col items-center justify-center p-8 text-center space-y-6 opacity-80">
            <h2 className="text-2xl font-serif text-stone-300">{t.endTitle}</h2>
            <p className="text-stone-500 text-sm">{t.endSubtitle}</p>
            <button 
                onClick={onRestart}
                className="px-8 py-3 border border-amber-600 text-amber-500 hover:bg-amber-600 hover:text-stone-900 transition-colors uppercase tracking-widest text-xs"
            >
                {t.restart}
            </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={() => scroll('left')}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 md:p-4 text-stone-500 hover:text-amber-500 transition-colors bg-stone-900/50 backdrop-blur-sm rounded-full border border-stone-700/50 hover:border-amber-500/50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
      </button>

      <button 
        onClick={() => scroll('right')}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 md:p-4 text-stone-500 hover:text-amber-500 transition-colors bg-stone-900/50 backdrop-blur-sm rounded-full border border-stone-700/50 hover:border-amber-500/50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Modal for Detail View */}
      {selectedMemory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-fade-in-up" onClick={() => setSelectedMemory(null)}>
            <div className="bg-stone-900 max-w-5xl w-full flex flex-col md:flex-row rounded-sm overflow-hidden shadow-2xl border border-stone-800" onClick={e => e.stopPropagation()}>
                
                {/* Image Side */}
                <div className="md:w-3/5 bg-stone-950 flex items-center justify-center p-8 relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-stone-800/30 to-transparent"></div>
                    <div className="relative border-4 border-stone-800 shadow-2xl">
                        <img src={selectedMemory.paintingUrl} alt="Detail" className="max-h-[70vh] w-auto object-contain" />
                    </div>
                </div>

                {/* Text Side */}
                <div className="md:w-2/5 p-8 md:p-12 flex flex-col justify-center bg-stone-900 relative border-l border-stone-800">
                    <button 
                        onClick={() => setSelectedMemory(null)}
                        className="absolute top-4 right-4 text-stone-600 hover:text-stone-300 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="space-y-8">
                        <div>
                            <h2 className="text-amber-700 text-xs uppercase tracking-[0.2em] mb-3 font-bold">{t.artworkTitle}</h2>
                            <h1 className="text-stone-100 text-3xl font-serif">{selectedMemory.title || "Untitled"}</h1>
                        </div>

                        <div className="w-12 h-[1px] bg-stone-700"></div>
                        
                        <div>
                            <h2 className="text-amber-700 text-xs uppercase tracking-[0.2em] mb-3 font-bold">{t.questionTitle}</h2>
                            <p className="text-stone-400 text-lg font-serif leading-snug">{selectedMemory.question}</p>
                        </div>

                        <div>
                            <h2 className="text-amber-700 text-xs uppercase tracking-[0.2em] mb-3 font-bold">{t.memoryTitle}</h2>
                            <p className="text-stone-100 text-xl md:text-xl italic font-serif font-light leading-relaxed">
                                "{selectedMemory.answer}"
                            </p>
                        </div>
                    </div>

                    <div className="mt-auto pt-12 flex justify-between text-[10px] text-stone-600 uppercase tracking-widest">
                        <span>{t.oilOnCanvas}</span>
                        <span>{new Date(selectedMemory.timestamp).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
