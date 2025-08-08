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

export const safeFetch = async (url: string) => {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(
        `HTTP ${res.status} ${res.statusText} while fetching ${url}`,
      );
    }

    // Get the response text first to inspect it if JSON parsing fails
    const text = await res.text();
    console.log(
      `Response from ${url} (first 200 chars):`,
      text.substring(0, 200),
    );

    try {
      return JSON.parse(text);
    } catch (jsonError) {
      console.error(`JSON parsing failed for ${url}:`);
      console.error(`Response text (first 200 chars):`, text.substring(0, 200));
      console.error(`JSON error:`, jsonError);
      const errorMessage =
        jsonError instanceof Error
          ? jsonError.message
          : 'Unknown JSON parsing error';
      throw new Error(`Invalid JSON response from ${url}: ${errorMessage}`);
    }
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
};
