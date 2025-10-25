'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TopNav from '@/components/TopNav';
import questions2008 from '@/data/questions-2008.json';
import questions2025 from '@/data/questions-2025.json';

export default function StudyMode() {
  // State management
  const [studyStarted, setStudyStarted] = useState(true); // Start immediately
  const [isFlipping, setIsFlipping] = useState(false);
  const [testVersion, setTestVersion] = useState('2025');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAnswer, setShowAnswer] = useState(false);
  const [knownQuestions, setKnownQuestions] = useState([]);
  const [stillLearningQuestions, setStillLearningQuestions] = useState([]);
  const [showOnlyUnknown, setShowOnlyUnknown] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [history, setHistory] = useState([]); // For undo functionality
  const [showFilters, setShowFilters] = useState(false); // Toggle for filters
  const [shuffledQuestions, setShuffledQuestions] = useState([]); // Shuffled question list
  const [showSettings, setShowSettings] = useState(false); // Settings modal
  const [showHint, setShowHint] = useState(false); // Show hint for current card
  const [trackProgressEnabled, setTrackProgressEnabled] = useState(true); // Track progress toggle
  const [textToSpeechEnabled, setTextToSpeechEnabled] = useState(false); // TTS toggle

  // Get the appropriate question set
  const allQuestions = testVersion === '2008' ? questions2008 : questions2025;

  // Get unique categories
  const categories = ['all', ...new Set(allQuestions.map(q => q.category))];

  // Filter and shuffle questions
  const getFilteredQuestions = () => {
    let filtered = selectedCategory === 'all'
      ? allQuestions
      : allQuestions.filter(q => q.category === selectedCategory);

    if (showOnlyUnknown) {
      filtered = filtered.filter(q => !knownQuestions.includes(q.id));
    }

    return filtered;
  };

  // Use shuffled questions if available, otherwise use filtered
  const filteredQuestions = shuffledQuestions.length > 0 ? shuffledQuestions : getFilteredQuestions();
  const currentQuestion = filteredQuestions[currentIndex] || allQuestions[0];

  // Load saved data from localStorage
  useEffect(() => {
    const savedKnown = localStorage.getItem('knownQuestions');
    const savedLearning = localStorage.getItem('stillLearningQuestions');
    const savedVersion = localStorage.getItem('testVersion');

    if (savedKnown) {
      try {
        setKnownQuestions(JSON.parse(savedKnown));
      } catch (e) {
        console.error('Error loading known questions:', e);
      }
    }

    if (savedLearning) {
      try {
        setStillLearningQuestions(JSON.parse(savedLearning));
      } catch (e) {
        console.error('Error loading still learning questions:', e);
      }
    }

    if (savedVersion) {
      setTestVersion(savedVersion);
    }
  }, []);

  // Shuffle questions whenever filters change or on initial load
  useEffect(() => {
    const filtered = getFilteredQuestions();
    // Shuffle using Fisher-Yates algorithm
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setCurrentIndex(0); // Reset to first card when questions change
  }, [testVersion, selectedCategory, showOnlyUnknown]); // Removed knownQuestions.length to prevent re-shuffle on Know/Still Learning

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('knownQuestions', JSON.stringify(knownQuestions));
    localStorage.setItem('stillLearningQuestions', JSON.stringify(stillLearningQuestions));
  }, [knownQuestions, stillLearningQuestions]);

  // Handle "Know" action
  const handleKnow = () => {
    const questionId = currentQuestion.id;

    // Add to known, remove from still learning
    if (!knownQuestions.includes(questionId)) {
      setKnownQuestions([...knownQuestions, questionId]);
    }
    setStillLearningQuestions(stillLearningQuestions.filter(id => id !== questionId));

    // Visual feedback
    setSwipeDirection('right');
    setShowAnswer(false); // Reset flip state immediately
    setTimeout(() => {
      // If "show only unstudied" is enabled, remove this card from deck
      if (showOnlyUnknown) {
        const updatedQuestions = shuffledQuestions.filter(q => q.id !== questionId);
        setShuffledQuestions(updatedQuestions);
        // Keep same index (next card will appear in same position)
        if (currentIndex >= updatedQuestions.length) {
          setCurrentIndex(0); // Loop back if we're at the end
        }
      } else {
        moveToNextCard();
      }
      setSwipeDirection(null);
    }, 300);
  };

  // Handle "Still Learning" action
  const handleStillLearning = () => {
    const questionId = currentQuestion.id;

    // Save state for undo
    setHistory([...history, { index: currentIndex, action: 'learning', questionId, prevKnown: knownQuestions.includes(questionId), prevLearning: stillLearningQuestions.includes(questionId) }]);

    // Add to still learning, remove from known
    if (!stillLearningQuestions.includes(questionId)) {
      setStillLearningQuestions([...stillLearningQuestions, questionId]);
    }
    setKnownQuestions(knownQuestions.filter(id => id !== questionId));

    // Visual feedback
    setSwipeDirection('left');
    setShowAnswer(false); // Reset flip state immediately
    setTimeout(() => {
      moveToNextCard();
      setSwipeDirection(null);
    }, 300);
  };

  // Handle going to previous card
  const handlePreviousCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
      setShowHint(false);
    } else {
      // If at first card, go to last card
      setCurrentIndex(filteredQuestions.length - 1);
      setShowAnswer(false);
      setShowHint(false);
    }
  };

  const moveToNextCard = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
    setShowHint(false); // Reset hint for next card
  };

  // Calculate counts
  const totalQuestions = allQuestions.length;
  const knownCount = knownQuestions.length;
  const stillLearningCount = stillLearningQuestions.length;
  const unstudiedCount = totalQuestions - knownCount - stillLearningCount;

  // Handle swipe gestures for mobile
  useEffect(() => {
    if (!studyStarted) return;

    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    };

    const handleSwipe = () => {
      const swipeThreshold = 100;
      const horizontalDistance = Math.abs(touchEndX - touchStartX);
      const verticalDistance = Math.abs(touchEndY - touchStartY);

      // Only trigger if horizontal swipe is dominant
      if (horizontalDistance > verticalDistance && horizontalDistance > swipeThreshold) {
        if (touchEndX < touchStartX) {
          // Swipe left = Still Learning
          handleStillLearning();
        } else {
          // Swipe right = Know
          handleKnow();
        }
      }
    };

    const element = document.getElementById('flashcard');
    if (element) {
      element.addEventListener('touchstart', handleTouchStart);
      element.addEventListener('touchend', handleTouchEnd);

      return () => {
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [studyStarted, currentIndex, filteredQuestions.length, knownQuestions, stillLearningQuestions]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!studyStarted) return;

    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') handlePreviousCard();
      if (e.key === 'ArrowRight') {
        if (trackProgressEnabled) handleKnow();
        else moveToNextCard();
      }
      if (e.key === ' ') {
        e.preventDefault();
        setShowAnswer(!showAnswer);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [studyStarted, showAnswer, currentIndex, filteredQuestions.length, trackProgressEnabled]);

  const handleVersionChange = (version) => {
    setTestVersion(version);
    localStorage.setItem('testVersion', version);
    setCurrentIndex(0);
    setShowAnswer(false);
  };

  const resetProgress = () => {
    if (confirm('Reset all progress? This will clear your "Know" and "Still Learning" lists.')) {
      setKnownQuestions([]);
      setStillLearningQuestions([]);
      localStorage.removeItem('knownQuestions');
      localStorage.removeItem('stillLearningQuestions');
      setHistory([]);
    }
  };

  // Shuffle cards
  const handleShuffle = () => {
    const filtered = getFilteredQuestions();
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setCurrentIndex(0);
    setShowAnswer(false);
    setShowHint(false);
  };

  // Generate hint (partial answer)
  const getHint = () => {
    const answer = currentQuestion.answers[0];
    const words = answer.split(' ');
    if (words.length === 1) {
      // Show first letter and length
      return `${answer[0]}${'_'.repeat(answer.length - 1)} (${answer.length} letters)`;
    } else {
      // Show first word and blanks for rest
      return `${words[0]} ${'_____ '.repeat(words.length - 1)}`;
    }
  };

  // Handle card flip with animation (allows flipping back to question)
  const handleFlipCard = () => {
    if (isFlipping) return; // Prevent multiple flips during animation

    setIsFlipping(true);
    setShowAnswer(!showAnswer); // Toggle between question and answer

    // Hide hint when flipping to answer
    if (!showAnswer) {
      setShowHint(false);
    }

    // Re-enable clicking after animation completes
    setTimeout(() => {
      setIsFlipping(false);
    }, 600); // Match the CSS transition duration
  };

  // Text-to-speech functionality
  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const text = showAnswer
        ? `Answer: ${currentQuestion.answers.join(' or ')}`
        : `Question: ${currentQuestion.question}`;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      window.speechSynthesis.speak(utterance);
    }
  };

  // Get card status
  const getCardStatus = () => {
    if (knownQuestions.includes(currentQuestion.id)) return 'know';
    if (stillLearningQuestions.includes(currentQuestion.id)) return 'learning';
    return 'unstudied';
  };

  const cardStatus = getCardStatus();

  // Skip setup screen - go directly to flashcards
  if (!studyStarted) {
    // This should never show since studyStarted is true by default
    return (
      <main className="h-screen bg-white dark:bg-slate-900 flex flex-col overflow-hidden">
        <div className="flex-1 flex items-center justify-center p-3 overflow-y-auto">
          <div className="w-full max-w-3xl space-y-3">

            {/* Progress Stats - Inline */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-orange-50 dark:bg-orange-900/30 border-l-4 border-orange-500 dark:border-orange-600 rounded-r-lg p-2 text-center">
                <div className="text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-400">{stillLearningCount}</div>
                <div className="text-xs sm:text-sm text-orange-700 dark:text-orange-300 font-medium">Review</div>
              </div>
              <div className="bg-gray-100 dark:bg-slate-800/50 border-l-4 border-gray-400 dark:border-slate-600 rounded-r-lg p-2 text-center">
                <div className="text-xl sm:text-2xl font-bold text-gray-600 dark:text-slate-300">{unstudiedCount}</div>
                <div className="text-xs sm:text-sm text-gray-700 dark:text-slate-400 font-medium">Unstudied</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 dark:border-green-600 rounded-r-lg p-2 text-center">
                <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">{knownCount}</div>
                <div className="text-xs sm:text-sm text-green-700 dark:text-green-300 font-medium">Know</div>
              </div>
            </div>

            {/* Test Version & Category - Combined Row */}
            <div className="grid sm:grid-cols-2 gap-3">
              {/* Test Version - Compact */}
              <div>
                <label className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5 block">Test Version</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleVersionChange('2008')}
                    className={`p-3 rounded-lg font-bold text-sm transition-all border ${
                      testVersion === '2008'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                        : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    2008<span className="text-xs sm:text-sm block opacity-75">(100Q)</span>
                  </button>
                  <button
                    onClick={() => handleVersionChange('2025')}
                    className={`p-3 rounded-lg font-bold text-sm transition-all border ${
                      testVersion === '2025'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                        : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    2025<span className="text-xs sm:text-sm block opacity-75">(128Q)</span>
                  </button>
                </div>
              </div>

              {/* Category - Dropdown */}
              <div>
                <label className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5 block">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 text-sm rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white font-semibold focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter Checkbox - Inline */}
            <label className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={showOnlyUnknown}
                onChange={(e) => setShowOnlyUnknown(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                Show only unstudied cards
              </span>
            </label>

            {/* Start Button - Prominent */}
            <button
              onClick={handleStartStudy}
              disabled={filteredQuestions.length === 0}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
            >
              {filteredQuestions.length === 0
                ? 'No cards available'
                : `Start Studying (${filteredQuestions.length} cards)`
              }
            </button>

            {/* Reset Progress - Small Link */}
            <div className="text-center pt-1">
              <button
                onClick={resetProgress}
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium text-xs sm:text-sm"
              >
                Reset Progress
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // IMMERSIVE STUDY SCREEN (Quizlet-inspired)
  return (
    <>
      <TopNav />

      <main className="min-h-screen bg-white dark:bg-slate-900 flex flex-col">
        {/* Minimal Top Bar - Progress (only when tracking is OFF) */}
        {!trackProgressEnabled && (
          <div className="flex-shrink-0 px-4 py-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="text-sm font-semibold text-gray-500 dark:text-slate-400">
                {currentIndex + 1} / {filteredQuestions.length}
              </div>
            </div>
          </div>
        )}


        {/* Flashcard Container - Centered with max width */}
        <div className="flex-1 flex items-center justify-center px-4 pb-4">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-center max-w-md border border-gray-200 dark:border-slate-700">
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              All Done!
            </h2>
            <p className="text-gray-600 dark:text-slate-300 mb-4 text-sm sm:text-base">
              You&apos;ve studied all cards in this category.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-2.5 bg-purple-600 text-white rounded-xl font-bold text-sm sm:text-base hover:bg-purple-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="w-full max-w-3xl">
            {/* Flashcard with 3D Flip */}
            <div
              id="flashcard"
              className={`relative w-full rounded-3xl shadow-2xl ${!isFlipping ? 'cursor-pointer' : 'pointer-events-none'} ${
                swipeDirection === 'left' ? 'transform -translate-x-full opacity-0 transition-all duration-300' :
                swipeDirection === 'right' ? 'transform translate-x-full opacity-0 transition-all duration-300' : ''
              }`}
              onClick={handleFlipCard}
              style={{
                perspective: '1000px',
                height: 'clamp(350px, 55vh, 550px)',
                maxWidth: '100%'
              }}
            >
              {/* Card Inner Container with 3D Transform */}
              <div
                className="relative w-full h-full transition-transform duration-600 ease-in-out"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: showAnswer ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
              >
                {/* Question Side (Front) */}
                <div
                  className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-700 rounded-3xl border-2 border-blue-200/50 dark:border-slate-600 overflow-hidden shadow-lg"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden'
                  }}
                >
                  {/* Question Content */}
                  <div className="absolute inset-0 p-4 sm:p-6 flex flex-col">
                    {/* Get a hint button at top */}
                    <div className="flex justify-start mb-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowHint(!showHint);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm rounded-lg border border-blue-200 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700 transition-all text-xs sm:text-sm"
                      >
                        <svg className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <span className="text-blue-700 dark:text-blue-300 font-medium">Get a hint</span>
                      </button>
                    </div>

                    {/* Show hint if enabled */}
                    {showHint && (
                      <div className="mb-3 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-600 rounded-r">
                        <p className="text-xs sm:text-sm text-yellow-900 dark:text-yellow-200 font-mono">
                          {getHint()}
                        </p>
                      </div>
                    )}

                    {/* Question text centered */}
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center w-full flex flex-col items-center justify-center gap-4">
                        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white leading-relaxed px-2">
                          {currentQuestion.question}
                        </h2>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm rounded-lg border border-blue-200 dark:border-slate-600">
                          <svg className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                          </svg>
                          <span className="text-blue-700 dark:text-blue-300 font-medium text-xs sm:text-sm">Tap to flip</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Answer Side (Back) */}
                <div
                  className="absolute inset-0 w-full h-full bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-slate-800 dark:to-slate-700 rounded-3xl border-2 border-emerald-200/50 dark:border-slate-600 overflow-hidden shadow-lg"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  {/* Answer Content */}
                  <div className="absolute inset-0 p-4 sm:p-6 flex flex-col items-center justify-center overflow-y-auto">
                    <div className="text-center w-full flex flex-col items-center justify-center gap-3">
                      <div className="inline-block bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold border border-emerald-200 dark:border-emerald-700">
                        Answer
                      </div>
                      {currentQuestion.answers.length === 1 ? (
                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white px-2">
                          {currentQuestion.answers[0]}
                        </p>
                      ) : (
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Any of these answers:</p>
                          <div className="space-y-1">
                            {currentQuestion.answers.map((answer, index) => (
                              <p key={index} className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                                • {answer}
                              </p>
                            ))}
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 italic mt-3">
                            💡 You only need to know ONE of these for the test
                          </p>
                        </div>
                      )}

                      {/* Tap to flip back hint */}
                      <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm rounded-lg border border-emerald-200 dark:border-emerald-700">
                        <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="text-emerald-700 dark:text-emerald-300 font-medium text-xs sm:text-sm">Tap to see question again</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Know/Still Learning Buttons with Progress Counter - Quizlet Style */}
            {trackProgressEnabled && (
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  onClick={handleStillLearning}
                  className="px-8 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold text-sm transition-all active:scale-95"
                >
                  Still Learning
                </button>

                {/* Progress Counter in Middle */}
                <div className="px-4 py-2 text-gray-600 dark:text-slate-400 font-semibold text-sm">
                  {currentIndex + 1} / {filteredQuestions.length}
                </div>

                <button
                  onClick={handleKnow}
                  className="px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm transition-all active:scale-95"
                >
                  Know
                </button>
              </div>
            )}

            {/* Bottom Toolbar - Utility Controls */}
            <div className="mt-6 flex items-center justify-center gap-6">
              {/* Previous Card (Undo) - Circular arrow like Quizlet */}
              <button
                onClick={handlePreviousCard}
                className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all min-w-[60px]"
                title="Previous card"
              >
                <svg className="w-7 h-7 text-gray-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
                <span className="text-xs font-medium text-gray-600 dark:text-slate-400">Previous</span>
              </button>

              {/* Shuffle - Quizlet style crossed arrows */}
              <button
                onClick={handleShuffle}
                className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all min-w-[60px]"
                title="Shuffle"
              >
                <svg className="w-7 h-7 text-gray-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 18h6l3-3H3m0-4h8.5l3-3H3m18 11l-4-4m4 4l-4 4m4-4H13m8-6l-4-4m4 4l-4 4m4-4h-4" />
                </svg>
                <span className="text-xs font-medium text-gray-600 dark:text-slate-400">Shuffle</span>
              </button>

              {/* Settings */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all min-w-[60px]"
                title="Settings"
              >
                <svg className="w-7 h-7 text-gray-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-xs font-medium text-gray-600 dark:text-slate-400">Settings</span>
              </button>

              {/* Fullscreen */}
              <button
                onClick={() => document.documentElement.requestFullscreen?.()}
                className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all min-w-[60px]"
                title="Fullscreen"
              >
                <svg className="w-7 h-7 text-gray-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span className="text-xs font-medium text-gray-600 dark:text-slate-400">Fullscreen</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Settings Modal (Quizlet-style) */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowSettings(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-slate-700" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Options</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-all"
              >
                <svg className="w-6 h-6 text-gray-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Options */}
            <div className="space-y-4">
              {/* Track Progress Toggle */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Track progress</h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    Sort your flashcards to keep track of what you know and what you&apos;re still learning. Turn progress tracking off if you want to quickly review your flashcards.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={trackProgressEnabled}
                    onChange={(e) => setTrackProgressEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <hr className="border-gray-200 dark:border-slate-700" />

              {/* Study only unstudied */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Study only unstudied cards</h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    Hide cards you&apos;ve marked as &quot;Know&quot;
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={showOnlyUnknown}
                    onChange={(e) => {
                      setShowOnlyUnknown(e.target.checked);
                      setCurrentIndex(0);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <hr className="border-gray-200 dark:border-slate-700" />

              {/* Category Filter */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Category</h3>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentIndex(0);
                  }}
                  className="w-full p-2.5 text-sm rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>

              <hr className="border-gray-200 dark:border-slate-700" />

              {/* Test Version */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Test Version</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleVersionChange('2008')}
                    className={`p-2.5 rounded-lg font-semibold text-sm transition-all border ${
                      testVersion === '2008'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 border-gray-300 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    2008 (100Q)
                  </button>
                  <button
                    onClick={() => handleVersionChange('2025')}
                    className={`p-2.5 rounded-lg font-semibold text-sm transition-all border ${
                      testVersion === '2025'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 border-gray-300 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    2025 (128Q)
                  </button>
                </div>
              </div>

              <hr className="border-gray-200 dark:border-slate-700" />

              {/* Keyboard Shortcuts */}
              <div>
                <button
                  className="w-full text-left font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  onClick={() => alert('Keyboard Shortcuts:\n\n← Arrow Left: Previous card\n→ Arrow Right: Know (or next card if tracking off)\nSpace: Flip card')}
                >
                  View keyboard shortcuts
                </button>
              </div>

              <hr className="border-gray-200 dark:border-slate-700" />

              {/* Text to Speech */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Text to speech</h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    Hear questions and answers read aloud
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={textToSpeechEnabled}
                    onChange={(e) => setTextToSpeechEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <hr className="border-gray-200 dark:border-slate-700" />

              {/* Restart Flashcards */}
              <button
                onClick={() => {
                  resetProgress();
                  setShowSettings(false);
                }}
                className="w-full text-left font-semibold text-red-600 dark:text-red-400 hover:underline"
              >
                Clear all progress
              </button>
            </div>
          </div>
        </div>
      )}

      </main>
    </>
  );
}
