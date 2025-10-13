import wrongAnswers2008 from '@/data/wrongAnswers-2008.json';
import wrongAnswers2025 from '@/data/wrongAnswers-2025.json';

export function prepareQuestionForTest(question, testVersion = '2025', userInfo = null) {
  const correctAnswers = question.answers;

  // If this is a personalized question and we have user info, inject the correct answer
  let personalizedCorrectAnswers = [...correctAnswers];
  let isPersonalizedQuestion = false;

  if (userInfo) {
    // Question 20/23: Who is one of your state's U.S. Senators now?
    if (question.id === 20 || question.id === 23) {
      if (Array.isArray(userInfo.senators) && userInfo.senators.length > 0) {
        personalizedCorrectAnswers = userInfo.senators;
        isPersonalizedQuestion = true;
      }
    }

    // Question 29: Name your U.S. Representative
    if (question.id === 29 || question.id === 23) {
      if (userInfo.representative && !userInfo.representative.includes('Visit')) {
        personalizedCorrectAnswers = [userInfo.representative];
        isPersonalizedQuestion = true;
      }
    }

    // Question 43/61: Who is the Governor of your state now?
    if (question.id === 43 || question.id === 61) {
      if (userInfo.governor) {
        personalizedCorrectAnswers = [userInfo.governor];
        isPersonalizedQuestion = true;
      }
    }

    // Question 44/62: What is the capital of your state?
    if (question.id === 44 || question.id === 62) {
      if (userInfo.capital) {
        personalizedCorrectAnswers = [userInfo.capital];
        isPersonalizedQuestion = true;
      }
    }
  }

  // Detect if this is a multi-item question
  const multiItemCount = detectMultiItemQuestion(question.question);

  // Select the right wrong answers based on test version
  const wrongAnswersData = testVersion === '2008' ? wrongAnswers2008 : wrongAnswers2025;
  const wrongAnswers = wrongAnswersData[question.id.toString()] || [];

  let selectedCorrect;
  let finalWrongAnswers;

  if (multiItemCount > 1) {
    // For multi-item questions: combine items into single choices
    selectedCorrect = createMultiItemAnswer(personalizedCorrectAnswers, multiItemCount);
    finalWrongAnswers = createMultiItemWrongAnswers(
      personalizedCorrectAnswers,
      wrongAnswers,
      multiItemCount,
      question
    );
  } else {
    // For single-item questions: use original logic
    selectedCorrect = personalizedCorrectAnswers[
      Math.floor(Math.random() * personalizedCorrectAnswers.length)
    ];

    // For fallback, use original answers if this is NOT a personalized question
    const answersForFallback = isPersonalizedQuestion ? personalizedCorrectAnswers : correctAnswers;
    finalWrongAnswers = wrongAnswers.length >= 3
      ? wrongAnswers.slice(0, 3)
      : generateFallbackWrongAnswers(question, answersForFallback);
  }

  // Combine and shuffle all options
  const allOptions = [selectedCorrect, ...finalWrongAnswers].sort(() => 0.5 - Math.random());

  // For multi-item questions, allCorrectAnswers should be just the combined answer
  // For single-item questions, keep the original array for showing alternatives
  const finalAllCorrectAnswers = multiItemCount > 1
    ? [selectedCorrect]  // Just the combined answer for multi-item
    : personalizedCorrectAnswers;  // All acceptable individual answers for single-item

  return {
    ...question,
    displayOptions: allOptions,
    correctAnswer: selectedCorrect,
    allCorrectAnswers: finalAllCorrectAnswers,
    wrongAnswers: finalWrongAnswers,
    getExplanation: (userAnswer) => generateExplanation(
      question,
      selectedCorrect,
      userAnswer,
      personalizedCorrectAnswers,  // Keep original for explanation purposes
      multiItemCount
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

function detectMultiItemQuestion(questionText) {
  // Detect if question asks for multiple items
  const lowerQuestion = questionText.toLowerCase();

  // Check for "Name two", "Name three", "Name five", etc.
  const nameMatch = lowerQuestion.match(/name\s+(two|three|four|five|2|3|4|5)/);
  if (nameMatch) {
    const numMap = { two: 2, three: 3, four: 4, five: 5, '2': 2, '3': 3, '4': 4, '5': 5 };
    return numMap[nameMatch[1]] || 1;
  }

  // Check for "What are two", "What are three", etc.
  const whatMatch = lowerQuestion.match(/what\s+(?:are|were)\s+(two|three|four|five|2|3|4|5)/);
  if (whatMatch) {
    const numMap = { two: 2, three: 3, four: 4, five: 5, '2': 2, '3': 3, '4': 4, '5': 5 };
    return numMap[whatMatch[1]] || 1;
  }

  return 1; // Default to single-item question
}

function formatAnswer(text) {
  const trimmed = text.trim();

  // If it starts with a parenthesis, keep as is
  if (trimmed.startsWith('(')) {
    return trimmed;
  }

  // Always capitalize the first letter
  let result = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);

  // Capitalize important words after "the" (e.g., "the President" → "The President")
  result = result.replace(/\bthe ([a-z])/g, (match, letter) => 'the ' + letter.toUpperCase());

  // Capitalize state/country names and proper nouns
  result = result.replace(/\bunited states\b/gi, 'United States');
  result = result.replace(/\bu\.?s\.?\b/gi, 'U.S.');
  result = result.replace(/\bpresident\b/g, 'President');
  result = result.replace(/\bcongress\b/g, 'Congress');
  result = result.replace(/\bsenate\b/g, 'Senate');
  result = result.replace(/\bhouse of representatives\b/gi, 'House of Representatives');
  result = result.replace(/\bsupreme court\b/gi, 'Supreme Court');
  result = result.replace(/\bconstitution\b/g, 'Constitution');
  result = result.replace(/\bbill of rights\b/gi, 'Bill of Rights');

  return result;
}

function createMultiItemAnswer(correctAnswers, count) {
  // Shuffle and take 'count' items from correct answers
  const shuffled = [...correctAnswers].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);

  // Format each item with proper capitalization
  const formatted = selected.map(item => formatAnswer(item));

  return formatted.join(', ');
}

function createMultiItemWrongAnswers(correctAnswers, wrongAnswers, count) {
  const wrongChoices = new Set(); // Use Set to prevent duplicates

  // Strategy 1: Mix correct and wrong items
  if (wrongAnswers.length > 0) {
    // Create a choice with some correct and some wrong
    let attempts = 0;
    while (wrongChoices.size < 3 && attempts < 10) {
      attempts++;
      const numCorrect = Math.floor(Math.random() * count); // 0 to count-1 correct items
      const numWrong = count - numCorrect;

      const shuffledCorrect = [...correctAnswers].sort(() => 0.5 - Math.random());
      const shuffledWrong = [...wrongAnswers].sort(() => 0.5 - Math.random());

      const items = [];
      const usedItems = new Set(); // Track used items to avoid duplicates within a choice

      // Add correct items
      for (let j = 0; j < numCorrect && j < shuffledCorrect.length; j++) {
        const formatted = formatAnswer(shuffledCorrect[j]);
        if (!usedItems.has(formatted)) {
          items.push(formatted);
          usedItems.add(formatted);
        }
      }

      // Add wrong items
      for (let j = 0; j < numWrong && j < shuffledWrong.length; j++) {
        const formatted = formatAnswer(shuffledWrong[j]);
        if (!usedItems.has(formatted)) {
          items.push(formatted);
          usedItems.add(formatted);
        }
      }

      // Only add if we have the right number of items
      if (items.length === count) {
        const shuffledItems = items.sort(() => 0.5 - Math.random());
        wrongChoices.add(shuffledItems.join(', '));
      }
    }
  }

  // If we don't have enough wrong answers, create fallback ones from correct answers
  // but arranged differently
  let attempts = 0;
  while (wrongChoices.size < 3 && attempts < 20) {
    attempts++;
    const shuffledCorrect = [...correctAnswers].sort(() => 0.5 - Math.random());
    const selected = shuffledCorrect.slice(0, count);
    const usedItems = new Set();
    const uniqueItems = [];

    for (const item of selected) {
      const formatted = formatAnswer(item);
      if (!usedItems.has(formatted)) {
        uniqueItems.push(formatted);
        usedItems.add(formatted);
      }
    }

    if (uniqueItems.length === count) {
      wrongChoices.add(uniqueItems.join(', '));
    }
  }

  return Array.from(wrongChoices).slice(0, 3);
}

function generateExplanation(question, correctAnswer, userAnswer, allCorrectAnswers, multiItemCount = 1) {
  const isCorrect = userAnswer === correctAnswer;

  if (isCorrect) {
    if (multiItemCount > 1) {
      return `✓ Correct! "${correctAnswer}" is the right combination.\n\n💡 Note: During the actual test, you need to name ${multiItemCount} items. You only need to provide one answer from the acceptable list for each item.`;
    } else if (allCorrectAnswers.length > 1) {
      const otherAnswers = allCorrectAnswers.filter(ans => ans !== correctAnswer);
      if (otherAnswers.length > 0) {
        return `✓ Correct! "${correctAnswer}" is right.\n\n💡 Note: This question also accepts these answers: ${otherAnswers.join(', ')}`;
      }
    }
    return `✓ Correct! "${correctAnswer}" is the right answer.`;
  } else {
    if (multiItemCount > 1) {
      const answerList = allCorrectAnswers.map(ans => `"${ans}"`).join(', ');
      return `✗ Not quite. The correct answer shown was "${correctAnswer}".\n\n📚 ALL ACCEPTABLE ITEMS for this question:\n${answerList}\n\n💡 Tip: During your interview, you need to name ${multiItemCount} different items. Any ${multiItemCount} from the list above will be accepted!`;
    } else if (allCorrectAnswers.length > 1) {
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