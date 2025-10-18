'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Question from '@/components/Question';
import QuitModal from '@/components/QuitModal';
import ResultsScreen from '@/components/ResultsScreen';
import InlineZipPrompt from '@/components/InlineZipPrompt';
import AppHeader from '@/components/AppHeader';
import { prepareQuestionForTest } from '@/lib/answerGenerator';
import questions2008 from '@/data/questions-2008.json';
import questions2025 from '@/data/questions-2025.json';

export default function Home() {
  const [testStarted, setTestStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showVersionSelect, setShowVersionSelect] = useState(false);
  const [showZipPrompt, setShowZipPrompt] = useState(false);
  const [testVersion, setTestVersion] = useState('2025');
  const [zipCode, setZipCode] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [loadingZip, setLoadingZip] = useState(false);
  const [zipError, setZipError] = useState('');
  const [testSize, setTestSize] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [explanation, setExplanation] = useState('');
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [testQuestions, setTestQuestions] = useState([]);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [showInlineZipPrompt, setShowInlineZipPrompt] = useState(false);
  const [zipPromptDismissed, setZipPromptDismissed] = useState(false);
  const [testCount, setTestCount] = useState(0);

  // Get the appropriate question set based on test version
  const questionSet = testVersion === '2008' ? questions2008 : questions2025;
  
  // Get categories from the selected question set
  const categories = ['all', ...new Set(questionSet.map(q => q.category))];

  // Load saved user info and premium status on mount
  useEffect(() => {
    const saved = localStorage.getItem('userRepresentatives');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setUserInfo(data);
        setZipCode(data.zipCode || '');
      } catch (e) {
        console.error('Error loading saved info:', e);
      }
    }

    // Count completed tests for stats display
    const results = JSON.parse(localStorage.getItem('testResults') || '[]');
    setTestCount(results.length);

    // Check for startTest query parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('startTest') === 'true') {
      setShowVersionSelect(true);
      // Clean up URL
      window.history.replaceState({}, '', '/');
    }
  }, []);

  // Check if current question is personalized and show inline prompt if needed
  useEffect(() => {
    if (!testStarted || !testQuestions.length || hasSubmitted) return;

    const currentQuestion = testQuestions[currentIndex];
    const personalQuestionIds = [23, 29, 61, 62]; // IDs that need personalization

    // Show prompt if: no user info, question is personalized, hasn't been dismissed this session, and question not answered yet
    if (!userInfo && personalQuestionIds.includes(currentQuestion.id) && !zipPromptDismissed && !selectedAnswer) {
      setShowInlineZipPrompt(true);
    }
  }, [testStarted, currentIndex, testQuestions, userInfo, zipPromptDismissed, hasSubmitted, selectedAnswer]);

  const handleStartTest = () => {
    setShowVersionSelect(true);
  };

  const handleVersionSelect = (version) => {
    setTestVersion(version);
    setShowVersionSelect(false);
    setShowOptions(true);
  };

  const handleFetchZipInfo = async () => {
    if (!zipCode || zipCode.length !== 5) {
      setZipError('Please enter a valid 5-digit ZIP code');
      return;
    }

    setLoadingZip(true);
    setZipError('');

    try {
      const response = await fetch(`/api/representatives?zipCode=${zipCode}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch information');
      }

      setUserInfo(data);
      localStorage.setItem('userRepresentatives', JSON.stringify({
        ...data,
        zipCode,
        lastUpdated: new Date().toISOString()
      }));
      
      setShowZipPrompt(false);
      setShowOptions(true);
    } catch (err) {
      setZipError(err.message || 'Failed to fetch information');
    } finally {
      setLoadingZip(false);
    }
  };

  const handleSkipZip = () => {
    setUserInfo(null);
    setZipCode('');
    localStorage.removeItem('userRepresentatives');
    setShowZipPrompt(false);
    setShowOptions(true);
  };

  const handleBeginTest = () => {

    // Use the appropriate question set based on test version
    const questionSet = testVersion === '2008' ? questions2008 : questions2025;

    let filteredQuestions = selectedCategory === 'all'
      ? questionSet
      : questionSet.filter(q => q.category === selectedCategory);

    // Now we include all questions - the inline prompt will handle personalized ones
    const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(testSize, shuffled.length));

    setTestQuestions(selected.map(q => prepareQuestionForTest(q, testVersion, userInfo)));
    setTestStarted(true);
    setShowOptions(false);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setHasSubmitted(false);
    setIsCorrect(null);
    setExplanation('');
    setAnswers([]);
    setScore(0);
    setZipPromptDismissed(false);
  };

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (!hasSubmitted && selectedAnswer) {
      const currentQuestion = testQuestions[currentIndex];
      const correct = selectedAnswer === currentQuestion.correctAnswer;
      const exp = currentQuestion.getExplanation(selectedAnswer);
      
      setIsCorrect(correct);
      setExplanation(exp);
      setHasSubmitted(true);
      
      if (correct) {
        setScore(score + 1);
      }

      const newAnswers = [...answers];
      newAnswers[currentIndex] = {
        question: currentQuestion.question,
        selected: selectedAnswer,
        correct: currentQuestion.correctAnswer,
        isCorrect: correct,
        explanation: exp
      };
      setAnswers(newAnswers);
    } else if (hasSubmitted) {
      if (currentIndex < testQuestions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer(null);
        setHasSubmitted(false);
        setIsCorrect(null);
        setExplanation('');
      } else {
        // Use the current score - it was already incremented when answer was submitted
        const finalScore = score;
        const passingScore = testVersion === '2025' ? 12 : 6;
        const passed = finalScore >= passingScore;

        // Ensure all answers are saved including the last one
        const finalAnswers = [...answers];
        if (!finalAnswers[currentIndex]) {
          finalAnswers[currentIndex] = {
            question: testQuestions[currentIndex].question,
            selected: selectedAnswer,
            correct: testQuestions[currentIndex].correctAnswer,
            isCorrect: isCorrect,
            explanation: explanation
          };
        }

        const results = {
          date: new Date().toISOString(),
          score: finalScore,
          total: testQuestions.length,
          percentage: Math.round((finalScore / testQuestions.length) * 100),
          passed: passed,
          category: selectedCategory,
          testVersion: testVersion,
          answers: finalAnswers
        };

        saveTestResult(results);
        setTestResults(results);
        setTestStarted(false);
        setShowResults(true);
      }
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      const prevAnswer = answers[currentIndex - 1];
      if (prevAnswer) {
        setSelectedAnswer(prevAnswer.selected);
        setHasSubmitted(true);
        setIsCorrect(prevAnswer.isCorrect);
        setExplanation(prevAnswer.explanation);
      }
    }
  };

  const handleQuit = () => {
    setShowQuitModal(true);
  };

  const confirmQuit = () => {
    setShowQuitModal(false);
    setTestStarted(false);
    setShowResults(false);
    setTestResults(null);
    setShowOptions(false);
    setShowVersionSelect(false);
    setShowZipPrompt(false);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setHasSubmitted(false);
    setIsCorrect(null);
    setExplanation('');
    setAnswers([]);
    setScore(0);
  };

  const saveTestResult = (result) => {
    const existing = JSON.parse(localStorage.getItem('testResults') || '[]');
    existing.push(result);
    localStorage.setItem('testResults', JSON.stringify(existing));
    setTestCount(existing.length); // Update test count
  };

  const handleInlineZipSave = (data) => {
    setUserInfo(data);
    setShowInlineZipPrompt(false);
    // Regenerate current question with personalized data
    const currentQuestion = testQuestions[currentIndex];
    const updatedQuestion = prepareQuestionForTest(
      questionSet.find(q => q.id === currentQuestion.id),
      testVersion,
      data
    );
    const updatedQuestions = [...testQuestions];
    updatedQuestions[currentIndex] = updatedQuestion;
    setTestQuestions(updatedQuestions);
  };

  const handleInlineZipSkip = () => {
    setShowInlineZipPrompt(false);
    setZipPromptDismissed(true); // Don't show again this session
  };

  // Results screen
  if (showResults && testResults) {
    return (
      <ResultsScreen
        score={testResults.score}
        total={testResults.total}
        percentage={testResults.percentage}
        passed={testResults.passed}
        answers={testResults.answers}
        testVersion={testResults.testVersion}
        onRetake={() => {
          setShowResults(false);
          setTestResults(null);
          setShowVersionSelect(true);
        }}
        onGoHome={() => {
          setShowResults(false);
          setTestResults(null);
        }}
      />
    );
  }

  // Home screen
  if (!testStarted && !showResults && !showOptions && !showVersionSelect && !showZipPrompt) {
    return (
      <>
        <AppHeader showBack={false} />
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-4 sm:p-6">
          <div className="max-w-2xl mx-auto">

            {/* Hero Section */}
            <div className="text-center mb-4 pt-4">
              <div className="mx-auto mb-6">
                <span className="text-9xl sm:text-[10rem] md:text-[12rem]">🗽</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-3 leading-tight">
                US Citizenship Test
              </h1>
              <p className="text-gray-600 dark:text-slate-400 text-base sm:text-lg font-medium max-w-md mx-auto">
                Official USCIS questions • 2008 & 2025 versions
              </p>
            </div>

            {/* Primary Action - Study Mode (Hero CTA) */}
            <Link
              href="/study"
              className="block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 mb-4 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <span className="text-3xl">📚</span>
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-white text-xl">Study Mode</div>
                      <div className="text-blue-100 text-sm">Learn before you test</div>
                    </div>
                  </div>
                  <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Secondary Actions Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Practice Test */}
              <button
                onClick={handleStartTest}
                className="bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border-2 border-gray-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 rounded-2xl transition-all shadow-md hover:shadow-lg p-5 text-center group relative"
              >
                <div className="text-4xl mb-2">✍️</div>
                <div className="font-bold text-gray-900 dark:text-white text-base mb-1">Practice Test</div>
                <div className="text-xs text-gray-600 dark:text-slate-400">Take a quiz</div>
              </button>

              {/* Stats */}
              <Link
                href="/stats"
                className="bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border-2 border-gray-200 dark:border-slate-700 hover:border-green-400 dark:hover:border-green-500 rounded-2xl transition-all shadow-md hover:shadow-lg p-5 text-center group"
              >
                <div className="text-4xl mb-2">📊</div>
                <div className="font-bold text-gray-900 dark:text-white text-base mb-1">Your Stats</div>
                <div className="text-xs text-gray-600 dark:text-slate-400">View progress</div>
              </Link>
            </div>

            {/* Quick Stats (if user has history) */}
            {testCount > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 mb-6 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 dark:text-green-400 text-xl">🎯</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {testCount} test{testCount !== 1 ? 's' : ''} completed
                    </span>
                  </div>
                  <Link
                    href="/stats"
                    className="text-xs font-bold text-green-700 dark:text-green-400 hover:underline"
                  >
                    View all →
                  </Link>
                </div>
              </div>
            )}

            {/* Settings Quick Access */}
            <Link
              href="/settings"
              className="block bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl p-4 transition-all border border-gray-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚙️</span>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">Settings</div>
                    <div className="text-xs text-gray-600 dark:text-slate-400">Version, ZIP code & more</div>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

          </div>
        </main>
      </>
    );
  }

  // Test version selection screen
  if (showVersionSelect && !showZipPrompt && !showOptions) {
    return (
      <>
        <AppHeader
          title="Choose Version"
          showBack={true}
          onBackClick={() => setShowVersionSelect(false)}
        />
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-4 sm:p-6">
          <div className="max-w-2xl mx-auto">

            {/* Info Alert */}
            <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-yellow-600 dark:text-yellow-400 text-xl flex-shrink-0">📅</span>
                <div>
                  <p className="text-sm font-bold text-yellow-900 dark:text-yellow-200 mb-1">Choose based on your filing date</p>
                  <p className="text-xs text-yellow-800 dark:text-yellow-300">
                    Filed <strong>before Oct 20, 2025</strong> → 2008 version<br/>
                    Filed <strong>on/after Oct 20, 2025</strong> → 2025 version
                  </p>
                </div>
              </div>
            </div>

            {/* Version Cards */}
            <div className="space-y-4 mb-6">
              {/* 2025 Version (Featured) */}
              <button
                onClick={() => handleVersionSelect('2025')}
                className="w-full bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl p-6 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-left"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold">2025 Test</h3>
                    <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-xs font-bold rounded">NEW</span>
                  </div>
                  <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div className="space-y-2 text-sm text-white/90">
                  <p className="font-semibold">Filed on/after October 20, 2025</p>
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div className="bg-white/10 rounded-lg p-2 text-center">
                      <div className="font-bold text-lg">128</div>
                      <div className="text-xs opacity-80">Questions</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 text-center">
                      <div className="font-bold text-lg">20</div>
                      <div className="text-xs opacity-80">Asked</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 text-center">
                      <div className="font-bold text-lg">12</div>
                      <div className="text-xs opacity-80">To pass</div>
                    </div>
                  </div>
                </div>
              </button>

              {/* 2008 Version */}
              <button
                onClick={() => handleVersionSelect('2008')}
                className="w-full bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border-2 border-gray-200 dark:border-slate-700 rounded-2xl p-6 transition-all shadow-md hover:shadow-lg text-left"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">2008 Test</h3>
                  <svg className="w-6 h-6 text-gray-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
                  <p className="font-semibold text-gray-700 dark:text-slate-300">Filed before October 20, 2025</p>
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-2 text-center">
                      <div className="font-bold text-lg text-gray-900 dark:text-white">100</div>
                      <div className="text-xs">Questions</div>
                    </div>
                    <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-2 text-center">
                      <div className="font-bold text-lg text-gray-900 dark:text-white">10</div>
                      <div className="text-xs">Asked</div>
                    </div>
                    <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-2 text-center">
                      <div className="font-bold text-lg text-gray-900 dark:text-white">6</div>
                      <div className="text-xs">To pass</div>
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* Help Text */}
            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
              <p className="text-xs text-gray-600 dark:text-slate-400 text-center">
                <strong className="text-gray-900 dark:text-white">Not sure?</strong> Check your N-400 receipt notice or contact USCIS
              </p>
            </div>

          </div>
        </main>
      </>
    );
  }

  // ZIP Code prompt screen
  if (showZipPrompt && !showOptions) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-red-600 via-white to-blue-700 p-4 sm:p-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => {
              setShowZipPrompt(false);
              setShowVersionSelect(true);
            }}
            className="flex items-center text-blue-700 hover:text-blue-900 font-bold mb-6 bg-white px-4 py-2 rounded-lg shadow-md"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border-t-4 border-blue-600">
            <div className="flex items-center mb-6">
              <span className="text-4xl mr-3">📍</span>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Personalize Your Test
                </h2>
                <p className="text-gray-600 mt-1">
                  Optional: Get your specific representatives
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6 rounded-r-lg">
              <p className="text-sm text-blue-900">
                <strong>Why provide your ZIP code?</strong> Some questions ask about YOUR specific senators,
                representative, and governor. We&apos;ll automatically fill in the correct answers for your location!
              </p>
            </div>

            {userInfo ? (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                <p className="text-sm font-bold text-green-900 mb-2">✓ Your information is saved!</p>
                <p className="text-sm text-green-800">
                  ZIP Code: <strong>{userInfo.zipCode}</strong> • {userInfo.city}, {userInfo.state}
                </p>
                <button
                  onClick={() => {
                    setUserInfo(null);
                    setZipCode('');
                    localStorage.removeItem('userRepresentatives');
                  }}
                  className="text-xs text-green-700 hover:text-green-900 font-medium mt-2 underline"
                >
                  Clear and enter new ZIP code
                </button>
              </div>
            ) : (
              <div className="mb-6">
                <label className="block text-lg font-bold text-gray-900 mb-3">
                  Enter Your ZIP Code (Optional)
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => {
                      setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5));
                      setZipError('');
                    }}
                    placeholder="12345"
                    maxLength="5"
                    className="flex-1 p-4 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none text-gray-900 font-medium text-lg"
                    disabled={loadingZip}
                  />
                  <button
                    onClick={handleFetchZipInfo}
                    disabled={loadingZip || zipCode.length !== 5}
                    className="px-8 py-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {loadingZip ? 'Loading...' : 'Save'}
                  </button>
                </div>
                {zipError && (
                  <p className="text-red-600 mt-2 text-sm font-medium">{zipError}</p>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSkipZip}
                className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-all"
              >
                Skip for Now
              </button>
              {userInfo && (
                <button
                  onClick={() => {
                    setShowZipPrompt(false);
                    setShowOptions(true);
                  }}
                  className="flex-1 py-4 bg-gradient-to-r from-red-600 via-blue-600 to-blue-700 text-white rounded-lg font-bold hover:shadow-xl transition-all"
                >
                  Continue with Saved Info
                </button>
              )}
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
              <p className="text-sm text-yellow-900">
                <strong>Note:</strong> If you skip, questions about your specific representatives will be excluded from the test.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Test options screen
  if (showOptions && !testStarted) {
    const hasPersonalInfo = !!userInfo;

    // Calculate questions per category
    const categoryQuestionCounts = {};
    questionSet.forEach(q => {
      categoryQuestionCounts[q.category] = (categoryQuestionCounts[q.category] || 0) + 1;
    });

    const filteredQuestions = selectedCategory === 'all'
      ? questionSet
      : questionSet.filter(q => q.category === selectedCategory);
    const availableQuestions = filteredQuestions.length;

    // Adjust test size if it exceeds available questions
    const effectiveTestSize = Math.min(testSize, availableQuestions);

    return (
      <>
        <AppHeader title="Customize Your Test" showBack={true} onBackClick={() => {
          setShowOptions(false);
          setShowVersionSelect(true);
        }} />
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          {/* Version Badge */}
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white text-sm font-bold rounded-xl shadow-md">
              {testVersion === '2025' ? '2025 Test Version' : '2008 Test Version'}
            </span>
          </div>

          {/* Personalization Status */}
          {hasPersonalInfo ? (
            <div className="mb-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-green-600 dark:text-green-400 text-xl flex-shrink-0">✓</span>
                <div>
                  <p className="text-sm font-bold text-green-900 dark:text-green-200 mb-1">Personalized test enabled</p>
                  <p className="text-xs text-green-800 dark:text-green-300">
                    {userInfo.city}, {userInfo.state} • All questions available
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 text-xl flex-shrink-0">💡</span>
                <div>
                  <p className="text-sm font-bold text-blue-900 dark:text-blue-200 mb-1">Tip: Personalize state questions</p>
                  <p className="text-xs text-blue-800 dark:text-blue-300">
                    We&apos;ll ask for your ZIP code if a question about YOUR state appears.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Category Selection Card */}
          <div className="mb-4 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
              📚 Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                const newCategory = e.target.value;
                setSelectedCategory(newCategory);
                // Calculate available questions for new category
                const newFilteredQuestions = newCategory === 'all'
                  ? questionSet
                  : questionSet.filter(q => q.category === newCategory);
                const newAvailableQuestions = newFilteredQuestions.length;
                // Set testSize to min of current size and available questions
                setTestSize(Math.min(testSize, newAvailableQuestions));
              }}
              className="w-full p-3 border-2 border-gray-300 dark:border-slate-600 rounded-xl focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none text-gray-900 dark:text-white font-medium bg-white dark:bg-slate-700 text-sm"
            >
              <option value="all">All Categories ({questionSet.length} questions)</option>
              {categories.filter(c => c !== 'all').map(cat => (
                <option key={cat} value={cat}>
                  {cat} ({categoryQuestionCounts[cat]} questions)
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-600 dark:text-slate-400 mt-2">
              💡 &quot;All Categories&quot; recommended for realistic test simulation
            </p>
          </div>

          {/* Test Size Selection Card */}
          <div className="mb-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
              🔢 Number of Questions
              {availableQuestions < testSize && (
                <span className="ml-2 text-xs font-normal text-orange-600 dark:text-orange-400">
                  (Only {availableQuestions} available)
                </span>
              )}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[10, 20, 50, 100].map(num => {
                const isDisabled = num > availableQuestions;
                const isSelected = testSize === num;

                return (
                  <button
                    key={num}
                    onClick={() => setTestSize(num)}
                    disabled={isDisabled}
                    className={`p-3 rounded-xl border-2 font-bold text-base transition-all ${
                      isSelected
                        ? 'border-blue-600 dark:border-blue-500 bg-blue-600 dark:bg-blue-700 text-white shadow-lg'
                        : isDisabled
                        ? 'border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500 cursor-not-allowed'
                        : 'border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>

            {availableQuestions < testSize && (
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                <p className="text-xs font-bold text-yellow-900 dark:text-yellow-200 mb-1">⚠️ Limited Questions</p>
                <p className="text-xs text-yellow-800 dark:text-yellow-300">
                  This category only has {availableQuestions} question{availableQuestions !== 1 ? 's' : ''}.
                  Your test will include all {availableQuestions}.
                </p>
              </div>
            )}
          </div>

          {/* Begin Test Button */}
          <button
            onClick={handleBeginTest}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl text-base font-bold hover:shadow-xl transition-all shadow-lg mb-4"
          >
            Begin Test ({effectiveTestSize} question{effectiveTestSize !== 1 ? 's' : ''})
          </button>

          {/* Passing Info */}
          <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
            <p className="text-xs text-gray-900 dark:text-white font-semibold text-center">
              📝 You need {Math.ceil(effectiveTestSize * 0.6)}/{effectiveTestSize} correct to pass (60%)
            </p>
          </div>
        </div>
      </main>
      </>
    );
  }

  // Test in progress
  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-4 sm:py-8 pb-20">
      <QuitModal
        isOpen={showQuitModal}
        onClose={() => setShowQuitModal(false)}
        onConfirm={confirmQuit}
        currentQuestion={currentIndex + 1}
        totalQuestions={testQuestions.length}
        score={score}
      />

      {showInlineZipPrompt && (
        <InlineZipPrompt
          onSave={handleInlineZipSave}
          onSkip={handleInlineZipSkip}
          currentQuestion={testQuestions[currentIndex]}
        />
      )}

      {currentIndex > 0 && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-4">
          <button
            onClick={handleBack}
            className="flex items-center text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 font-bold text-sm sm:text-base bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-md"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Previous Question
          </button>
        </div>
      )}

      <Question
        question={testQuestions[currentIndex].question}
        answers={testQuestions[currentIndex].displayOptions}
        correctAnswer={testQuestions[currentIndex].correctAnswer}
        allCorrectAnswers={testQuestions[currentIndex].allCorrectAnswers}
        explanation={explanation}
        onAnswer={handleAnswer}
        onNext={handleNext}
        onQuit={handleQuit}
        questionNumber={currentIndex + 1}
        totalQuestions={testQuestions.length}
        selectedAnswer={selectedAnswer}
        isCorrect={isCorrect}
        hasSubmitted={hasSubmitted}
        score={score}
      />
    </main>
  );
}