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
    setShowAnswer(false);
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
      <main className="min-h-screen bg-white dark:bg-slate-900 flex flex-col">
        {/* Compact Header with Theme Toggle */}
        <div className="border-b border-gray-200 dark:border-slate-700">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white text-sm font-medium">
              ← Back
            </Link>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Study Mode</h1>
            <div className="w-16"></div> {/* Spacer */}
          </div>
        </div>

        {/* Compact Content - Fits in viewport */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl space-y-4">

            {/* Progress Stats - Inline */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stillLearningCount}</div>
                <div className="text-xs text-orange-700 dark:text-orange-300 font-medium">Review</div>
              </div>
              <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-gray-600 dark:text-slate-300">{unstudiedCount}</div>
                <div className="text-xs text-gray-700 dark:text-slate-400 font-medium">Unstudied</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{knownCount}</div>
                <div className="text-xs text-green-700 dark:text-green-300 font-medium">Know</div>
              </div>
            </div>

            {/* Test Version & Category - Combined Row */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Test Version - Compact */}
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2 block">Test Version</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleVersionChange('2008')}
                    className={`p-3 rounded-lg font-bold text-sm transition-all ${
                      testVersion === '2008'
                        ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    2008<span className="text-xs block opacity-75">(100Q)</span>
                  </button>
                  <button
                    onClick={() => handleVersionChange('2025')}
                    className={`p-3 rounded-lg font-bold text-sm transition-all ${
                      testVersion === '2025'
                        ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    2025<span className="text-xs block opacity-75">(128Q)</span>
                  </button>
                </div>
              </div>

              {/* Category - Dropdown */}
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2 block">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 rounded-lg border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white font-semibold focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 transition-all"
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
            <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={showOnlyUnknown}
                onChange={(e) => setShowOnlyUnknown(e.target.checked)}
                className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Show only unstudied cards
              </span>
            </label>

            {/* Start Button - Prominent */}
            <button
              onClick={handleStartStudy}
              disabled={filteredQuestions.length === 0}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {filteredQuestions.length === 0
                ? 'No cards available'
                : `Start Studying (${filteredQuestions.length} cards)`
              }
            </button>

            {/* Reset Progress - Small Link */}
            <div className="text-center">
              <button
                onClick={resetProgress}
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium text-sm"
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
    <main className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-y-auto">
      {/* Simplified Header - Only Exit Button */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4">
        <button
          onClick={handleExitStudy}
          className="flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-slate-700/50 hover:bg-white dark:hover:bg-slate-700 text-gray-900 dark:text-white rounded-lg font-semibold transition-all backdrop-blur-sm border border-gray-200 dark:border-transparent shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Exit
        </button>
      </div>

      {/* Flashcard Container */}
      <div className="flex items-center justify-center min-h-screen p-3 sm:p-4 pt-16 sm:pt-20 pb-44 sm:pb-56">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-12 text-center max-w-lg border border-gray-200 dark:border-slate-700">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              All Done!
            </h2>
            <p className="text-gray-600 dark:text-slate-300 mb-8 text-lg">
              You&apos;ve studied all cards in this category.
            </p>
            <button
              onClick={handleExitStudy}
              className="px-8 py-4 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-700 transition-colors"
            >
              Back to Setup
            </button>
          </div>
        ) : (
          <div className="w-full max-w-3xl">
            {/* Large Immersive Flashcard with 3D Flip */}
            <div
              id="flashcard"
              className={`relative rounded-2xl sm:rounded-3xl shadow-2xl ${!isFlipping ? 'cursor-pointer' : 'pointer-events-none'} ${
                swipeDirection === 'left' ? 'transform -translate-x-full opacity-0 transition-all duration-300' :
                swipeDirection === 'right' ? 'transform translate-x-full opacity-0 transition-all duration-300' : ''
              }`}
              onClick={handleFlipCard}
              style={{
                perspective: '1000px'
              }}
            >
              {/* Card Inner Container with 3D Transform */}
              <div
                className="relative w-full transition-transform duration-600 ease-in-out"
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
                  {/* Audio Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeak();
                    }}
                    className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/20 dark:bg-slate-900/50 hover:bg-white/30 dark:hover:bg-slate-900 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-sm"
                    aria-label="Read aloud"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  </button>

                  {/* Question Content */}
                  <div className="p-6 sm:p-8 md:p-12 flex flex-col items-center justify-center min-h-[280px] sm:min-h-[400px] md:min-h-[500px]">
                    <div className="text-center w-full">
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-8 sm:mb-12 leading-relaxed">
                        {currentQuestion.question}
                      </h2>
                      <div className="mt-auto">
                        <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white/20 dark:bg-slate-900/50 rounded-xl backdrop-blur-sm">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                          </svg>
                          <span className="text-white dark:text-slate-300 font-medium text-sm sm:text-base">Click to view the answer.</span>
                        </div>
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
                  {/* Audio Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeak();
                    }}
                    className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/20 dark:bg-slate-900/50 hover:bg-white/30 dark:hover:bg-slate-900 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-sm"
                    aria-label="Read aloud"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  </button>

                  {/* Answer Content */}
                  <div className="p-6 sm:p-8 md:p-12 flex flex-col items-center justify-center min-h-[280px] sm:min-h-[400px] md:min-h-[500px]">
                    <div className="text-center w-full">
                      <div className="inline-block bg-white/20 dark:bg-green-600/20 text-white dark:text-green-400 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold mb-6 sm:mb-8 border border-white/30 dark:border-green-500/30">
                        Answer
                      </div>
                      {currentQuestion.answers.length === 1 ? (
                        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-6 sm:mb-8">
                          {currentQuestion.answers[0]}
                        </p>
                      ) : (
                        <div className="mb-6 sm:mb-8">
                          <p className="text-sm sm:text-base font-bold text-white dark:text-slate-300 mb-4 sm:mb-6">Any of these answers:</p>
                          <div className="space-y-2 sm:space-y-3">
                            {currentQuestion.answers.map((answer, index) => (
                              <p key={index} className="text-base sm:text-lg md:text-xl font-semibold text-white">
                                • {answer}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                      {currentQuestion.answers.length > 1 && (
                        <p className="text-xs sm:text-sm text-white/80 dark:text-slate-400 italic mt-4 sm:mt-6">
                          💡 You only need to know ONE of these for the test
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Control Bar - Modern Duolingo/AnkiDroid Style */}
      {filteredQuestions.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 border-t border-gray-200 dark:border-slate-700 backdrop-blur-sm">
          {/* Static Progress Stats - Always Visible */}
          <div className="border-b border-gray-200 dark:border-slate-700 px-4 py-2">
            <div className="max-w-3xl mx-auto flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">{stillLearningCount} Review</span>
              </div>
              <div className="w-px h-4 bg-gray-300 dark:bg-slate-600"></div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{currentIndex + 1} / {filteredQuestions.length}</span>
              <div className="w-px h-4 bg-gray-300 dark:bg-slate-600"></div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">{knownCount} Know</span>
              </div>
            </div>
          </div>

          {/* Main Control Bar */}
          <div className="p-4">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-3">
                {/* Undo Button */}
                <button
                  onClick={handleUndo}
                  disabled={history.length === 0}
                  className="w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all active:scale-95"
                  aria-label="Undo"
                >
                  <svg className="w-5 h-5 text-gray-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                </button>

                {/* Need Review Button - Orange */}
                <button
                  onClick={handleStillLearning}
                  className="flex-1 max-w-[200px] h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
                  aria-label="Need to review"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="text-sm">Need Review</span>
                </button>

                {/* Know Button - Green */}
                <button
                  onClick={handleKnow}
                  className="flex-1 max-w-[200px] h-14 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
                  aria-label="I know"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Know</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
