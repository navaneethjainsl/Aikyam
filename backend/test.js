import { taddyGraphqlRequest, taddyQuery } from './podcast.js';

// Define a sample function to test the query
async function testSearchForTerm() {
  const query = taddyQuery.SEARCH_FOR_TERM_QUERY;
  const variables = {
    term: "education",  // Example search term
    page: 1,
    limitPerPage: 10,
    filterForTypes: [],
    filterForCountries: [],
    filterForLanguages: [],
    filterForGenres: [],
    filterForSeriesUuids: [],
    filterForNotInSeriesUuids: [],
    isExactPhraseSearchMode: false,
    isSafeMode: true,
    searchResultsBoostType: null
  };

  try {
    const response = await taddyGraphqlRequest({ query, variables });
    // console.log('Response:', response);
  } catch (error) {
    console.error('Error:', error);
  }
}

testSearchForTerm();
