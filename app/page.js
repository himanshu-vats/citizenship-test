'use client';

import { useState, useEffect } from 'react';
import { useState, useEffect, useReducer } from 'react';
import Link from 'next/link';
import Question from '@/components/Question';
import QuitModal from '@/components/QuitModal';
import { prepareQuestionForTest } from '@/lib/answerGenerator';
import questions2008 from '@/data/questions-2008.json';
import questions2025 from '@/data/questions-2025.json';

const initialState = {
  testStarted: false,
  currentScreen: 'home', // 'home', 'version', 'zip', 'options'
  testVersion: '2025',
  zipCode: '',
  userInfo: null,
  loadingZip: false,
  zipError: '',
  testSize: 10,
  selectedCategory: 'all',
  currentIndex: 0,
  selectedAnswer: null,
  hasSubmitted: false,
  isCorrect: null,
  explanation: '',
  answers: [],
  score: 0,
  testQuestions: [],
  showQuitModal: false,
};

function testReducer(state, action) {
  switch (action.type) {
    case 'START_TEST_SETUP':
      return { ...state, currentScreen: 'version' };
    case 'SELECT_VERSION':
      return { ...state, testVersion: action.payload, currentScreen: 'zip' };
    // ... other actions for each state transition
    default:
      return state;
  }
}

