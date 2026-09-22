import { hexToString } from "./colors.js";
import { openConfirmationModal } from "./confirmation-modal.js";
import { deleteCard } from "./api.js";
import { createCardEditor } from "./card-editor.js";

const deckTitle = document.querySelector("#deck-title");
const cardList = document.querySelector("#card-list");
const cardTemplate = document.querySelector("#card-template");
const practiceButton = document.querySelector("#deck .gallery__practice-btn");
const newCardButton = document.querySelector("#deck .gallery__new-card-btn");
let activeEditor = null;

/**
 * Builds a card preview with practice, edit, and confirmed deletion controls.
 * @param {import("./decks.js").Card} cardData - The card to display.
 * @param {import("./decks.js").Deck} deckData - The owning deck.
 * @returns {DocumentFragment} A cloned card template with handlers attached.
 */
function createCardElement(cardData, deckData) {
	const cardFragment = cardTemplate.content.cloneNode(true);
	const cardElement = cardFragment.querySelector(".card");
	const cardTitle = cardFragment.querySelector(".card__title");
	const cardPracticeButton = cardFragment.querySelector(".card__practice-btn");
	const deleteButton = cardFragment.querySelector(".card__delete-btn");
	const editButton = cardFragment.querySelector(".card__edit-btn");

	cardElement.classList.add(`card_color_${hexToString(deckData.color)}`);
	cardTitle.textContent = cardData.question;
	cardPracticeButton.href = `#carousel/${deckData._id}/${cardData._id}`;
	deleteButton.setAttribute("aria-label", `Delete card: ${cardData.question}`);
	editButton.setAttribute("aria-label", `Edit card: ${cardData.question}`);
	editButton.addEventListener("click", () => {
		openCardEditor(deckData, cardData, cardElement);
	});
	deleteButton.addEventListener("click", () => {
		openConfirmationModal(
			`Delete this card: “${cardData.question}”?`,
			async () => {
				await deleteCard(cardData._id);
				const cardIndex = deckData.cards.findIndex(
					(card) => card._id === cardData._id,
				);
				if (cardIndex !== -1) deckData.cards.splice(cardIndex, 1);
				cardElement.remove();
				practiceButton.disabled = deckData.cards.length === 0;
			},
		);
	});

	return cardFragment;
}

/**
 * Renders a deck gallery and resets its practice and card creation controls.
 * @param {import("./decks.js").Deck} deckData - The deck to display.
 * @returns {void}
 */
function renderDeckView(deckData) {
	activeEditor = null;
	newCardButton.disabled = false;
	newCardButton.onclick = () => openCardEditor(deckData);
	deckTitle.textContent = deckData.name;
	practiceButton.disabled = deckData.cards.length === 0;
	practiceButton.onclick = () => {
		window.location.hash = `carousel/${deckData._id}`;
	};
	cardList.replaceChildren();

	const cardsFragment = document.createDocumentFragment();
	deckData.cards.forEach((cardData) => {
		cardsFragment.append(createCardElement(cardData, deckData));
	});
	cardList.append(cardsFragment);
}

/**
 * Opens one editor in the deck gallery, optionally replacing an existing card.
 * @param {import("./decks.js").Deck} deck - The deck to modify.
 * @param {import("./decks.js").Card|null} [card=null] - The card to edit, if any.
 * @param {HTMLElement|null} [cardElement=null] - The rendered card to replace.
 * @returns {void}
 */
function openCardEditor(deck, card = null, cardElement = null) {
	if (activeEditor?.isConnected) {
		activeEditor.querySelector('.card-editor__side:not([hidden]) textarea').focus();
		return;
	}
	const editor = createCardEditor(deck, card, () => {
		window.dispatchEvent(new Event("hashchange"));
	}, () => {
		if (cardElement) {
			editor.replaceWith(cardElement);
			cardElement.querySelector(".card__edit-btn").focus();
		} else {
			editor.remove();
		}
		activeEditor = null;
		newCardButton.disabled = false;
		if (!cardElement) newCardButton.focus();
	});
	activeEditor = editor;
	newCardButton.disabled = true;
	if (cardElement) cardElement.replaceWith(editor);
	else cardList.prepend(editor);
	editor.querySelector('[name="question"]').focus();
}

export { renderDeckView };
