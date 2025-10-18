'use client';

import Link from 'next/link';
import { useState } from 'react';
import AppHeader from './AppHeader';

export default function ResultsScreen({
  score,
  total,
  percentage,
  passed,
  answers,
  testVersion,
  onRetake,
  onGoHome
}) {
  const [showReview, setShowReview] = useState(false);

  return (
    <>
      <AppHeader title="Test Results" showBack={true} backHref="/" />
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-white to-blue-700 dark:from-red-900 dark:via-slate-900 dark:to-blue-900 p-4 sm:p-8">
      <div className="max-w-3xl w-full mx-auto">
        {/* Main Results Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border dark:border-slate-700">
          {/* Header with confetti background for pass */}
          <div className={`p-8 text-center ${passed ? 'bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700' : 'bg-gradient-to-r from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700'}`}>
            <div className="text-6xl mb-4">
              {passed ? '🎉' : '📚'}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {passed ? 'Congratulations!' : 'Keep Practicing!'}
            </h1>
            <p className="text-white text-opacity-90">
              {passed ? 'You passed the practice test!' : 'You are getting there!'}
            </p>
          </div>

          {/* Score Display */}
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="text-6xl font-bold text-gray-900 dark:text-white mb-2">
                {score}/{total}
              </div>
              <div className={`text-3xl font-bold mb-4 ${passed ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                {percentage}%
              </div>
              <div className={`inline-block px-6 py-3 rounded-full text-lg font-bold ${
                passed
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                  : 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300'
              }`}>
                {passed ? '✓ PASSED' : '○ NEED MORE PRACTICE'}
              </div>

              <div className="mt-4 text-sm text-gray-600 dark:text-slate-400">
                Test Version: <span className="font-semibold">{testVersion === '2025' ? '2025 (need 12/20)' : '2008 (need 6/10)'}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => setShowReview(!showReview)}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {showReview ? 'Hide' : 'Review'} All Answers
              </button>

              <button
                onClick={onRetake}
                className="w-full py-4 bg-gradient-to-r from-red-600 via-blue-600 to-blue-700 hover:shadow-xl text-white rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Take Another Test
              </button>
            </div>

            {/* Performance Tip */}
            {!passed && (
              <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 dark:border-yellow-600 rounded-r-lg p-4">
                <p className="text-sm text-yellow-900 dark:text-yellow-200">
                  <strong>💡 Tip:</strong> Try using Study Mode to review all questions with answers before taking another test.
                </p>
              </div>
            )}

            {passed && (
              <div className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 dark:border-green-600 rounded-r-lg p-4">
                <p className="text-sm text-green-900 dark:text-green-200">
                  <strong>🎯 Great job!</strong> Keep practicing to maintain your knowledge for the real interview.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Review Section (Expandable) */}
        {showReview && answers && answers.length > 0 && (
          <div className="mt-6 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 border dark:border-slate-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Detailed Review
            </h2>

            <div className="space-y-4">
              {answers.map((answer, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border-2 ${
                    answer.isCorrect
                      ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
                      : 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      answer.isCorrect ? 'bg-green-500 dark:bg-green-600' : 'bg-red-500 dark:bg-red-600'
                    }`}>
                      {answer.isCorrect ? '✓' : '✗'}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white mb-2">
                        Q{index + 1}: {answer.question}
                      </p>

                      {!answer.isCorrect && (
                        <div className="mb-2">
                          <p className="text-sm text-red-800 dark:text-red-300">
                            <span className="font-semibold">Your answer:</span> {answer.selected}
                          </p>
                        </div>
                      )}

                      <div className="mb-2">
                        <p className="text-sm text-green-800 dark:text-green-300">
                          <span className="font-semibold">Correct answer:</span> {answer.correct}
                        </p>
                      </div>

                      {answer.explanation && (
                        <div className="mt-2 pt-2 border-t border-gray-300 dark:border-slate-600">
                          <p className="text-xs text-gray-700 dark:text-slate-300 whitespace-pre-line">
                            {answer.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Study Weak Areas Button */}
            {answers.filter(a => !a.isCorrect).length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
                <Link
                  href="/study"
                  className="block w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg text-center"
                >
                  📖 Study Questions You Missed ({answers.filter(a => !a.isCorrect).length} questions)
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
