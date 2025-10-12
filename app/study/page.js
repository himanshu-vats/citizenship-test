'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import questions2008 from '@/data/questions-2008.json';
import questions2025 from '@/data/questions-2025.json';

export default function StudyMode() {
  const [testVersion, setTestVersion] = useState('2025');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAnswer, setShowAnswer] = useState(false);
  const [knownQuestions, setKnownQuestions] = useState([]);
  const [stillLearningQuestions, setStillLearningQuestions] = useState([]);
  const [showOnlyUnknown, setShowOnlyUnknown] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);

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
  }, [currentIndex, filteredQuestions.length, knownQuestions, stillLearningQuestions]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') handleStillLearning();
      if (e.key === 'ArrowRight') handleKnow();
      if (e.key === ' ') {
        e.preventDefault();
        setShowAnswer(!showAnswer);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showAnswer, currentIndex, filteredQuestions.length]);

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
    }
  };

  // Get card status
  const getCardStatus = () => {
    if (knownQuestions.includes(currentQuestion.id)) return 'know';
    if (stillLearningQuestions.includes(currentQuestion.id)) return 'learning';
    return 'unstudied';
  };

  const cardStatus = getCardStatus();

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <Link
                href="/"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 font-semibold text-sm mb-2"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Home
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Flashcards</h1>
            </div>

            {/* Version Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => handleVersionChange('2008')}
                className={`px-3 py-1 rounded-lg font-bold text-sm transition-all ${
                  testVersion === '2008'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                2008
              </button>
              <button
                onClick={() => handleVersionChange('2025')}
                className={`px-3 py-1 rounded-lg font-bold text-sm transition-all ${
                  testVersion === '2025'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                2025
              </button>
            </div>
          </div>

          {/* Progress Counters - Quizlet Style */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                <span className="text-sm font-bold text-gray-700">
                  Still Learning: <span className="text-orange-600">{stillLearningCount}</span>
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm font-bold text-gray-700">
                  Know: <span className="text-green-600">{knownCount}</span>
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                <span className="text-sm font-bold text-gray-700">
                  Unstudied: <span className="text-gray-600">{unstudiedCount}</span>
                </span>
              </div>
            </div>
            <button
              onClick={resetProgress}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium"
            >
              Reset
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentIndex(0);
                  setShowAnswer(false);
                }}
                className={`px-3 py-1 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category === 'all' ? 'All' : category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Options */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
        <label className="flex items-center cursor-pointer bg-white rounded-lg p-3 shadow-sm">
          <input
            type="checkbox"
            checked={showOnlyUnknown}
            onChange={(e) => {
              setShowOnlyUnknown(e.target.checked);
              setCurrentIndex(0);
              setShowAnswer(false);
            }}
            className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 mr-2"
          />
          <span className="font-semibold text-gray-900">Show only unstudied cards</span>
          {showOnlyUnknown && (
            <span className="ml-auto text-sm text-gray-600 font-medium">
              {filteredQuestions.length} cards
            </span>
          )}
        </label>
      </div>

      {/* Flashcard */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              All Done!
            </h2>
            <p className="text-gray-700 mb-6">
              You&apos;ve studied all cards in this category.
            </p>
            <button
              onClick={() => {
                setShowOnlyUnknown(false);
                setSelectedCategory('all');
                setCurrentIndex(0);
              }}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors"
            >
              Review All Cards
            </button>
          </div>
        ) : (
          <div className="relative">
            {/* Card Counter */}
            <div className="text-center mb-4">
              <span className="text-sm font-bold text-gray-600">
                Card {currentIndex + 1} of {filteredQuestions.length}
              </span>
            </div>

            {/* Flashcard */}
            <div
              id="flashcard"
              className={`bg-white rounded-2xl shadow-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                swipeDirection === 'left' ? 'transform -translate-x-full opacity-0' :
                swipeDirection === 'right' ? 'transform translate-x-full opacity-0' : ''
              }`}
              onClick={() => setShowAnswer(!showAnswer)}
              style={{ minHeight: '400px' }}
            >
              {/* Card Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                {cardStatus === 'know' && (
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                    ✓ Know
                  </div>
                )}
                {cardStatus === 'learning' && (
                  <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-bold">
                    📖 Still Learning
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="p-8 sm:p-12 flex flex-col items-center justify-center min-h-[400px]">
                {!showAnswer ? (
                  // Question Side
                  <div className="text-center w-full">
                    <div className="inline-block bg-purple-100 text-purple-800 px-4 py-1 rounded-full text-sm font-bold mb-6">
                      {currentQuestion.category}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 leading-relaxed">
                      {currentQuestion.question}
                    </h2>
                    <p className="text-gray-500 text-sm font-medium">
                      Click card to reveal answer
                    </p>
                  </div>
                ) : (
                  // Answer Side
                  <div className="text-center w-full">
                    <div className="inline-block bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-bold mb-6">
                      Answer
                    </div>
                    {currentQuestion.answers.length === 1 ? (
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                        {currentQuestion.answers[0]}
                      </p>
                    ) : (
                      <div className="mb-6">
                        <p className="text-lg font-bold text-gray-700 mb-4">Any of these answers:</p>
                        <div className="space-y-2">
                          {currentQuestion.answers.map((answer, index) => (
                            <p key={index} className="text-xl font-semibold text-gray-900">
                              • {answer}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                    {currentQuestion.answers.length > 1 && (
                      <p className="text-sm text-gray-500 italic mt-4">
                        💡 You only need to know ONE of these for the test
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons - Quizlet Style */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                onClick={handleStillLearning}
                className="flex flex-col items-center justify-center py-6 bg-orange-100 hover:bg-orange-200 rounded-xl transition-all border-2 border-orange-300"
              >
                <svg className="w-8 h-8 text-orange-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="font-bold text-orange-800 text-lg">Still Learning</span>
                <span className="text-xs text-orange-600 mt-1">← Swipe Left</span>
              </button>

              <button
                onClick={handleKnow}
                className="flex flex-col items-center justify-center py-6 bg-green-100 hover:bg-green-200 rounded-xl transition-all border-2 border-green-300"
              >
                <svg className="w-8 h-8 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-bold text-green-800 text-lg">Know</span>
                <span className="text-xs text-green-600 mt-1">Swipe Right →</span>
              </button>
            </div>

            {/* Keyboard Shortcuts Hint */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 font-medium">
                Keyboard: ← Still Learning | → Know | Space to flip
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Study Tips */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
        <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded-r-lg">
          <h3 className="font-bold text-purple-900 mb-2 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Study Tips
          </h3>
          <div className="text-sm text-purple-900 space-y-1 font-medium">
            <p>• Mark &quot;Still Learning&quot; if you need to see this again</p>
            <p>• Mark &quot;Know&quot; when you can answer confidently</p>
            <p>• Review &quot;Still Learning&quot; cards daily until you know them</p>
            <p>• Use keyboard shortcuts for faster studying!</p>
          </div>
        </div>
      </div>
    </main>
  );
}
