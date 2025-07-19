const stripLeadingThe = (str: string): string => {
  return str.replace(/^the\s+/i, '').trim();
};

/**
 * Sorts strings by stripping leading "The" and using case-insensitive locale comparison
 * @param a - First string to compare
 * @param b - Second string to compare
 * @returns Negative, zero, or positive number for sorting
 */
export const sortStringsByTitle = (a: string, b: string): number => {
  const aStripped = stripLeadingThe(a);
  const bStripped = stripLeadingThe(b);

  return aStripped.localeCompare(bStripped, undefined, {
    sensitivity: 'base', // Case-insensitive comparison
    numeric: true, // Handle numbers in strings correctly
    ignorePunctuation: false,
  });
};
