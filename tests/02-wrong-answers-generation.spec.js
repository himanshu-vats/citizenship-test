const { test, expect } = require('@playwright/test');
const { prepareQuestionForTest } = require('../lib/answerGenerator.js');
const questions2025 = require('../data/questions-2025.json');
const questions2008 = require('../data/questions-2008.json');

test.describe('Wrong Answers Generation Tests', () => {
  test('No duplicate wrong answers should appear in multi-item questions (2025)', () => {
    // Find multi-item questions (those asking for "two", "three", etc.)
    const multiItemQuestions = questions2025.filter(q =>
      /name\s+(two|three|four|five|\d+)/i.test(q.question) ||
      /what\s+(?:are|were)\s+(two|three|four|five|\d+)/i.test(q.question)
    );

    // Test each multi-item question multiple times to account for randomness
    multiItemQuestions.forEach((question) => {
      for (let i = 0; i < 10; i++) {
        const preparedQuestion = prepareQuestionForTest(question, '2025', null);

        // Check that all display options are unique
        const uniqueOptions = new Set(preparedQuestion.displayOptions);
        expect(uniqueOptions.size).toBe(preparedQuestion.displayOptions.length);
      }
    });
  });

  test('Wrong answers should not contain personalized state data for non-personalized questions (2025)', () => {
    // Mock user info with state-specific data
    const mockUserInfo = {
      state: 'Washington',
      senators: ['Patty Murray', 'Maria Cantwell'],
      representative: 'Suzan DelBene',
      governor: 'Bob Ferguson',
      capital: 'Olympia'
    };

    // Questions that are NOT personalized (not 20, 23, 29, 43, 44, 61, 62)
    const nonPersonalizedQuestions = questions2025.filter(q =>
      ![20, 23, 29, 43, 44, 61, 62].includes(q.id)
    );

    // Test that personalized data doesn't leak into non-personalized questions
    nonPersonalizedQuestions.forEach((question) => {
      for (let i = 0; i < 5; i++) {
        const preparedQuestion = prepareQuestionForTest(question, '2025', mockUserInfo);

        // Check that display options don't contain state-specific data
        preparedQuestion.displayOptions.forEach((option) => {
          expect(option).not.toContain('Patty Murray');
          expect(option).not.toContain('Maria Cantwell');
          expect(option).not.toContain('Suzan DelBene');
          expect(option).not.toContain('Bob Ferguson');
          expect(option).not.toContain('Olympia');
        });
      }
    });
  });

  test('Personalized questions should use personalized data when available (2025)', () => {
    const mockUserInfo = {
      state: 'Washington',
      senators: ['Patty Murray', 'Maria Cantwell'],
      representative: 'Suzan DelBene',
      governor: 'Bob Ferguson',
      capital: 'Olympia'
    };

    // Question 20/23: Senators
    const senatorQuestion = questions2025.find(q => q.id === 20 || q.id === 23);
    if (senatorQuestion) {
      const prepared = prepareQuestionForTest(senatorQuestion, '2025', mockUserInfo);
      expect(prepared.allCorrectAnswers).toEqual(['Patty Murray', 'Maria Cantwell']);
    }

    // Question 29: Representative
    const repQuestion = questions2025.find(q => q.id === 29);
    if (repQuestion) {
      const prepared = prepareQuestionForTest(repQuestion, '2025', mockUserInfo);
      expect(prepared.allCorrectAnswers).toEqual(['Suzan DelBene']);
    }

    // Question 43/61: Governor
    const govQuestion = questions2025.find(q => q.id === 43 || q.id === 61);
    if (govQuestion) {
      const prepared = prepareQuestionForTest(govQuestion, '2025', mockUserInfo);
      expect(prepared.allCorrectAnswers).toEqual(['Bob Ferguson']);
    }

    // Question 44/62: Capital
    const capQuestion = questions2025.find(q => q.id === 44 || q.id === 62);
    if (capQuestion) {
      const prepared = prepareQuestionForTest(capQuestion, '2025', mockUserInfo);
      expect(prepared.allCorrectAnswers).toEqual(['Olympia']);
    }
  });

  test('All questions should have at least 3 wrong answers (2025)', () => {
    questions2025.forEach((question) => {
      const preparedQuestion = prepareQuestionForTest(question, '2025', null);
      expect(preparedQuestion.wrongAnswers.length).toBeGreaterThanOrEqual(3);
    });
  });

  test('All questions should have exactly 4 display options (2025)', () => {
    questions2025.forEach((question) => {
      const preparedQuestion = prepareQuestionForTest(question, '2025', null);
      expect(preparedQuestion.displayOptions.length).toBe(4);
    });
  });

  test('Correct answer should always be in display options (2025)', () => {
    questions2025.forEach((question) => {
      for (let i = 0; i < 5; i++) {
        const preparedQuestion = prepareQuestionForTest(question, '2025', null);
        expect(preparedQuestion.displayOptions).toContain(preparedQuestion.correctAnswer);
      }
    });
  });

  test('Wrong answers should not match any correct answers (2025)', () => {
    questions2025.forEach((question) => {
      const preparedQuestion = prepareQuestionForTest(question, '2025', null);
      preparedQuestion.wrongAnswers.forEach((wrongAnswer) => {
        expect(preparedQuestion.allCorrectAnswers).not.toContain(wrongAnswer);
      });
    });
  });
});
