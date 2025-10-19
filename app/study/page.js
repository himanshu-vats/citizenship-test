'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import questions2008 from '@/data/questions-2008.json';
import questions2025 from '@/data/questions-2025.json';

export default function StudyMode() {
  // State management
  const [studyStarted, setStudyStarted] = useState(false);
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

  // Get the appropriate question set
  const allQuestions = testVersion === '2008' ? questions2008 : questions2025;

  // Get unique categories
  const categories = ['all', ...new Set(allQuestions.map(q => q.category))];

  // Filter questions
  const getFilteredQuestions = () => {
    let filtered = selectedCategory === 'all'
      ? allQuestions
      : allQuestions.filter(q => q.category === selectedCategory);

    if (showOnlyUnknown) {
      filtered = filtered.filter(q => !knownQuestions.includes(q.id));
    }

    return filtered;
  };

  const filteredQuestions = getFilteredQuestions();
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

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('knownQuestions', JSON.stringify(knownQuestions));
    localStorage.setItem('stillLearningQuestions', JSON.stringify(stillLearningQuestions));
  }, [knownQuestions, stillLearningQuestions]);

  // Handle "Know" action
  const handleKnow = () => {
    const questionId = currentQuestion.id;

    // Save state for undo
    setHistory([...history, { index: currentIndex, action: 'know', questionId, prevKnown: knownQuestions.includes(questionId), prevLearning: stillLearningQuestions.includes(questionId) }]);

    // Add to known, remove from still learning
    if (!knownQuestions.includes(questionId)) {
      setKnownQuestions([...knownQuestions, questionId]);
    }
    setStillLearningQuestions(stillLearningQuestions.filter(id => id !== questionId));

    // Visual feedback
    setSwipeDirection('right');
    setShowAnswer(false); // Reset flip state immediately
    setTimeout(() => {
      moveToNextCard();
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

  // Handle undo
  const handleUndo = () => {
    if (history.length === 0) return;

    const lastAction = history[history.length - 1];
    setHistory(history.slice(0, -1));

    // Restore previous state
    if (lastAction.prevKnown) {
      if (!knownQuestions.includes(lastAction.questionId)) {
        setKnownQuestions([...knownQuestions, lastAction.questionId]);
      }
    } else {
      setKnownQuestions(knownQuestions.filter(id => id !== lastAction.questionId));
    }

    if (lastAction.prevLearning) {
      if (!stillLearningQuestions.includes(lastAction.questionId)) {
        setStillLearningQuestions([...stillLearningQuestions, lastAction.questionId]);
      }
    } else {
      setStillLearningQuestions(stillLearningQuestions.filter(id => id !== lastAction.questionId));
    }

    // Go back to previous card
    if (lastAction.index < currentIndex) {
      setCurrentIndex(lastAction.index);
    }
    setShowAnswer(false);
  };

  const moveToNextCard = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
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
      if (e.key === 'ArrowLeft') handleStillLearning();
      if (e.key === 'ArrowRight') handleKnow();
      if (e.key === ' ') {
        e.preventDefault();
        setShowAnswer(!showAnswer);
      }
      if (e.key === 'u' || e.key === 'U') handleUndo();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [studyStarted, showAnswer, currentIndex, filteredQuestions.length, history]);

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

  const handleStartStudy = () => {
    setStudyStarted(true);
    setCurrentIndex(0);
    setShowAnswer(false);
    setHistory([]);
  };

  const handleExitStudy = () => {
    setStudyStarted(false);
    setShowAnswer(false);
  };

  // Handle card flip with animation
  const handleFlipCard = () => {
    if (isFlipping) return; // Prevent multiple flips during animation

    setIsFlipping(true);
    setShowAnswer(!showAnswer);

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

  // SETUP SCREEN (Before study starts) - Compact, No Scroll Design
  if (!studyStarted) {
    return (
      <main className="h-screen bg-white dark:bg-slate-900 flex flex-col overflow-hidden">
        {/* Compact Header with Theme Toggle */}
        <div className="border-b border-gray-200 dark:border-slate-700 flex-shrink-0">
          <div className="max-w-5xl mx-auto px-3 py-2 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-lg text-sm font-semibold transition-all border border-gray-200 dark:border-slate-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Link>
            <h1 className="text-base font-bold text-gray-900 dark:text-white">Study Mode</h1>
            <div className="w-12"></div> {/* Spacer */}
          </div>
        </div>

        {/* Compact Content - Fits in viewport */}
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
    <main className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col overflow-hidden">
      {/* Simplified Header - Only Exit Button */}
      <div className="flex-shrink-0 px-3 py-2">
        <button
          onClick={handleExitStudy}
          className="bg-red-600 dark:bg-red-700 text-white hover:bg-red-700 dark:hover:bg-red-600 font-bold text-xs px-3 py-1.5 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Exit
        </button>
      </div>

      {/* Flashcard Container - Dynamically sized */}
      <div className="flex-1 flex items-center justify-center px-3 py-2 overflow-hidden min-h-0">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-center max-w-md border border-gray-200 dark:border-slate-700">
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              All Done!
            </h2>
            <p className="text-gray-600 dark:text-slate-300 mb-4 text-sm sm:text-base">
              You&apos;ve studied all cards in this category.
            </p>
            <button
              onClick={handleExitStudy}
              className="px-6 py-2.5 bg-purple-600 text-white rounded-xl font-bold text-sm sm:text-base hover:bg-purple-700 transition-colors"
            >
              Back to Setup
            </button>
          </div>
        ) : (
          <div className="w-full max-w-3xl h-full flex items-center justify-center">
            {/* Large Immersive Flashcard with 3D Flip */}
            <div
              id="flashcard"
              className={`relative w-full max-h-full rounded-2xl sm:rounded-3xl shadow-2xl ${!isFlipping ? 'cursor-pointer' : 'pointer-events-none'} ${
                swipeDirection === 'left' ? 'transform -translate-x-full opacity-0 transition-all duration-300' :
                swipeDirection === 'right' ? 'transform translate-x-full opacity-0 transition-all duration-300' : ''
              }`}
              onClick={handleFlipCard}
              style={{
                perspective: '1000px',
                aspectRatio: '3/2',
                maxWidth: '100%',
                maxHeight: '100%'
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
                  className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 dark:from-slate-800 dark:to-slate-700 rounded-3xl border border-blue-500/30 dark:border-slate-600/50 overflow-hidden"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden'
                  }}
                >
                  {/* Question Content */}
                  <div className="absolute inset-0 p-4 sm:p-6 flex flex-col items-center justify-center">
                    <div className="text-center w-full flex flex-col items-center justify-center gap-4">
                      <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white leading-relaxed px-2">
                        {currentQuestion.question}
                      </h2>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 dark:bg-slate-900/50 rounded-xl backdrop-blur-sm">
                        <svg className="w-3.5 h-3.5 text-white dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                        </svg>
                        <span className="text-white dark:text-slate-300 font-medium text-xs sm:text-sm">Tap to flip</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Answer Side (Back) */}
                <div
                  className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-600 to-emerald-600 dark:from-slate-800 dark:to-slate-700 rounded-3xl border border-green-500/30 dark:border-slate-600/50 overflow-hidden"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  {/* Answer Content */}
                  <div className="absolute inset-0 p-4 sm:p-6 flex flex-col items-center justify-center overflow-y-auto">
                    <div className="text-center w-full flex flex-col items-center justify-center">
                      <div className="inline-block bg-white/20 dark:bg-green-600/20 text-white dark:text-green-400 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold mb-3 border border-white/30 dark:border-green-500/30">
                        Answer
                      </div>
                      {currentQuestion.answers.length === 1 ? (
                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white px-2">
                          {currentQuestion.answers[0]}
                        </p>
                      ) : (
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-white dark:text-slate-300 mb-2">Any of these answers:</p>
                          <div className="space-y-1">
                            {currentQuestion.answers.map((answer, index) => (
                              <p key={index} className="text-sm sm:text-base md:text-lg font-semibold text-white">
                                • {answer}
                              </p>
                            ))}
                          </div>
                          <p className="text-xs sm:text-sm text-white/80 dark:text-slate-400 italic mt-3">
                            💡 You only need to know ONE of these for the test
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Control Bar - Compact Design */}
      {filteredQuestions.length > 0 && (
        <div className="flex-shrink-0 bg-white/95 dark:bg-slate-900/95 border-t border-gray-200 dark:border-slate-700 backdrop-blur-sm pb-safe">
          {/* Static Progress Stats - Always Visible */}
          <div className="border-b border-gray-200 dark:border-slate-700 px-3 py-1.5">
            <div className="max-w-3xl mx-auto flex items-center justify-center gap-2 text-xs sm:text-sm">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                <span className="font-semibold text-gray-700 dark:text-slate-300">{stillLearningCount}</span>
              </div>
              <div className="w-px h-3 bg-gray-300 dark:bg-slate-600"></div>
              <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">{currentIndex + 1}/{filteredQuestions.length}</span>
              <div className="w-px h-3 bg-gray-300 dark:bg-slate-600"></div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span className="font-semibold text-gray-700 dark:text-slate-300">{knownCount}</span>
              </div>
            </div>
          </div>

          {/* Main Control Bar */}
          <div className="px-3 py-2">
            <div className="max-w-3xl mx-auto flex items-center justify-center gap-2">
              {/* Undo Button */}
              <button
                onClick={handleUndo}
                disabled={history.length === 0}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all active:scale-95"
                aria-label="Undo"
              >
                <svg className="w-4 h-4 text-gray-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </button>

              {/* Need Review Button - Orange */}
              <button
                onClick={handleStillLearning}
                className="flex-1 max-w-[160px] h-10 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-all active:scale-95 shadow-md flex items-center justify-center gap-1.5"
                aria-label="Need to review"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-xs sm:text-sm">Review</span>
              </button>

              {/* Know Button - Green */}
              <button
                onClick={handleKnow}
                className="flex-1 max-w-[160px] h-10 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all active:scale-95 shadow-md flex items-center justify-center gap-1.5"
                aria-label="I know"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs sm:text-sm">Know</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
