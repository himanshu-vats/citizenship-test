import wrongAnswers2008 from '@/data/wrongAnswers-2008.json';
import wrongAnswers2025 from '@/data/wrongAnswers-2025.json';

export function prepareQuestionForTest(question, testVersion = '2025', userInfo = null) {
  const correctAnswers = question.answers;
  
  // If this is a personalized question and we have user info, inject the correct answer
  let personalizedCorrectAnswers = [...correctAnswers];
  
  if (userInfo) {
    // Question 20/23: Who is one of your state's U.S. Senators now?
    if (question.id === 20 || question.id === 23) {
      if (Array.isArray(userInfo.senators) && userInfo.senators.length > 0) {
        personalizedCorrectAnswers = userInfo.senators;
      }
    }
    
    // Question 29: Name your U.S. Representative
    if (question.id === 29 || question.id === 23) {
      if (userInfo.representative && !userInfo.representative.includes('Visit')) {
        personalizedCorrectAnswers = [userInfo.representative];
      }
    }
    
    // Question 43/61: Who is the Governor of your state now?
    if (question.id === 43 || question.id === 61) {
      if (userInfo.governor) {
        personalizedCorrectAnswers = [userInfo.governor];
      }
    }
    
    // Question 44/62: What is the capital of your state?
    if (question.id === 44 || question.id === 62) {
      if (userInfo.capital) {
        personalizedCorrectAnswers = [userInfo.capital];
      }
    }
  }
  
  // Select the right wrong answers based on test version
  const wrongAnswersData = testVersion === '2008' ? wrongAnswers2008 : wrongAnswers2025;
  const wrongAnswers = wrongAnswersData[question.id.toString()] || [];
  
  // Use pre-made wrong answers if available
  const finalWrongAnswers = wrongAnswers.length >= 3 
    ? wrongAnswers.slice(0, 3)
    : generateFallbackWrongAnswers(question, personalizedCorrectAnswers);
  
  // Select one correct answer randomly
  const selectedCorrect = personalizedCorrectAnswers[
    Math.floor(Math.random() * personalizedCorrectAnswers.length)
  ];
  
  // Combine and shuffle all options
  const allOptions = [selectedCorrect, ...finalWrongAnswers].sort(() => 0.5 - Math.random());
  
  return {
    ...question,
    displayOptions: allOptions,
    correctAnswer: selectedCorrect,
    allCorrectAnswers: personalizedCorrectAnswers,
    wrongAnswers: finalWrongAnswers,
    getExplanation: (userAnswer) => generateExplanation(
      question, 
      selectedCorrect, 
      userAnswer, 
      personalizedCorrectAnswers
    )
  };
}

function generateFallbackWrongAnswers(question, correctAnswers) {
  const allWrongOptions = [
    "Not listed in official answers",
    "Incorrect option",
    "Wrong answer",
    "Not the correct answer"
  ];
  
  return allWrongOptions
    .filter(opt => !correctAnswers.includes(opt))
    .slice(0, 3);
}

function generateExplanation(question, correctAnswer, userAnswer, allCorrectAnswers) {
  const isCorrect = userAnswer === correctAnswer;
  
  if (isCorrect) {
    if (allCorrectAnswers.length > 1) {
      const otherAnswers = allCorrectAnswers.filter(ans => ans !== correctAnswer);
      if (otherAnswers.length > 0) {
        return `✓ Correct! "${correctAnswer}" is right.\n\n💡 Note: This question also accepts these answers: ${otherAnswers.join(', ')}`;
      }
    }
    return `✓ Correct! "${correctAnswer}" is the right answer.`;
  } else {
    if (allCorrectAnswers.length > 1) {
      const answerList = allCorrectAnswers.map(ans => `"${ans}"`).join(', ');
      return `✗ Not quite. The correct answer shown was "${correctAnswer}".\n\n📚 ALL ACCEPTABLE ANSWERS for this question:\n${answerList}\n\n💡 Tip: During your interview, you only need to provide ONE of these answers. Memorize the one that's easiest for you to remember!`;
    } else {
      return `✗ Not quite. The correct answer is: "${correctAnswer}"`;
    }
  }
}

export function getRandomQuestions(questions, count) {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getQuestionsByCategory(questions, category) {
  if (category === 'all') return questions;
  return questions.filter(q => q.category === category);
}