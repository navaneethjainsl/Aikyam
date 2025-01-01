
const endpointUrl = "https://api.taddy.org/";
const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'Aasare',
    'X-USER-ID': process.env.TADDY_USER_ID,
    'X-API-KEY': process.env.TADDY_API_KEY,
};

// Function to make GraphQL requests
async function makeGraphqlRequest(query, variables) {
    try {
        const client = new GraphQLClient(endpointUrl, { headers });
        const response = await client.request(gql`${query}`, variables);
        return response;
    } catch (error) {
        console.error(GraphQL query execution failed: ${error.message});
        return null;
    }
}

// Endpoint to fetch podcast series by name
app.get('/podcast_series', async (req, res) => {
    const name = req.query.name || ''; // Default name if not provided

    const query = `query searchForTerm($term: String, $page: Int, $limitPerPage: Int, $filterForTypes: [TaddyType], $filterForCountries: [Country], $filterForLanguages: [Language], $filterForGenres: [Genre], $filterForSeriesUuids: [ID], $filterForNotInSeriesUuids: [ID], $isExactPhraseSearchMode: Boolean, $isSafeMode: Boolean, $searchResultsBoostType: SearchResultBoostType) {
        searchForTerm(term: $term, page: $page, limitPerPage: $limitPerPage, filterForTypes: $filterForTypes, filterForCountries: $filterForCountries, filterForLanguages: $filterForLanguages, filterForGenres: $filterForGenres, filterForSeriesUuids: $filterForSeriesUuids, filterForNotInSeriesUuids: $filterForNotInSeriesUuids, isExactPhraseSearchMode: $isExactPhraseSearchMode, isSafeMode: $isSafeMode, searchResultsBoostType: $searchResultsBoostType) {
            searchId
            podcastSeries {
                uuid
                name
                rssUrl
                itunesId
            }
            podcastEpisodes {
                uuid
                guid
                name
                audioUrl
            }
        }
    }`;

    const variables = {
        term: name,
        filterForGenres: ["PODCASTSERIES_HEALTH_AND_FITNESS_MENTAL_HEALTH"],
        limitPerPage: 25,
        page: 5
    };

    // Make GraphQL request using the defined function
    const response = await makeGraphqlRequest(query, variables);

    if (response) {
        res.status(200).json(response);
    } else {
        res.status(404).json({ error: 'Not found' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(Server is running on port ${PORT});
});