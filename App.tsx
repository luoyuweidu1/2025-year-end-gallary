import React, { useState, useEffect } from 'react';
import Landing from './components/Landing';
import ChatInterface from './components/ChatInterface';
import Gallery from './components/Gallery';
import { AppMode, Memory, DEMO_MEMORIES, Language } from './types';
import { saveGallery, getLatestGallery, hasSavedGalleries } from './services/db';

function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.LANDING);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [lang, setLang] = useState<Language>('en');
  const [hasHistory, setHasHistory] = useState(false);

  useEffect(() => {
    // Check for saved galleries on mount
    hasSavedGalleries().then(exists => {
        setHasHistory(exists);
    });
  }, [mode]); // Re-check when mode changes back to landing

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'zh' : 'en');
  };

  const handleStart = () => {
    setMode(AppMode.INTERVIEW);
  };

  const handleViewOthers = () => {
    setMemories(DEMO_MEMORIES[lang]);
    setMode(AppMode.GALLERY);
  }

  const handleViewMyCollection = async () => {
    const savedData = await getLatestGallery();
    if (savedData && savedData.memories) {
        setMemories(savedData.memories);
        setMode(AppMode.GALLERY);
    }
  };

  const handleComplete = async (completedMemories: Memory[]) => {
    setMemories(completedMemories);
    setMode(AppMode.GALLERY);
    // Persist to DB
    await saveGallery(completedMemories);
    setHasHistory(true);
  };

  const handleRestart = () => {
    setMemories([]);
    setMode(AppMode.LANDING);
  };

  return (
    <div className="min-h-screen relative">
      {/* Language Switcher - Top Right Fixed */}
      <div className="fixed top-6 right-6 z-50">
        <button 
          onClick={toggleLang}
          className="px-5 py-2 bg-stone-900/40 backdrop-blur-md border border-white/10 hover:border-white/40 rounded-full text-white font-sans-display text-xs font-bold tracking-widest hover:bg-stone-900/60 transition-all uppercase shadow-lg"
        >
          {lang === 'en' ? 'EN / 中文' : '中文 / EN'}
        </button>
      </div>

      {mode === AppMode.LANDING && (
          <Landing 
            onStart={handleStart} 
            onViewOthers={handleViewOthers} 
            onViewMy={handleViewMyCollection}
            hasHistory={hasHistory}
            lang={lang} 
          />
      )}
      
      {mode === AppMode.INTERVIEW && (
        <ChatInterface onComplete={handleComplete} lang={lang} />
      )}
      
      {mode === AppMode.GALLERY && (
        <Gallery memories={memories} onRestart={handleRestart} lang={lang} />
      )}
    </div>
  );
}

export default App;
