'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ResultsScreen from '@/components/ResultsScreen';
import AppHeader from '@/components/AppHeader';

export default function Stats() {
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [stats, setStats] = useState({
    totalTests: 0,
    averageScore: 0,
    passed: 0,
    failed: 0,
    bestScore: 0,
    streak: 0
  });

  useEffect(() => {
    const savedResults = JSON.parse(localStorage.getItem('testResults') || '[]');
    savedResults.sort((a, b) => new Date(b.date) - new Date(a.date));
    setResults(savedResults);
    
    if (savedResults.length > 0) {
      const totalTests = savedResults.length;
      const passed = savedResults.filter(r => r.passed).length;
      const failed = totalTests - passed;
      const averageScore = Math.round(
        savedResults.reduce((sum, r) => sum + r.percentage, 0) / totalTests
      );
      const bestScore = Math.max(...savedResults.map(r => r.percentage));
      const streak = calculateStreak(savedResults);

      setStats({
        totalTests,
        averageScore,
        passed,
        failed,
        bestScore,
        streak
      });
    }
  }, []);

  const calculateStreak = (results) => {
    if (results.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < results.length; i++) {
      const testDate = new Date(results[i].date);
      testDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today - testDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
      } else if (daysDiff > streak) {
        break;
      }
    }
    
    return streak;
  };

  const clearAllResults = () => {
    if (confirm('Are you sure you want to delete all test results? This cannot be undone.')) {
      localStorage.removeItem('testResults');
      setResults([]);
      setStats({
        totalTests: 0,
        averageScore: 0,
        passed: 0,
        failed: 0,
        bestScore: 0,
        streak: 0
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    return date.toLocaleDateString('en-US', options);
  };

  // Show detailed results screen if a result is selected
  if (selectedResult) {
    return (
      <ResultsScreen
        score={selectedResult.score}
        total={selectedResult.total}
        percentage={selectedResult.percentage}
        passed={selectedResult.passed}
        answers={selectedResult.answers || []}
        testVersion={selectedResult.testVersion || '2025'}
        onRetake={() => {
          setSelectedResult(null);
          window.location.href = '/';
        }}
        onGoHome={() => {
          setSelectedResult(null);
        }}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-red-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <AppHeader title="Your Progress" showBack={true} backHref="/" />
      <main className="flex-1 overflow-y-auto px-3 py-2 min-h-0">
      <div className="max-w-4xl mx-auto">
        
        {results.length === 0 ? (
          // Empty state
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-8 sm:p-12 text-center border-t-4 border-blue-600 dark:border-blue-500">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">No tests taken yet</h2>
            <p className="text-gray-700 dark:text-slate-300 mb-6 font-medium text-sm sm:text-base">Start your first practice test to see your progress here!</p>
            <button
              onClick={() => {
                window.location.href = '/?startTest=true';
              }}
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md text-sm sm:text-base"
            >
              Take Your First Test
            </button>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 sm:p-8 mb-6 border-t-4 border-blue-600 dark:border-blue-500">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">Overview</h2>

              {/* Main stat - Average Score */}
              <div className="text-center mb-6 pb-6 border-b dark:border-slate-700">
                <div className="text-sm text-gray-700 dark:text-slate-300 font-semibold mb-1">Average Score</div>
                <div className="text-5xl sm:text-6xl font-bold text-blue-600 dark:text-blue-400">{stats.averageScore}%</div>
              </div>

              {/* Grid of stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stats.totalTests}</div>
                  <div className="text-xs sm:text-sm text-gray-700 dark:text-slate-300 font-semibold">Tests Taken</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">{stats.passed}</div>
                  <div className="text-xs sm:text-sm text-gray-700 dark:text-slate-300 font-semibold">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400">{stats.failed}</div>
                  <div className="text-xs sm:text-sm text-gray-700 dark:text-slate-300 font-semibold">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.bestScore}%</div>
                  <div className="text-xs sm:text-sm text-gray-700 dark:text-slate-300 font-semibold">Best Score</div>
                </div>
              </div>

              {/* Streak */}
              {stats.streak > 0 && (
                <div className="mt-6 pt-6 border-t dark:border-slate-700 text-center">
                  <div className="inline-flex items-center bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-4 py-2 rounded-full text-sm sm:text-base">
                    <span className="text-2xl mr-2">🔥</span>
                    <span className="font-bold">{stats.streak} day{stats.streak !== 1 ? 's' : ''} streak!</span>
                  </div>
                </div>
              )}
            </div>

            {/* Past Results List */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden border-t-4 border-red-600 dark:border-red-500">
              <div className="p-4 sm:p-6 border-b dark:border-slate-700 flex items-center justify-between bg-gray-50 dark:bg-slate-700/50">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Past Results</h2>
                <button
                  onClick={clearAllResults}
                  className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 text-xs font-bold rounded-lg transition-colors"
                >
                  Clear All
                </button>
              </div>

              <div className="divide-y dark:divide-slate-700">
                {results.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedResult(result)}
                    className="w-full p-4 sm:p-6 hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors text-left cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      {/* Left side - Score and status */}
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-1 h-16 rounded-full ${
                            result.passed ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        />

                        <div>
                          <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                            {result.percentage}%
                          </div>
                          <div className={`text-sm font-bold ${
                            result.passed ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                          }`}>
                            {result.passed ? 'Passed' : 'Failed'}
                          </div>
                        </div>
                      </div>

                      {/* Right side - Details */}
                      <div className="text-right">
                        <div className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                          {result.score} out of {result.total}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-700 dark:text-slate-300 font-medium">
                          {formatDate(result.date)}
                        </div>
                        {result.category && result.category !== 'all' && ( // text-xs is fine here
                          <div className="text-xs text-gray-600 dark:text-slate-400 mt-1 font-medium">
                            {result.category}
                          </div>
                        )}
                        <div className="mt-2 inline-block bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold px-2 py-1 rounded-md group-hover:bg-blue-200 dark:group-hover:bg-blue-900">
                          View Details
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tips based on performance */}
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-600 dark:border-blue-500 rounded-r-lg p-4 sm:p-6">
              <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-2 flex items-center text-sm sm:text-base">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Tips for Improvement
              </h3>
              <div className="text-sm sm:text-base text-blue-900 dark:text-blue-100 font-medium space-y-1">
                {stats.averageScore < 60 && (
                  <p>• Your average is below passing. Focus on studying all questions first.</p>
                )}
                {stats.averageScore >= 60 && stats.averageScore < 80 && (
                  <p>• You&apos;re close! Review the questions you got wrong and practice more.</p>
                )}
                {stats.averageScore >= 80 && stats.averageScore < 95 && (
                  <p>• Great progress! Focus on the categories where you struggle most.</p>
                )}
                {stats.averageScore >= 95 && (
                  <p>• Excellent! You&apos;re ready for the real test. Keep practicing!</p>
                )}
                <p>• Practice daily to build a streak and improve retention.</p>
                <p>• Take tests of different lengths to build stamina.</p>
              </div>
            </div>
          </>
        )}
      </div>
      </main>
    </div>
  );
}