'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Question from '@/components/Question';
import ResultsScreen from '@/components/ResultsScreen';
import InlineZipPrompt from '@/components/InlineZipPrompt';
import TopNav from '@/components/TopNav';
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
  const [showInlineZipPrompt, setShowInlineZipPrompt] = useState(false);
  const [zipPromptDismissed, setZipPromptDismissed] = useState(false);
  const [testCount, setTestCount] = useState(0);

  // Get the appropriate question set based on test version
  const questionSet = testVersion === '2008' ? questions2008 : questions2025;

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

    // Load saved test version
    const savedVersion = localStorage.getItem('testVersion') || '2025';
    setTestVersion(savedVersion);

    // Count completed tests for stats display
    const results = JSON.parse(localStorage.getItem('testResults') || '[]');
    setTestCount(results.length);

    // Listen for storage changes (when user toggles version in menu)
    const handleStorageChange = (e) => {
      if (e.key === 'testVersion') {
        setTestVersion(e.newValue || '2025');
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Also check periodically in case MenuDrawer updates on same tab
    const interval = setInterval(() => {
      const currentVersion = localStorage.getItem('testVersion') || '2025';
      setTestVersion(currentVersion);
    }, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Add/remove body class when test is active to help BottomNav highlight correctly
  useEffect(() => {
    if (testStarted) {
      document.body.classList.add('test-mode-active');
    } else {
      document.body.classList.remove('test-mode-active');
    }

    return () => {
      document.body.classList.remove('test-mode-active');
    };
  }, [testStarted]);

  // Check for startTest query parameter and automatically start test
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('startTest') === 'true' && !testStarted) {
      // Automatically start test with the current test version
      const version = testVersion;
      const smartTestSize = version === '2025' ? 20 : 10;
      const questionSet = version === '2008' ? questions2008 : questions2025;
      const shuffled = [...questionSet].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, smartTestSize);

      setTestQuestions(selected.map(q => prepareQuestionForTest(q, version, userInfo)));
      setTestStarted(true);
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setHasSubmitted(false);
      setIsCorrect(null);
      setExplanation('');
      setAnswers([]);
      setScore(0);
      setZipPromptDismissed(false);
    }
  }, []); // Empty dependency array - only run once on mount

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

  const handleVersionSelect = (version) => {
    setTestVersion(version);
    localStorage.setItem('testVersion', version);

    // Set smart defaults based on version
    const smartTestSize = version === '2025' ? 20 : 10;
    setTestSize(smartTestSize);
    setSelectedCategory('all'); // Always use all categories for realistic practice

    // Start test immediately with smart defaults
    const questionSet = version === '2008' ? questions2008 : questions2025;
    const shuffled = [...questionSet].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, smartTestSize);

    setTestQuestions(selected.map(q => prepareQuestionForTest(q, version, userInfo)));
    setTestStarted(true);
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
      const correct = currentQuestion.allCorrectAnswers.includes(selectedAnswer);
      let exp = '';
      if (correct) {
        exp = `✓ Correct!`;
      } else {
        exp = `✗ The correct answer is: "${currentQuestion.correctAnswer}"`;
      }
      // The original detailed explanation is now disabled to prevent scrolling.
      // const exp = currentQuestion.getExplanation(selectedAnswer);
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

  const endTest = () => {
    // Even if the last question wasn't submitted, we end the test.
    // The score is what it is up to the last completed question.
    const finalScore = score;
    const questionsAttempted = answers.filter(Boolean).length;

    // The passing criteria is based on the full test length, which is more realistic.
    const passingScore = testVersion === '2025' ? 12 : 6;
    const passed = finalScore >= passingScore;

    const results = {
      date: new Date().toISOString(),
      score: finalScore,
      total: questionsAttempted, // Show total attempted questions
      percentage: questionsAttempted > 0 ? Math.round((finalScore / questionsAttempted) * 100) : 0,
      passed: passed,
      category: selectedCategory,
      testVersion: testVersion,
      answers: answers.filter(Boolean) // Only save answered questions
    };

    saveTestResult(results);
    setTestResults(results);
    setTestStarted(false);
    setShowResults(true);
  };

  const handleEndTest = () => {
    // This function is now called by the "End Test" button.
    // It directly proceeds to end the test and show results.
    endTest();
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
          // Retake the test with same version
          handleVersionSelect(testResults.testVersion);
          setShowResults(false);
          setTestResults(null);
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
        <TopNav onTestClick={() => handleVersionSelect(testVersion)} />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">

          <main className="px-4 py-8">
            <div className="max-w-5xl mx-auto">

              {/* Hero Section */}
              <div className="text-center mb-12">
                <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 dark:from-blue-400 dark:via-purple-400 dark:to-red-400 bg-clip-text text-transparent mb-4">
                  U.S. Citizenship Test Prep 2025
                </h1>
                <p className="text-base sm:text-lg text-gray-600 dark:text-slate-400">
                  Master the {testVersion === '2025' ? '128' : '100'} civics questions for your U.S. citizenship journey
                </p>
              </div>

              {/* Test Version Selector */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex gap-3 bg-white dark:bg-slate-800 rounded-lg p-1.5 shadow-md border border-gray-200 dark:border-slate-700">
                  <button
                    onClick={() => {
                      const newVersion = '2008';
                      setTestVersion(newVersion);
                      localStorage.setItem('testVersion', newVersion);
                    }}
                    className={`px-5 py-2 rounded-md font-medium transition-all ${
                      testVersion === '2008'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    2008 Test
                  </button>
                  <button
                    onClick={() => {
                      const newVersion = '2025';
                      setTestVersion(newVersion);
                      localStorage.setItem('testVersion', newVersion);
                    }}
                    className={`px-5 py-2 rounded-md font-medium transition-all ${
                      testVersion === '2025'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    2025 Test
                  </button>
                </div>
              </div>

              {/* Three Main Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">

                {/* Study Card */}
                <Link
                  href="/study"
                  className="group bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all p-8 text-center border border-gray-200 dark:border-slate-700 hover:scale-105"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                    <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Study
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    Review all questions with interactive flashcards
                  </p>
                </Link>

                {/* Test Card */}
                <button
                  onClick={() => handleVersionSelect(testVersion)}
                  className="group bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all p-8 text-center border border-gray-200 dark:border-slate-700 hover:scale-105"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                    <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Test
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    Take practice tests to assess your knowledge
                  </p>
                </button>

                {/* Latest Updates Card */}
                <Link
                  href="/blog"
                  className="group bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all p-8 text-center border border-gray-200 dark:border-slate-700 hover:scale-105"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                    <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Latest Updates
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    News, tips, and guides for citizenship applicants
                  </p>
                </Link>

              </div>

              {/* Quick Stats Summary */}
              {testCount > 0 && (
                <div className="mt-8 max-w-md mx-auto text-center p-4 bg-white dark:bg-slate-800 rounded-lg shadow border border-gray-200 dark:border-slate-700">
                  <span className="text-sm text-gray-600 dark:text-slate-400">
                    🎯 <strong>{testCount}</strong> test{testCount !== 1 ? 's' : ''} completed
                  </span>
                </div>
              )}

            </div>
          </main>
        </div>
      </>
    );
  }


  // Test in progress
  return (
    <>
      <TopNav
        activeSection="test"
        onHomeClick={() => {
          // Reset test state and go back to home
          setTestStarted(false);
          setShowResults(false);
          setTestResults(null);
          setCurrentIndex(0);
          setSelectedAnswer(null);
          setHasSubmitted(false);
          setIsCorrect(null);
          setExplanation('');
          setAnswers([]);
          setScore(0);
          setTestQuestions([]);
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">

        {showInlineZipPrompt && (
          <InlineZipPrompt
            onSave={handleInlineZipSave}
            onSkip={handleInlineZipSkip}
            currentQuestion={testQuestions[currentIndex]}
          />
        )}

        <main className="px-3 py-6 max-w-4xl mx-auto">
      {currentIndex > 0 && (
        <div className="max-w-4xl mx-auto mb-2">
          <button
            onClick={handleBack}
            className="flex items-center text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 font-bold text-xs sm:text-sm bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg shadow-md"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        onQuit={handleEndTest}
        questionNumber={currentIndex + 1}
        totalQuestions={testQuestions.length}
        selectedAnswer={selectedAnswer}
        isCorrect={isCorrect}
        hasSubmitted={hasSubmitted}
        score={score}
      />
      </main>
    </div>
    </>
  );
}