'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Question from '@/components/Question';
import QuitModal from '@/components/QuitModal';
import ResultsScreen from '@/components/ResultsScreen';
import InlineZipPrompt from '@/components/InlineZipPrompt';
import PaywallModal from '@/components/PaywallModal';
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
  const [isPremium, setIsPremium] = useState(false);
  const [testCount, setTestCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);

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

    // Check premium status
    const premium = localStorage.getItem('isPremium');
    setIsPremium(premium === 'true');

    // Count completed tests
    const results = JSON.parse(localStorage.getItem('testResults') || '[]');
    setTestCount(results.length);
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
    // Reload test count to ensure we have the latest count
    const results = JSON.parse(localStorage.getItem('testResults') || '[]');
    setTestCount(results.length);
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
    // Check if user has exceeded free tier limit
    if (!isPremium && testCount >= 3) {
      setShowPaywall(true);
      return;
    }

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
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 via-white to-blue-700 p-4 sm:p-8">
        <div className="text-center max-w-2xl w-full">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-blue-600">
              <span className="text-5xl">🗽</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 mb-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 text-gray-900">
              US Citizenship Test Prep
            </h1>
            <p className="text-base sm:text-lg text-gray-700 mb-2 font-medium">
              Pass Your USCIS Civics Test with Confidence
            </p>

            {/* Key Value Props */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border border-blue-200">
              <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span className="text-gray-900 font-semibold">Both 2008 & 2025 Tests</span>
                </div>
                <div className="hidden sm:block text-gray-400">•</div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span className="text-gray-900 font-semibold">Official USCIS Questions</span>
                </div>
                <div className="hidden sm:block text-gray-400">•</div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span className="text-gray-900 font-semibold">Start Free</span>
                </div>
              </div>
            </div>

            {/* Test Version Badge */}
            <div className="mb-6 p-3 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
              <p className="text-xs font-bold text-amber-900 mb-1">📅 Which test will you take?</p>
              <p className="text-xs text-amber-800">
                <strong>2008 Test (100 Q)</strong> - Filed before Oct 20, 2025 •
                <strong className="ml-1">2025 Test (128 Q)</strong> - Filed on/after Oct 20, 2025
              </p>
            </div>

            <div className="flex gap-1 mb-6 justify-center">
              <div className="w-12 h-1 bg-red-600 rounded"></div>
              <div className="w-12 h-1 bg-white border border-gray-300 rounded"></div>
              <div className="w-12 h-1 bg-blue-600 rounded"></div>
            </div>

            {/* Primary CTA - Study Mode */}
            <Link
              href="/study"
              className="block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-6 rounded-2xl transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 mb-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-white bg-opacity-20 p-3 rounded-xl mr-4">
                    <span className="text-4xl">📚</span>
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-white text-xl block">Study Mode</span>
                    <span className="text-blue-100 text-sm">Learn with flashcards • Mark progress</span>
                  </div>
                </div>
                <svg className="w-8 h-8 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            {/* Secondary CTA - Practice Test */}
            <button
              onClick={handleStartTest}
              className="w-full p-5 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-400 rounded-2xl transition-all shadow-md hover:shadow-lg text-left group mb-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <div className="bg-blue-50 group-hover:bg-blue-100 p-3 rounded-xl mr-4 transition-colors">
                    <span className="text-3xl">✍️</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-lg block">Practice Test</span>
                      {!isPremium && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded">
                          {testCount}/3 used
                        </span>
                      )}
                    </div>
                    <span className="text-gray-600 text-sm">Test yourself • Track your score</span>
                  </div>
                </div>
                <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-600 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* Progress Card */}
            <Link
              href="/stats"
              className="block bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-green-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-white p-2.5 rounded-lg mr-3 shadow-sm">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-gray-900 text-sm block">Your Progress</span>
                    <span className="text-xs text-gray-600">View history & stats</span>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>

          <div className="bg-white bg-opacity-90 rounded-xl p-4 shadow-md">
            <p className="text-xs font-bold text-gray-900 mb-2">Why Choose This App?</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-700">
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span><strong>Both Versions:</strong> 2008 (100Q) & 2025 (128Q) official tests</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span><strong>Personalized:</strong> Auto-fills YOUR state&apos;s senators & officials</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span><strong>Free to Start:</strong> 3 free tests, then unlock unlimited</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Test version selection screen
  if (showVersionSelect && !showZipPrompt && !showOptions) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-red-600 via-white to-blue-700 p-4 sm:p-8">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setShowVersionSelect(false)}
            className="flex items-center text-blue-700 hover:text-blue-900 font-bold mb-6 bg-white px-4 py-2 rounded-lg shadow-md"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border-t-4 border-blue-600">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900">
              Which Test Version?
            </h2>
            <p className="text-gray-600 mb-6">Select based on your N-400 filing date</p>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg p-4 mb-6">
              <p className="text-sm font-bold text-yellow-900 mb-2">📅 Important: Choose Correctly!</p>
              <p className="text-sm text-yellow-800">
                The test version depends on when you filed Form N-400 (Application for Naturalization).
                The transition date is <strong>October 20, 2025</strong>.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleVersionSelect('2008')}
                className="w-full p-6 border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      2008 Test (100 Questions)
                    </h3>
                    <p className="text-gray-700 mb-3">
                      Filed N-400 <strong>before October 20, 2025</strong>
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 100 possible questions</li>
                      <li>• Asked 10 questions in interview</li>
                      <li>• Must answer 6 correctly to pass</li>
                    </ul>
                  </div>
                  <svg className="w-6 h-6 text-gray-400 flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              <button
                onClick={() => handleVersionSelect('2025')}
                className="w-full p-6 border-2 border-blue-500 bg-blue-50 rounded-xl hover:border-blue-600 hover:bg-blue-100 transition-all text-left"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        2025 Test (128 Questions)
                      </h3>
                      <span className="px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded">NEW</span>
                    </div>
                    <p className="text-gray-700 mb-3">
                      Filed N-400 <strong>on or after October 20, 2025</strong>
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 128 possible questions</li>
                      <li>• Asked 20 questions in interview</li>
                      <li>• Must answer 12 correctly to pass (60%)</li>
                    </ul>
                  </div>
                  <svg className="w-6 h-6 text-blue-600 flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg">
              <p className="text-sm text-blue-900">
                <strong>Not sure when you filed?</strong> Check your N-400 receipt notice or contact USCIS.
                If you haven&apos;t filed yet, you&apos;ll likely take the 2025 test.
              </p>
            </div>
          </div>
        </div>
      </main>
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
      <main className="min-h-screen bg-gradient-to-br from-red-600 via-white to-blue-700 p-4 sm:p-8">
        <PaywallModal
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
          testsTaken={testCount}
        />

        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => {
              setShowOptions(false);
              setShowVersionSelect(true);
            }}
            className="flex items-center text-blue-700 hover:text-blue-900 font-bold mb-6 bg-white px-4 py-2 rounded-lg shadow-md"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 border-t-4 border-blue-600">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Customize Your Test
              </h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-bold rounded-lg">
                {testVersion === '2025' ? '2025 Version' : '2008 Version'}
              </span>
            </div>

            {hasPersonalInfo ? (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                <p className="text-sm font-bold text-green-900 mb-1">✓ Personalized test enabled</p>
                <p className="text-sm text-green-800">
                  {userInfo.city}, {userInfo.state} • All questions available
                </p>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg">
                <p className="text-sm font-bold text-blue-900 mb-1">💡 Tip: Personalize state questions</p>
                <p className="text-sm text-blue-800">
                  We&apos;ll ask for your ZIP code if a question about YOUR state appears.
                  <Link href="/settings" className="ml-1 underline font-semibold text-blue-900">
                    Or add it now in Settings
                  </Link>
                </p>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-base font-bold text-gray-900 mb-3">
                Category
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
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none text-gray-900 font-medium bg-white"
              >
                <option value="all">All Categories ({questionSet.length} questions)</option>
                {categories.filter(c => c !== 'all').map(cat => (
                  <option key={cat} value={cat}>
                    {cat} ({categoryQuestionCounts[cat]} questions)
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-600 mt-2">
                💡 &quot;All Categories&quot; recommended for realistic test simulation
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-base font-bold text-gray-900 mb-3">
                Number of Questions
                {availableQuestions < testSize && (
                  <span className="ml-2 text-sm font-normal text-orange-600">
                    (Only {availableQuestions} available in this category)
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
                      className={`p-4 rounded-lg border-2 font-bold text-lg transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white shadow-lg'
                          : isDisabled
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'border-gray-300 text-gray-900 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </div>

            {availableQuestions < testSize && (
              <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
                <p className="text-sm font-bold text-yellow-900 mb-1">⚠️ Limited Questions</p>
                <p className="text-sm text-yellow-800">
                  This category only has {availableQuestions} question{availableQuestions !== 1 ? 's' : ''}.
                  Your test will include all {availableQuestions} question{availableQuestions !== 1 ? 's' : ''} instead of {testSize}.
                </p>
              </div>
            )}

            <button
              onClick={handleBeginTest}
              className="w-full py-4 bg-gradient-to-r from-red-600 via-blue-600 to-blue-700 text-white rounded-lg text-lg font-bold hover:shadow-xl transition-all shadow-md"
            >
              Begin Test ({effectiveTestSize} question{effectiveTestSize !== 1 ? 's' : ''})
            </button>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
              <p className="text-sm text-gray-900 font-semibold">
                📝 You need {Math.ceil(effectiveTestSize * 0.6)}/{effectiveTestSize} correct to pass (60%)
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Test in progress
  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 py-4 sm:py-8 pb-20">
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
            className="flex items-center text-blue-700 hover:text-blue-900 font-bold text-sm sm:text-base bg-white px-4 py-2 rounded-lg shadow-md"
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