export default function Home() {
  const [testStarted, setTestStarted] = useState(false);
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
  const [state, dispatch] = useReducer(testReducer, initialState);
  const { testStarted, currentScreen, testVersion, zipCode, userInfo, loadingZip, zipError, testSize, selectedCategory, currentIndex, selectedAnswer, hasSubmitted, isCorrect, explanation, answers, score, testQuestions, showQuitModal } = state;

  // Get the appropriate question set based on test version
  const questionSet = testVersion === '2008' ? questions2008 : questions2025;
  
  // Get categories from the selected question set
  const categories = ['all', ...new Set(questionSet.map(q => q.category))];

  // Load saved user info on mount
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
  }, []);

  const handleStartTest = () => {
    setShowVersionSelect(true);
  };

  const handleVersionSelect = (version) => {
    setTestVersion(version);
    setShowVersionSelect(false);
    setShowZipPrompt(true);
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
    
    // Questions that require personalization (IDs that ask about user's specific reps)
    const personalQuestionIds = [20, 23, 29, 43, 44, 61]; // Adjust these based on actual question IDs
    
    let filteredQuestions = selectedCategory === 'all' 
      ? questionSet 
      : questionSet.filter(q => q.category === selectedCategory);

    // If user hasn't provided ZIP code, exclude personal questions
    if (!userInfo) {
      filteredQuestions = filteredQuestions.filter(q => !personalQuestionIds.includes(q.id));
    }

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
        const finalScore = score + (isCorrect ? 1 : 0);
        const passingScore = testVersion === '2025' ? 12 : 6;
        const passed = finalScore >= passingScore;
        
        saveTestResult({
          date: new Date().toISOString(),
          score: finalScore,
          total: testQuestions.length,
          percentage: Math.round((finalScore / testQuestions.length) * 100),
          passed: passed,
          category: selectedCategory,
          testVersion: testVersion,
          answers: answers
        });

        alert(`Test complete!\n\nScore: ${finalScore}/${testQuestions.length} (${Math.round((finalScore/testQuestions.length)*100)}%)\n${passed ? '✓ PASSED' : '✗ Need more practice'}\n\nVersion: ${testVersion === '2025' ? '2025 Test (need 12/20)' : '2008 Test (need 6/10)'}`);
        
        setTestStarted(false);
        setShowOptions(false);
        setShowVersionSelect(false);
        setShowZipPrompt(false);
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
  };

  // Home screen
  if (!testStarted && !showOptions && !showVersionSelect && !showZipPrompt) {
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
              US Citizenship Test 2025
            </h1>
            <p className="text-lg sm:text-xl mb-6 text-gray-700">
              Master all 128 official USCIS questions
            </p>
            
            <div className="flex gap-1 mb-6 justify-center">
              <div className="w-12 h-1 bg-red-600 rounded"></div>
              <div className="w-12 h-1 bg-white border border-gray-300 rounded"></div>
              <div className="w-12 h-1 bg-blue-600 rounded"></div>
            </div>

            <button 
              onClick={handleStartTest}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Start Practice Test
            </button>
          </div>

          <div className="space-y-3">
            <Link 
              href="/stats" 
              className="block bg-white hover:bg-gray-50 text-gray-900 p-4 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📊</span>
                  <span className="font-semibold text-gray-900">View Past Results</span>
                </div>
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            <Link 
              href="/personalize" 
              className="block bg-white hover:bg-gray-50 text-gray-900 p-4 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📍</span>
                  <span className="font-semibold text-gray-900">Manage My Representatives</span>
                </div>
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>

          <div className="mt-6 bg-white bg-opacity-90 rounded-lg p-3 shadow-md">
            <p className="text-sm text-gray-800 font-medium">
              ⭐ 2025 Official Questions • Detailed Explanations • Track Progress
            </p>
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
                If you haven't filed yet, you'll likely take the 2025 test.
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
                representative, and governor. We'll automatically fill in the correct answers for your location!
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
    const personalQuestionIds = [20, 23, 29, 43, 44, 61];
    const hasPersonalInfo = !!userInfo;
    const availableQuestions = hasPersonalInfo 
      ? questionSet.length 
      : questionSet.filter(q => !personalQuestionIds.includes(q.id)).length;

    return (
      <main className="min-h-screen bg-gradient-to-br from-red-600 via-white to-blue-700 p-4 sm:p-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => {
              setShowOptions(false);
              setShowZipPrompt(true);
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
              <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
                <p className="text-sm font-bold text-yellow-900 mb-1">⚠️ Generic test mode</p>
                <p className="text-sm text-yellow-800">
                  Questions about your specific representatives will be excluded. 
                  <button
                    onClick={() => {
                      setShowOptions(false);
                      setShowZipPrompt(true);
                    }}
                    className="ml-1 underline font-semibold"
                  >
                    Add ZIP code
                  </button>
                </p>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-base font-bold text-gray-900 mb-3">
                Number of Questions
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[10, 20, 50, 100].map(num => (
                  <button
                    key={num}
                    onClick={() => setTestSize(Math.min(num, availableQuestions))}
                    disabled={num > availableQuestions}
                    className={`p-4 rounded-lg border-2 font-bold text-lg transition-all ${
                      testSize === num
                        ? 'border-blue-600 bg-blue-600 text-white shadow-lg'
                        : num > availableQuestions
                        ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 text-gray-900 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              {!hasPersonalInfo && (
                <p className="text-xs text-gray-500 mt-2">
                  {availableQuestions} questions available without ZIP code
                </p>
              )}
            </div>

            <div className="mb-8">
              <label className="block text-base font-bold text-gray-900 mb-3">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none text-gray-900 font-medium bg-white"
              >
                <option value="all">All Categories (Recommended)</option>
                {categories.filter(c => c !== 'all').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleBeginTest}
              className="w-full py-4 bg-gradient-to-r from-red-600 via-blue-600 to-blue-700 text-white rounded-lg text-lg font-bold hover:shadow-xl transition-all shadow-md"
            >
              Begin Test ({Math.min(testSize, availableQuestions)} questions)
            </button>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
              <p className="text-sm text-gray-900 font-semibold">
                📝 You need {Math.ceil(testSize * 0.6)}/{testSize} correct to pass (60%)
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Test in progress
  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 py-4 sm:py-8">
      <QuitModal
        isOpen={showQuitModal}
        onClose={() => setShowQuitModal(false)}
        onConfirm={confirmQuit}
        currentQuestion={currentIndex + 1}
        totalQuestions={testQuestions.length}
        score={score}
      />

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