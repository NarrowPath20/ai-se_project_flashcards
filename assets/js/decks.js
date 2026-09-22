/**
 * A flashcard saved in the database.
 * @typedef {Object} Card
 * @property {string} _id - The server-generated card ID.
 * @property {string} question - The front of the card.
 * @property {string} answer - The back of the card.
 */

/**
 * A deck saved in the database.
 * @typedef {Object} Deck
 * @property {string} _id - The server-generated deck ID.
 * @property {string} name - The deck title.
 * @property {string} color - The deck's hexadecimal color.
 * @property {Card[]} cards - The cards belonging to this deck.
 */

/** @type {Deck[]} The shared cache of decks fetched from the API. */
const fetchedDecks = [];

/**
 * Looks up a cached deck by its database ID.
 * @param {string} deckId - The ID to find.
 * @returns {Deck|undefined} The matching deck, if one exists.
 */
function getDeckByID(deckId) {
  return fetchedDecks.find((deck) => deck._id === deckId);
}

/**
 * Removes a deleted deck from the shared cache in place.
 * @param {string} deckId - The ID of the deleted deck.
 * @returns {void}
 */
function removeDeckByID(deckId) {
  const index = fetchedDecks.findIndex((deck) => deck._id === deckId);
  if (index !== -1) fetchedDecks.splice(index, 1);
}

export { fetchedDecks, getDeckByID, removeDeckByID };