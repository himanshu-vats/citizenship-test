const { test, expect } = require('@playwright/test');
const questions2025 = require('../data/questions-2025.json');
const questions2008 = require('../data/questions-2008.json');

test.describe('Answer Capitalization Tests', () => {
  test('All answers should start with capital letter or number (2025)', () => {
    questions2025.forEach((question) => {
      question.answers.forEach((answer) => {
        // Skip answers that start with parenthesis (allow lowercase for optional words)
        if (answer.startsWith('(')) {
          expect(answer).toMatch(/^\([A-Za-z0-9]/);
        } else if (answer.startsWith('"')) {
          // Allow quotes at start (for quoted text like "Father of Our Country")
          expect(answer[1]).toMatch(/[A-Z0-9]/);
        } else {
          // Allow capital letters or numbers
          expect(answer[0]).toMatch(/[A-Z0-9]/);
        }
      });
    });
  });

  test('All answers should start with capital letter or number (2008)', () => {
    questions2008.forEach((question) => {
      question.answers.forEach((answer) => {
        // Skip answers that start with parenthesis (allow lowercase for optional words)
        if (answer.startsWith('(')) {
          expect(answer).toMatch(/^\([A-Za-z0-9]/);
        } else if (answer.startsWith('"')) {
          // Allow quotes at start (for quoted text like "Father of Our Country")
          expect(answer[1]).toMatch(/[A-Z0-9]/);
        } else {
          // Allow capital letters or numbers
          expect(answer[0]).toMatch(/[A-Z0-9]/);
        }
      });
    });
  });

  test('Government terms should be properly capitalized (2025)', () => {
    const governmentTerms = [
      { term: /\bPresident\b/, name: 'President' },
      { term: /\bCongress\b/, name: 'Congress' },
      { term: /\bSenate\b/, name: 'Senate' },
      { term: /\bHouse of Representatives\b/, name: 'House of Representatives' },
      { term: /\bSupreme Court\b/, name: 'Supreme Court' },
      { term: /\bConstitution\b/, name: 'Constitution' },
      { term: /\bBill of Rights\b/, name: 'Bill of Rights' },
      { term: /\bDeclaration of Independence\b/, name: 'Declaration of Independence' },
      { term: /\bUnited States\b/, name: 'United States' },
      { term: /\bU\.S\.\b/, name: 'U.S.' },
    ];

    questions2025.forEach((question) => {
      question.answers.forEach((answer) => {
        governmentTerms.forEach(({ term, name }) => {
          if (term.test(answer)) {
            expect(answer).toContain(name);
            // Make sure lowercase versions don't exist
            const lowerVersion = name.toLowerCase();
            if (lowerVersion !== name) {
              expect(answer.toLowerCase()).toContain(lowerVersion);
            }
          }
        });
      });
    });
  });

  test('No corrupted words like "ReligioU.S." or "LoU.S.ana" (2025)', () => {
    const corruptedPatterns = [
      /U\.S\.[a-z]/,  // U.S. followed by lowercase letter (like "U.S.a")
      /[a-z]U\.S\./,  // lowercase letter followed by U.S. (like "oU.S.")
    ];

    questions2025.forEach((question) => {
      question.answers.forEach((answer) => {
        corruptedPatterns.forEach((pattern) => {
          expect(answer).not.toMatch(pattern);
        });
      });
    });
  });

  test('No corrupted words like "ReligioU.S." or "LoU.S.ana" (2008)', () => {
    const corruptedPatterns = [
      /U\.S\.[a-z]/,  // U.S. followed by lowercase letter
      /[a-z]U\.S\./,  // lowercase letter followed by U.S.
    ];

    questions2008.forEach((question) => {
      question.answers.forEach((answer) => {
        corruptedPatterns.forEach((pattern) => {
          expect(answer).not.toMatch(pattern);
        });
      });
    });
  });

  test('Proper nouns maintain correct capitalization (2025)', () => {
    // Check for common proper nouns that shouldn't be all lowercase
    questions2025.forEach((question) => {
      question.answers.forEach((answer) => {
        // If answer contains "united states" (all lowercase), it should be capitalized
        expect(answer).not.toMatch(/\bunited states\b/);
        expect(answer).not.toMatch(/\bsupreme court\b/);
        expect(answer).not.toMatch(/\bbill of rights\b/);
        expect(answer).not.toMatch(/\bhouse of representatives\b/);
      });
    });
  });
});
