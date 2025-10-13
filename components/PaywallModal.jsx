'use client';

export default function PaywallModal({ isOpen, onClose, testsTaken }) {
  if (!isOpen) return null;

  const handleUpgradeToPremium = () => {
    // TODO: Implement payment integration (Stripe, etc.)
    // For now, just unlock premium locally for testing
    localStorage.setItem('isPremium', 'true');
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border-t-4 border-amber-500">
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl">🎓</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            You&apos;ve Used Your 3 Free Tests!
          </h2>
          <p className="text-gray-600">
            Upgrade to Premium to continue your citizenship test preparation
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5 mb-6 border border-blue-200">
          <p className="text-sm font-bold text-gray-900 mb-3">✨ Premium Features:</p>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-0.5">✓</span>
              <span><strong>Unlimited Practice Tests</strong> - Test yourself as many times as you need</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-0.5">✓</span>
              <span><strong>Unlimited Study Mode</strong> - Always free, learn at your own pace</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-0.5">✓</span>
              <span><strong>Track Your Progress</strong> - Detailed statistics and history</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-0.5">✓</span>
              <span><strong>Both Test Versions</strong> - 2008 (100Q) & 2025 (128Q)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-0.5">✓</span>
              <span><strong>Personalized Questions</strong> - Your state&apos;s officials auto-filled</span>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-4 mb-6">
          <p className="text-sm font-bold text-amber-900 mb-1">💰 One-Time Payment</p>
          <p className="text-xs text-amber-800">
            Pay once, use forever. No subscriptions, no recurring charges.
          </p>
        </div>

        <div className="mb-6">
          <div className="text-center mb-4">
            <div className="inline-block">
              <div className="text-4xl font-bold text-gray-900">$14.99</div>
              <div className="text-sm text-gray-600">One-time payment</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleUpgradeToPremium}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5"
          >
            Unlock Premium Now - $14.99
          </button>

          <button
            onClick={() => {
              onClose();
              window.location.href = '/';
            }}
            className="w-full py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
          >
            Maybe Later
          </button>
        </div>

        <p className="text-xs text-center text-gray-500 mt-4">
          💡 <strong>Study Mode is always free!</strong> You can still use flashcards to learn all questions.
        </p>
      </div>
    </div>
  );
}
