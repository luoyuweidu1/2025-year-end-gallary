import React from 'react';
import { Language, TEXTS } from '../types';

interface LandingProps {
  onStart: () => void;
  onViewOthers: () => void;
  onViewMy: () => void;
  hasHistory: boolean;
  lang: Language;
}

const Landing: React.FC<LandingProps> = ({ onStart, onViewOthers, onViewMy, hasHistory, lang }) => {
  const t = TEXTS[lang];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white cursor-default">
      {/* Background Image - Scenic/Landscape Photo */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=2940&auto=format&fit=crop" 
          alt="Winter Landscape" 
          className="w-full h-full object-cover opacity-80"
        />
        {/* Subtle overlay to ensure text legibility while keeping image vivid */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
      </div>

      {/* Main Content Layout */}
      <div className="relative z-10 h-full flex flex-col p-6 md:p-12 lg:p-16 animate-fade-in-up">
        
        {/* TOP SECTION: Cat Curator Intro (First thing user sees) */}
        <div className="flex flex-col items-start gap-4 mb-8 pt-4">
             {/* Cat Avatar & Speech Bubble */}
             <div className="flex items-start gap-4 transform transition-transform duration-300 hover:scale-105 origin-left">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-amber-500 overflow-hidden shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.4)] relative z-20 bg-black">
                    <img 
                        src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=200&auto=format&fit=crop" 
                        alt="The Cat Curator" 
                        className="w-full h-full object-cover"
                    />
                </div>
                
                {/* Speech Bubble */}
                <div className="bg-stone-900/80 backdrop-blur-md p-5 rounded-2xl rounded-tl-none border border-amber-500/30 max-w-md shadow-xl mt-4">
                    <h3 className="text-amber-400 font-sans-display font-bold uppercase tracking-widest text-xs mb-1">
                        {t.curatedBy}
                    </h3>
                    <p className="text-white/95 text-lg font-serif italic leading-relaxed">
                        {t.curatorQuote}
                    </p>
                </div>
             </div>
        </div>

        {/* MIDDLE SECTION: Title */}
        <div className="max-w-4xl mb-auto">
            <h1 className="font-sans-display font-extrabold text-[15vw] md:text-[8rem] leading-[0.9] tracking-tighter uppercase text-white drop-shadow-sm">
                {t.landingTitle.map((line, i) => (
                    <React.Fragment key={i}>
                        {line}<br/>
                    </React.Fragment>
                ))}
            </h1>
        </div>

        {/* BOTTOM SECTION: Actions */}
        <div className="flex flex-col gap-8 pb-4">
             {/* Create Button */}
             <button 
                onClick={onStart}
                className="group flex items-center gap-6 transition-all duration-300 hover:translate-x-4 focus:outline-none w-fit"
             >
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center text-black shadow-lg group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 md:w-10 md:h-10">
                        <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    </svg>
                </div>
                <span className="font-sans-display font-bold text-3xl md:text-5xl uppercase tracking-tight text-white group-hover:text-stone-300 transition-colors">
                    {t.createBtn}
                </span>
             </button>

             {/* Secondary Actions Row */}
             <div className="flex items-center gap-4 flex-wrap pl-2">
                 {/* View My History (Only if exists) */}
                 {hasHistory && (
                     <button
                        onClick={onViewMy}
                        className="group flex items-center gap-4 transition-all duration-300 hover:translate-x-2 focus:outline-none bg-amber-900/40 border border-amber-600/50 rounded-full pr-8 pl-2 py-2 backdrop-blur-sm"
                     >
                         <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-white shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                            </svg>
                         </div>
                         <span className="font-sans-display font-bold text-lg uppercase tracking-tight text-amber-200 group-hover:text-white transition-colors">
                             {t.viewMyBtn}
                         </span>
                     </button>
                 )}

                 {/* See Others Button */}
                 <button 
                    onClick={onViewOthers}
                    className="group flex items-center gap-3 transition-all duration-300 hover:translate-x-2 focus:outline-none ml-2 opacity-80 hover:opacity-100"
                 >
                    <div className="w-10 h-10 rounded-full border border-white flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                        </svg>
                    </div>
                    <span className="font-sans-display font-bold text-lg uppercase tracking-tight text-stone-300 group-hover:text-white transition-colors">
                        {t.viewOthersBtn}
                    </span>
                 </button>
             </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;