'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Stats() {
  const [results, setResults] = useState([]);
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-blue-600 to-blue-700 text-white py-6 px-4 sm:px-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/"
            className="inline-flex items-center text-white hover:text-blue-100 mb-4 font-semibold"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold">Your Progress</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {results.length === 0 ? (
          // Empty state
          <div className="bg-white rounded-xl shadow-xl p-8 sm:p-12 text-center border-t-4 border-blue-600">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No tests taken yet</h2>
            <p className="text-gray-700 mb-6 font-medium">Start your first practice test to see your progress here!</p>
            <Link 
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md"
            >
              Take Your First Test
            </Link>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 mb-6 border-t-4 border-blue-600">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Overview</h2>
              
              {/* Main stat - Average Score */}
              <div className="text-center mb-6 pb-6 border-b">
                <div className="text-sm text-gray-700 font-semibold mb-1">Average Score</div>
                <div className="text-5xl sm:text-6xl font-bold text-blue-600">{stats.averageScore}%</div>
              </div>

              {/* Grid of stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalTests}</div>
                  <div className="text-xs sm:text-sm text-gray-700 font-semibold">Tests Taken</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600">{stats.passed}</div>
                  <div className="text-xs sm:text-sm text-gray-700 font-semibold">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-red-600">{stats.failed}</div>
                  <div className="text-xs sm:text-sm text-gray-700 font-semibold">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-purple-600">{stats.bestScore}%</div>
                  <div className="text-xs sm:text-sm text-gray-700 font-semibold">Best Score</div>
                </div>
              </div>

              {/* Streak */}
              {stats.streak > 0 && (
                <div className="mt-6 pt-6 border-t text-center">
                  <div className="inline-flex items-center bg-orange-100 text-orange-800 px-4 py-2 rounded-full">
                    <span className="text-2xl mr-2">🔥</span>
                    <span className="font-bold">{stats.streak} day{stats.streak !== 1 ? 's' : ''} streak!</span>
                  </div>
                </div>
              )}
            </div>

            {/* Past Results List */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border-t-4 border-red-600">
              <div className="p-4 sm:p-6 border-b flex items-center justify-between bg-gray-50">
                <h2 className="text-xl font-bold text-gray-900">Past Results</h2>
                <button
                  onClick={clearAllResults}
                  className="text-sm text-red-700 hover:text-red-900 font-bold"
                >
                  Clear All
                </button>
              </div>

              <div className="divide-y">
                {results.map((result, index) => (
                  <div 
                    key={index}
                    className="p-4 sm:p-6 hover:bg-gray-50 transition-colors"
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
                          <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                            {result.percentage}%
                          </div>
                          <div className={`text-sm font-bold ${
                            result.passed ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {result.passed ? 'Passed' : 'Failed'}
                          </div>
                        </div>
                      </div>

                      {/* Right side - Details */}
                      <div className="text-right">
                        <div className="font-bold text-gray-900">
                          {result.score} out of {result.total}
                        </div>
                        <div className="text-sm text-gray-700 font-medium">
                          {formatDate(result.date)}
                        </div>
                        {result.category && result.category !== 'all' && (
                          <div className="text-xs text-gray-600 mt-1 font-medium">
                            {result.category}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips based on performance */}
            <div className="mt-6 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg p-4 sm:p-6">
              <h3 className="font-bold text-blue-900 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Tips for Improvement
              </h3>
              <div className="text-sm text-blue-900 font-medium space-y-1">
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
  );
}