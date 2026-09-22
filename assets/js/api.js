const baseUrl = "https://se-flashcards-api.en.tripleten-services.com/v1";
// The course permits including this educational API token in the project.
const headers = {
  "Content-Type": "application/json",
  Authorization: "01a0c6b0-6379-71d8-ba1d-0e327a6ee740",
};

/**
 * Parses successful JSON responses and rejects unsuccessful HTTP responses.
 * @param {Response} response - The response returned by fetch.
 * @returns {Promise<*>} Parsed JSON, or null for an empty response.
 */
function processResponse(response) {
  if (!response.ok) {
    return Promise.reject(new Error(`Request failed (${response.status}). Please try again.`));
  }
  return response.status === 204 ? Promise.resolve(null) : response.json();
}

/**
 * Fetches all decks belonging to the configured token.
 * @returns {Promise<import("./decks.js").Deck[]>} The saved decks and cards.
 */
function getDecks() {
  return fetch(`${baseUrl}/decks`, { headers }).then(processResponse);
}

/**
 * Saves a new deck and its cards with IDs assigned by the server.
 * @param {{name: string, color: string, cards: {question: string, answer: string}[]}} deck - The deck to save.
 * @returns {Promise<import("./decks.js").Deck>} The saved deck.
 */
function addDeck({ name, color, cards }) {
  return fetch(`${baseUrl}/decks`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name,
      color,
      cards: cards.map(({ question, answer }) => ({ question, answer })),
    }),
  }).then(processResponse);
}

/**
 * Deletes a saved deck and all associated cards.
 * @param {string} deckId - The deck's database ID.
 * @returns {Promise<{message: string}>} The server's deletion confirmation.
 */
function deleteDeck(deckId) {
  return fetch(`${baseUrl}/decks/${encodeURIComponent(deckId)}`, {
    method: "DELETE",
    headers,
  }).then(processResponse);
}

/**
 * Deletes a saved card.
 * @param {string} cardId - The card's database ID.
 * @returns {Promise<{message: string}>} The server's deletion confirmation.
 */
function deleteCard(cardId) {
  return fetch(`${baseUrl}/cards/${encodeURIComponent(cardId)}`, {
    method: "DELETE",
    headers,
  }).then(processResponse);
}

/**
 * Saves a new card in an existing deck.
 * @param {string} deckId - The destination deck's database ID.
 * @param {{question: string, answer: string}} card - The card's two sides.
 * @returns {Promise<import("./decks.js").Card>} The saved card.
 */
function addCard(deckId, { question, answer }) {
  return fetch(`${baseUrl}/cards/${encodeURIComponent(deckId)}`, {
    method: "POST",
    headers,
    body: JSON.stringify({ question, answer }),
  }).then(processResponse);
}

/**
 * Updates both sides of a saved card.
 * @param {string} cardId - The card's database ID.
 * @param {{question: string, answer: string}} card - The replacement text.
 * @returns {Promise<import("./decks.js").Card>} The updated card.
 */
function updateCard(cardId, { question, answer }) {
  return fetch(`${baseUrl}/cards/${encodeURIComponent(cardId)}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ question, answer }),
  }).then(processResponse);
}

export { getDecks, addDeck, deleteDeck, deleteCard, addCard, updateCard };