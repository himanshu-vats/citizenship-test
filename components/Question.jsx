export default function Question({
  question,
  answers,
  correctAnswer,
  allCorrectAnswers,
  explanation,
  onAnswer,
  onNext,
  onQuit,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  isCorrect,
  hasSubmitted,
  score
}) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-3 sm:p-4 border-t-4 border-blue-600 dark:border-blue-500">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-gray-100 dark:border-slate-700">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 dark:bg-blue-700 text-white rounded-full w-9 h-9 flex items-center justify-center font-bold text-sm">
              {questionNumber}
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-slate-300 font-medium">
                Question {questionNumber} of {totalQuestions}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-bold">
                Score: {score}/{questionNumber - (hasSubmitted ? 0 : 1)}
              </p>
            </div>
          </div>
          <button
            onClick={onQuit}
            className="bg-red-600 dark:bg-red-700 text-white hover:bg-red-700 dark:hover:bg-red-600 font-bold text-xs px-3 py-1.5 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            End Test
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-3">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-relaxed">
            {question}
          </h2>
        </div>

        {/* Answer Options */}
        <div className="space-y-2 mb-3">
          {answers.map((answer, index) => {
            const isSelected = selectedAnswer === answer;
            const isThisCorrect = hasSubmitted && answer === correctAnswer;
            const isThisWrong = hasSubmitted && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => !hasSubmitted && onAnswer(answer)}
                disabled={hasSubmitted}
                className={`w-full p-2.5 sm:p-3 text-left rounded-lg border-2 transition-all font-medium text-sm ${
                  hasSubmitted
                    ? isThisCorrect
                      ? 'bg-green-50 dark:bg-green-900/30 border-green-500 dark:border-green-600 text-green-900 dark:text-green-200'
                      : isThisWrong
                      ? 'bg-red-50 dark:bg-red-900/30 border-red-500 dark:border-red-600 text-red-900 dark:text-red-200'
                      : 'bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-500 dark:text-slate-400'
                    : isSelected
                    ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-600 dark:border-blue-500 text-blue-900 dark:text-blue-200 shadow-md'
                    : 'bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-600'
                } ${hasSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex-1">{answer}</span>
                  {hasSubmitted && isThisCorrect && (
                    <span className="ml-2 text-green-600 dark:text-green-400 text-lg">✓</span>
                  )}
                  {hasSubmitted && isThisWrong && (
                    <span className="ml-2 text-red-600 dark:text-red-400 text-lg">✗</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {hasSubmitted && explanation && (
          <div
            className={`mb-3 p-2.5 rounded-lg border-l-4 ${
              isCorrect
                ? 'bg-green-50 dark:bg-green-900/30 border-green-500 dark:border-green-600'
                : 'bg-red-50 dark:bg-red-900/30 border-red-500 dark:border-red-600'
            }`}
          >
            <div className="whitespace-pre-line text-xs sm:text-sm text-gray-900 dark:text-white leading-relaxed">
              {explanation}
            </div>

            {/* Show all correct answers for questions with multiple answers */}
            {allCorrectAnswers && allCorrectAnswers.length > 1 && !isCorrect && (
              <div className="mt-2 p-2 bg-white dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
                <p className="font-bold text-gray-900 dark:text-white mb-1 text-xs">
                  📋 All {allCorrectAnswers.length} acceptable answers:
                </p>
                <ul className="space-y-0.5">
                  {allCorrectAnswers.map((ans, idx) => (
                    <li key={idx} className="text-xs text-gray-700 dark:text-slate-300">
                      • {ans}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={onNext}
          disabled={!hasSubmitted && !selectedAnswer}
          className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all ${
            !hasSubmitted && !selectedAnswer
              ? 'bg-gray-300 dark:bg-slate-700 text-gray-500 dark:text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-red-600 via-blue-600 to-blue-700 dark:from-red-700 dark:via-blue-700 dark:to-blue-800 text-white hover:shadow-xl shadow-md'
          }`}
        >
          {!hasSubmitted
            ? 'Submit Answer'
            : questionNumber < totalQuestions
            ? 'Next Question'
            : 'Finish Test'}
        </button>

        {/* Help Text */}
        {!hasSubmitted && (
          <p className="text-center text-xs text-gray-500 dark:text-slate-400 mt-2">
            Select an answer and click Submit
          </p>
        )}
      </div>
    </div>
  );
}