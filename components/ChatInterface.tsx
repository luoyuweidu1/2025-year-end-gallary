import React, { useState, useRef } from 'react';
import { QUESTIONS, Memory, Language, TEXTS } from '../types';
import { getCuratorResponse, generateMemoryPainting } from '../services/geminiService';

interface ChatInterfaceProps {
  onComplete: (memories: Memory[]) => void;
  lang: Language;
}

type Step = 'input' | 'generating' | 'result';

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onComplete, lang }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [step, setStep] = useState<Step>('input');
  
  const [answer, setAnswer] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const [currentPainting, setCurrentPainting] = useState<string | null>(null);
  const [curatorResponse, setCuratorResponse] = useState<{comment: string, title: string}>({ comment: '', title: '' });
  
  const [memories, setMemories] = useState<Memory[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = TEXTS[lang];
  const questionList = QUESTIONS[lang];
  const currentQuestion = questionList[currentIndex];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!answer.trim() && !selectedImage) return;

    setStep('generating');

    try {
      // Parallel execution for speed
      const curatorPromise = getCuratorResponse(answer, lang);
      const paintingPrompt = `Theme: ${currentQuestion}. Memory: ${answer}`;
      const paintingPromise = generateMemoryPainting(paintingPrompt, selectedImage || undefined);

      const [response, paintingUrl] = await Promise.all([curatorPromise, paintingPromise]);

      setCurrentPainting(paintingUrl);
      setCuratorResponse(response);
      
      if (paintingUrl) {
        const newMemory: Memory = {
          id: Date.now().toString(),
          question: currentQuestion,
          answer: answer,
          paintingUrl: paintingUrl,
          title: response.title,
          timestamp: Date.now()
        };
        setMemories(prev => [...prev, newMemory]);
      }

      setStep('result');
    } catch (error) {
      console.error(error);
      setStep('input'); // Reset on error
      alert("The canvas slipped! Please try again.");
    }
  };

  const handleNext = () => {
    // Reset state for next question
    setAnswer('');
    setSelectedImage(null);
    setCurrentPainting(null);
    setCuratorResponse({ comment: '', title: '' });

    if (currentIndex < questionList.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setStep('input');
    } else {
      onComplete(memories);
    }
  };

  // Render Functions
  const renderInputStep = () => (
    <div className="max-w-3xl w-full mx-auto animate-fade-in-up">
      {/* Question Section - Minimalist & Bold */}
      <div className="mb-10 md:mb-14">
          <div className="flex items-center gap-4 mb-6 opacity-60">
             <span className="text-amber-500 font-sans-display font-black text-sm tracking-[0.2em] uppercase">
                {t.questionPrefix} {String(currentIndex + 1).padStart(2, '0')}
             </span>
             <div className="h-[1px] bg-stone-700 flex-1"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-sans-display font-medium text-white leading-[1.1] tracking-tight drop-shadow-lg">
              {currentQuestion}
          </h2>
      </div>

      {/* Artistic Input Area - Frosted Glass & Floating Effect */}
      <div className="relative group perspective-1000">
          <div className="relative transform transition-all duration-700 ease-out hover:-translate-y-2 hover:scale-[1.01]">
              
              {/* Glass Container */}
              <div className="bg-stone-900/30 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] transition-all duration-500 group-hover:border-white/20 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative">
                  
                  {/* Inner Top Sheen/Highlight */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50"></div>
                  
                  <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder={t.placeholder}
                      className="w-full bg-transparent border-none text-2xl md:text-3xl font-serif text-stone-100 placeholder-stone-600 focus:ring-0 focus:outline-none resize-none min-h-[240px] leading-relaxed tracking-wide italic selection:bg-amber-500/30 selection:text-white p-8 md:p-10"
                  />

                  {/* Image Preview - Integrated into the glass box */}
                   {selectedImage && (
                      <div className="px-8 pb-8 flex justify-end">
                        <div className="relative group/img inline-block cursor-pointer">
                             {/* Stack effect */}
                             <div className="absolute inset-0 bg-stone-800 rotate-6 transform rounded-sm translate-x-2 translate-y-2 opacity-60"></div>
                             <div className="relative bg-stone-800/80 backdrop-blur-md border border-stone-600 p-2 shadow-xl rotate-[-2deg] transition-transform duration-300 group-hover/img:rotate-0 group-hover/img:scale-105 rounded-sm">
                                <img src={selectedImage} alt="Ref" className="h-28 w-auto object-cover opacity-90 group-hover/img:opacity-100 transition-opacity rounded-[2px]" />
                                <button 
                                    onClick={() => setSelectedImage(null)}
                                    className="absolute -top-3 -right-3 bg-stone-900 text-stone-400 border border-stone-600 rounded-full p-1.5 hover:bg-red-900/80 hover:text-white transition-colors shadow-lg"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                      </div>
                  )}
              </div>
              
              {/* Bottom reflection/glow for floating effect - Creates the "Levitation" look */}
              <div className="absolute -bottom-8 left-1/4 right-1/4 h-6 bg-amber-500/20 blur-2xl rounded-[100%] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
          </div>
      </div>

      {/* Controls */}
      <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6 pt-4 px-2">
          {/* Obvious Upload Button - Outlined Button Style */}
          <button
              onClick={() => fileInputRef.current?.click()}
              className="group relative flex items-center gap-4 px-8 py-4 rounded-full border border-stone-600/50 bg-stone-900/40 hover:bg-stone-800 hover:border-amber-500/50 transition-all duration-300 w-full md:w-auto justify-center"
          >
              <div className="text-amber-600 group-hover:text-amber-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
              </div>
              <span className="font-sans-display text-sm tracking-[0.15em] uppercase text-stone-400 group-hover:text-white font-bold transition-colors">
                  {t.addPhoto}
              </span>
          </button>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />

          {/* Primary Action Button */}
          <button
              onClick={handleSubmit}
              disabled={!answer.trim() && !selectedImage}
              className={`px-10 py-4 font-sans-display font-black uppercase tracking-[0.15em] text-sm transition-all flex items-center justify-center gap-3 rounded-full w-full md:w-auto ${
                  !answer.trim() && !selectedImage 
                  ? 'text-stone-700 cursor-not-allowed bg-stone-900/50' 
                  : 'bg-white text-black hover:bg-stone-200 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105'
              }`}
          >
              <span>{t.generate}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
          </button>
      </div>
    </div>
  );

  const renderGeneratingStep = () => (
    <div className="text-center animate-pulse space-y-6">
        <div className="relative w-32 h-32 mx-auto">
             <div className="absolute inset-0 border-4 border-stone-800 rounded-full"></div>
             <div className="absolute inset-0 border-4 border-white rounded-full border-t-transparent animate-spin"></div>
        </div>
        <div>
            <h3 className="text-2xl font-serif text-stone-200 mb-2">{t.generatingTitle}</h3>
            <p className="text-stone-500 italic">{t.generatingSubtitle}</p>
        </div>
    </div>
  );

  const renderResultStep = () => (
    <div className="max-w-4xl w-full mx-auto animate-fade-in-up flex flex-col md:flex-row gap-8 items-center md:items-start">
        {/* The Painting */}
        <div className="w-full md:w-1/2 flex-shrink-0">
            <div className="bg-stone-900 p-4 pb-12 shadow-2xl relative border border-stone-800">
                <div className="border border-stone-950 overflow-hidden">
                    {currentPainting ? (
                        <img src={currentPainting} alt="Generated Memory" className="w-full h-auto object-cover aspect-square" />
                    ) : (
                        <div className="w-full aspect-square bg-stone-800 flex items-center justify-center text-stone-600">{t.imgNotAvailable}</div>
                    )}
                </div>
                {/* Display Title on Result Card too */}
                <div className="absolute bottom-3 left-0 right-0 text-center px-4">
                     <p className="text-white font-sans-display font-bold text-lg uppercase tracking-wider">{curatorResponse.title}</p>
                     <p className="text-stone-500 text-xs italic mt-1">2025 Collection</p>
                </div>
            </div>
        </div>

        {/* The Commentary & Next */}
        <div className="w-full md:w-1/2 space-y-8 text-center md:text-left">
            <div className="bg-stone-900/80 backdrop-blur p-8 rounded-none border border-stone-800 shadow-sm">
                <div className="mb-4">
                    <span className="font-bold text-stone-500 text-xs uppercase tracking-widest font-sans-display">{t.curatorNote}</span>
                </div>
                <p className="text-xl text-stone-200 italic leading-relaxed font-serif">
                    "{curatorResponse.comment}"
                </p>
            </div>

            <button
                onClick={handleNext}
                className="w-full md:w-auto px-10 py-4 bg-white text-black font-sans-display font-extrabold uppercase tracking-widest hover:bg-stone-200 transition-colors shadow-lg flex items-center justify-center gap-2 mx-auto md:mx-0"
            >
                <span>{currentIndex < questionList.length - 1 ? t.next : t.finish}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
            </button>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black flex flex-col font-serif relative overflow-hidden text-stone-200">
        {/* Simple Progress Bar - Clean White */}
        <div className="h-1 bg-stone-900 w-full fixed top-0 left-0 z-50">
            <div 
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${((currentIndex) / questionList.length) * 100}%` }}
            ></div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-10">
            {step === 'input' && renderInputStep()}
            {step === 'generating' && renderGeneratingStep()}
            {step === 'result' && renderResultStep()}
        </div>
        
        {/* Background ambience - Darker texture overlay */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
    </div>
  );
};

export default ChatInterface;
