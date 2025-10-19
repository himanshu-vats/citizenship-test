'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Question from '@/components/Question';
import ResultsScreen from '@/components/ResultsScreen';
import InlineZipPrompt from '@/components/InlineZipPrompt';
import MenuDrawer from '@/components/MenuDrawer';
import { prepareQuestionForTest } from '@/lib/answerGenerator';
import questions2008 from '@/data/questions-2008.json';
import questions2025 from '@/data/questions-2025.json';

export default function Home() {
  const [testStarted, setTestStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
        <MenuDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

        <div className="min-h-screen bg-white dark:bg-slate-900">
          <main className="px-4 py-6">
            <div className="max-w-lg mx-auto">

              {/* Hamburger Menu - Floating Top Right */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setMenuOpen(true)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                  aria-label="Menu"
                >
                  <svg className="w-5 h-5 text-gray-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

            {/* Hero Section */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-5xl sm:text-6xl">🗽</span>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                  US Citizenship Test
                </h1>
              </div>
              <p className="text-gray-600 dark:text-slate-400 text-base ml-1">
                Official USCIS practice questions
              </p>
            </div>

            {/* Study Mode - Prominent CTA */}
            <Link
              href="/study"
              className="block w-full py-3 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 text-purple-900 dark:text-purple-100 rounded-xl text-base font-semibold transition-all border-2 border-purple-300 dark:border-purple-700 mb-6 text-center"
            >
              <span className="mr-2">📚</span>
              Study with Flashcards First
            </Link>

            {/* Main Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 mb-4">

              {/* Current Test Version Info */}
              <div className="mb-6 text-center">
                <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">
                  Current test version
                </p>
                <div className="inline-block px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                  <span className="text-lg font-bold text-blue-900 dark:text-blue-100">
                    {testVersion === '2025' ? '2025 Test' : '2008 Test'}
                  </span>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    {testVersion === '2025'
                      ? '20 questions • 12 to pass'
                      : '10 questions • 6 to pass'
                    }
                  </p>
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-500 mt-2">
                  Change version in menu (☰)
                </p>
              </div>

              {/* Primary CTA */}
              <button
                onClick={() => handleVersionSelect(testVersion)}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg font-bold transition-all shadow-md hover:shadow-lg"
              >
                Start Practice Test
              </button>
            </div>

            {/* Quick Stats */}
            {testCount > 0 && (
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 dark:text-green-400">🎯</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {testCount} test{testCount !== 1 ? 's' : ''} completed
                  </span>
                </div>
                <Link
                  href="/stats"
                  className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Stats
                </Link>
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
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-red-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">

      {showInlineZipPrompt && (
        <InlineZipPrompt
          onSave={handleInlineZipSave}
          onSkip={handleInlineZipSkip}
          currentQuestion={testQuestions[currentIndex]}
        />
      )}

      <main className="flex-1 overflow-y-auto px-3 py-2 min-h-0">
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
  );
}