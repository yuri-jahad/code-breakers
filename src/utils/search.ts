import shuffle from "./shuffle";

interface SearchResults {
  totalResults: string[];
  resultCount: number;
  limitedResults: string[];
}

function escapeSpecialCharacters(searchPattern: string) {
  return searchPattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default function searchWords(
  wordsList: string[],
  searchTerm: string,
  resultLimit: number
): string[] | SearchResults {
  const normalizedSearchTerm = searchTerm.toLowerCase();
  const totalWords = wordsList.length;
  const matchedWords: string[] = [];
  const searchRegex = new RegExp(
    escapeSpecialCharacters(normalizedSearchTerm),
    "i"
  );
  const searchStartTime = performance.now();
  const maxSearchDuration = 200;

  for (let wordIndex = 0; wordIndex < totalWords; wordIndex++) {
    const searchDuration = performance.now() - searchStartTime;
    if (searchDuration >= maxSearchDuration) {
      return [];
    }
    if (searchRegex.test(wordsList[wordIndex])) {
      matchedWords.push(wordsList[wordIndex]);
    }
  }

  const totalMatches = matchedWords.length;

  if (totalMatches <= resultLimit) {
    return matchedWords;
  }

  const shuffledResults = shuffle(matchedWords);

  return {
    limitedResults: shuffledResults.slice(0, resultLimit),
    resultCount: matchedWords.length,
    totalResults: matchedWords,
  };
}
