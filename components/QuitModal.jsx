export default function QuitModal({ isOpen, onClose, onConfirm, currentQuestion, totalQuestions, score }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 transform transition-all">
          {/* Warning Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Quit Test?
          </h2>

          {/* Message */}
          <p className="text-gray-600 text-center mb-6">
            Are you sure you want to quit? Your progress will not be saved.
          </p>

          {/* Current Progress */}
          <div className="bg-blue-50 border-l-4 border-blue-600 rounded-r-lg p-4 mb-6">
            <div className="text-sm text-gray-700 space-y-1">
              <p className="font-semibold">Current Progress:</p>
              <p>• Question {currentQuestion} of {totalQuestions}</p>
              <p>• Score: {score}/{currentQuestion - 1}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
            >
              Continue Test
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
            >
              Quit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}