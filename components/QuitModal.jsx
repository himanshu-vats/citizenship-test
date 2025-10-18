export default function QuitModal({ isOpen, onClose, onConfirm, currentQuestion, totalQuestions, score }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/80 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal - Modern Card Design */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all border border-gray-100 dark:border-slate-700">

          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-600 dark:to-red-600 p-6 text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">
              End Test Early?
            </h2>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            <p className="text-gray-700 dark:text-slate-300 text-center mb-6 text-lg">
              Your progress won&apos;t be saved if you quit now.
            </p>

            {/* Current Progress - Cleaner Design */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl p-5 mb-6 border border-blue-100 dark:border-blue-800">
              <p className="text-sm font-bold text-gray-900 dark:text-white mb-3 text-center">Your Progress</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{currentQuestion}/{totalQuestions}</div>
                  <div className="text-xs text-gray-600 dark:text-slate-400 font-medium mt-1">Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{score}/{currentQuestion - 1}</div>
                  <div className="text-xs text-gray-600 dark:text-slate-400 font-medium mt-1">Correct</div>
                </div>
              </div>
            </div>

            {/* Buttons - Stacked for better mobile UX */}
            <div className="space-y-3">
              <button
                onClick={onClose}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl active:scale-98"
              >
                Continue Test
              </button>
              <button
                onClick={onConfirm}
                className="w-full px-6 py-4 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 rounded-xl font-bold transition-all active:scale-98"
              >
                End Test
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}