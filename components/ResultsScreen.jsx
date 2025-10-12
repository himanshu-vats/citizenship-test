'use client';

import Link from 'next/link';
import { useState } from 'react';

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
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleShare = async () => {
    const shareText = `I scored ${score}/${total} (${percentage}%) on the US Citizenship Test ${testVersion}! ${passed ? '✓ PASSED' : 'Still practicing'}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'US Citizenship Test Results',
          text: shareText
        });
      } catch (err) {
        // User cancelled or error occurred
        console.log('Share cancelled');
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-white to-blue-700 p-4 sm:p-8 flex items-center justify-center">
      <div className="max-w-3xl w-full">
        {/* Main Results Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header with confetti background for pass */}
          <div className={`p-8 text-center ${passed ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-gray-500 to-gray-600'}`}>
            <div className="text-6xl mb-4">
              {passed ? '🎉' : '📚'}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {passed ? 'Congratulations!' : 'Keep Practicing!'}
            </h1>
            <p className="text-white text-opacity-90">
              {passed ? 'You passed the practice test!' : 'You&apos;re getting there!'}
            </p>
          </div>

          {/* Score Display */}
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="text-6xl font-bold text-gray-900 mb-2">
                {score}/{total}
              </div>
              <div className={`text-3xl font-bold mb-4 ${passed ? 'text-green-600' : 'text-orange-600'}`}>
                {percentage}%
              </div>
              <div className={`inline-block px-6 py-3 rounded-full text-lg font-bold ${
                passed
                  ? 'bg-green-100 text-green-800'
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {passed ? '✓ PASSED' : '○ NEED MORE PRACTICE'}
              </div>

              <div className="mt-4 text-sm text-gray-600">
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

              <Link
                href="/study"
                className="block w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg text-center"
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl">📚</span>
                  Study Mode
                </div>
              </Link>

              <button
                onClick={handleShare}
                className="w-full py-4 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                {shareSuccess ? 'Copied to Clipboard!' : 'Share Results'}
              </button>

              <button
                onClick={onGoHome}
                className="w-full py-4 bg-white hover:bg-gray-50 text-gray-900 rounded-xl font-bold transition-all border-2 border-gray-300 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Back to Home
              </button>
            </div>

            {/* Performance Tip */}
            {!passed && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg p-4">
                <p className="text-sm text-yellow-900">
                  <strong>💡 Tip:</strong> Try using Study Mode to review all questions with answers before taking another test.
                </p>
              </div>
            )}

            {passed && (
              <div className="bg-green-50 border-l-4 border-green-500 rounded-r-lg p-4">
                <p className="text-sm text-green-900">
                  <strong>🎯 Great job!</strong> Keep practicing to maintain your knowledge for the real interview.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Review Section (Expandable) */}
        {showReview && answers && answers.length > 0 && (
          <div className="mt-6 bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      ? 'border-green-300 bg-green-50'
                      : 'border-red-300 bg-red-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      answer.isCorrect ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {answer.isCorrect ? '✓' : '✗'}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-2">
                        Q{index + 1}: {answer.question}
                      </p>

                      {!answer.isCorrect && (
                        <div className="mb-2">
                          <p className="text-sm text-red-800">
                            <span className="font-semibold">Your answer:</span> {answer.selected}
                          </p>
                        </div>
                      )}

                      <div className="mb-2">
                        <p className="text-sm text-green-800">
                          <span className="font-semibold">Correct answer:</span> {answer.correct}
                        </p>
                      </div>

                      {answer.explanation && (
                        <div className="mt-2 pt-2 border-t border-gray-300">
                          <p className="text-xs text-gray-700 whitespace-pre-line">
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
              <div className="mt-6 pt-6 border-t border-gray-200">
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
  );
}
