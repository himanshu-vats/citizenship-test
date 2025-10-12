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
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border-t-4 border-blue-600">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
              {questionNumber}
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">
                Question {questionNumber} of {totalQuestions}
              </p>
              <p className="text-sm text-blue-600 font-bold">
                Score: {score}/{questionNumber - (hasSubmitted ? 0 : 1)}
              </p>
            </div>
          </div>
          <button
            onClick={onQuit}
            className="text-red-600 hover:text-red-800 font-bold text-sm sm:text-base px-4 py-2 rounded-lg hover:bg-red-50 transition-all"
          >
            Quit Test
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-600 to-blue-700 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-relaxed">
            {question}
          </h2>
        </div>

        {/* Answer Options */}
        <div className="space-y-3 mb-6">
          {answers.map((answer, index) => {
            const isSelected = selectedAnswer === answer;
            const isThisCorrect = hasSubmitted && answer === correctAnswer;
            const isThisWrong = hasSubmitted && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => !hasSubmitted && onAnswer(answer)}
                disabled={hasSubmitted}
                className={`w-full p-4 sm:p-5 text-left rounded-xl border-2 transition-all font-medium text-base sm:text-lg ${
                  hasSubmitted
                    ? isThisCorrect
                      ? 'bg-green-50 border-green-500 text-green-900'
                      : isThisWrong
                      ? 'bg-red-50 border-red-500 text-red-900'
                      : 'bg-gray-50 border-gray-200 text-gray-500'
                    : isSelected
                    ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-md'
                    : 'bg-white border-gray-300 text-gray-900 hover:border-blue-400 hover:bg-blue-50'
                } ${hasSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex-1">{answer}</span>
                  {hasSubmitted && isThisCorrect && (
                    <span className="ml-3 text-green-600 text-xl">✓</span>
                  )}
                  {hasSubmitted && isThisWrong && (
                    <span className="ml-3 text-red-600 text-xl">✗</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {hasSubmitted && explanation && (
          <div
            className={`mb-6 p-5 rounded-xl border-l-4 ${
              isCorrect
                ? 'bg-green-50 border-green-500'
                : 'bg-red-50 border-red-500'
            }`}
          >
            <div className="whitespace-pre-line text-sm sm:text-base text-gray-900 leading-relaxed">
              {explanation}
            </div>
            
            {/* Show all correct answers for questions with multiple answers */}
            {allCorrectAnswers && allCorrectAnswers.length > 1 && !isCorrect && (
              <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                <p className="font-bold text-gray-900 mb-2 text-sm">
                  📋 All {allCorrectAnswers.length} acceptable answers:
                </p>
                <ul className="space-y-1">
                  {allCorrectAnswers.map((ans, idx) => (
                    <li key={idx} className="text-sm text-gray-700">
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
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
            !hasSubmitted && !selectedAnswer
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-red-600 via-blue-600 to-blue-700 text-white hover:shadow-xl shadow-md'
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
          <p className="text-center text-sm text-gray-500 mt-4">
            Select an answer and click Submit
          </p>
        )}
      </div>
    </div>
  );
}