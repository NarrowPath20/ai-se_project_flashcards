import { fetchedDecks, getDeckByID, removeDeckByID } from "./decks.js";
import { hexToString } from "./colors.js";
import { renderCarouselView } from "./carousel.js";
import { renderDeckView } from "./deck.js";
import { openConfirmationModal } from "./confirmation-modal.js";
import { disableSubmitBtn } from "./new-deck-view.js";
import { getDecks, deleteDeck } from "./api.js";
import { showError } from "./error-modal.js";

const mainContent = document.querySelector(".page__main-content");
const decksSection = document.querySelector("#home");
const deckSection = document.querySelector("#deck");
const carouselSection = document.querySelector("#carousel");
const newDeckSection = document.querySelector("#new-deck-view");
const notFoundSection = document.querySelector("#not-found");
const aboutSection = document.querySelector("#about");
const page = document.querySelector(".page");
const deckTemplate = document.querySelector("#deck-template");
const deckList = document.querySelector(".gallery__list");
const newDeckButton = document.querySelector("#home .gallery__new-card-btn");
const loadingSection = document.querySelector("#loading");
const loadingMessage = document.querySelector("#loading-message");
const retryButton = document.querySelector("#retry-load");
let decksLoaded = false;

/**
 * Builds a gallery item with a deck link and a confirmed delete action.
 * @param {import("./decks.js").Deck} deckData - The cached deck to display.
 * @returns {DocumentFragment} A cloned deck template with handlers attached.
 */
function createDeckEl(deckData) {
	const deckElement = deckTemplate.content.cloneNode(true);
	const deck = deckElement.querySelector(".card");
	const deckLink = deckElement.querySelector(".card__link");
	const deckTitle = deckElement.querySelector(".card__title");
	const deckCount = deckElement.querySelector(".card__count");
	const deleteButton = deckElement.querySelector(".card__delete-btn");
	const colorName = hexToString(deckData.color);

	deck.classList.add(`card_color_${colorName}`);
	deckLink.href = `#deck/${deckData._id}`;
	deckTitle.textContent = deckData.name;
	deckCount.textContent = `${deckData.cards.length} cards`;
	deleteButton.setAttribute("aria-label", `Delete the ${deckData.name} deck`);
	deleteButton.addEventListener("click", () => {
		openConfirmationModal(
			`Delete the ${deckData.name} deck? This cannot be undone.`,
			() => deleteDeck(deckData._id).then(() => {
				removeDeckByID(deckData._id);
				deck.remove();
			}),
		);
	});

	return deckElement;
}

/**
 * Prepends one deck to the home gallery.
 * @param {import("./decks.js").Deck} deckData - The deck to render.
 * @returns {void}
 */
function renderDeckEl(deckData) {
	deckList.prepend(createDeckEl(deckData));
}

/**
 * Refreshes the home gallery from the current cache, including updated card counts.
 * @returns {void}
 */
function renderHomeView() {
	deckList.replaceChildren(...fetchedDecks.map(createDeckEl).reverse());
}

/**
 * Shows one main section and applies its page layout modifiers.
 * @param {HTMLElement} section - The section to show.
 * @returns {void}
 */
function renderView(section) {
	loadingSection.hidden = section !== loadingSection;
	decksSection.hidden = section !== decksSection;
	deckSection.hidden = section !== deckSection;
	carouselSection.hidden = section !== carouselSection;
	newDeckSection.hidden = section !== newDeckSection;
	notFoundSection.hidden = section !== notFoundSection;
	aboutSection.hidden = section !== aboutSection;
	page.classList.toggle(
		"page_no-mobile-bar",
		section === carouselSection ||
			section === newDeckSection ||
			section === aboutSection ||
			section === notFoundSection,
	);
	page.classList.toggle(
		"page_location_carousel",
		section === carouselSection,
	);
	mainContent.classList.toggle(
		"page__main-content_location_carousel",
		section === carouselSection,
	);
}

/**
 * Renders the current URL hash after resolving any saved deck or card IDs.
 * @returns {void}
 */
function router() {
	const hash = window.location.hash.slice(1);
	if (hash === "about") {
		renderView(aboutSection);
		return;
	}
	if (!decksLoaded) {
		renderView(loadingSection);
		return;
	}

	if (hash === "home" || hash === "") {
		renderHomeView();
		renderView(decksSection);
	} else if (hash === "new-deck" || hash === "new-deck-view") {
		disableSubmitBtn();
		renderView(newDeckSection);
	} else if (hash.startsWith("deck/")) {
		const [, deckId] = hash.split("/");
		const deck = getDeckByID(deckId);

		if (deck) {
			renderDeckView(deck);
			renderView(deckSection);
		} else {
			renderView(notFoundSection);
		}
	} else if (hash.startsWith("carousel/")) {
		const [, deckId, cardId] = hash.split("/");
		const deck = getDeckByID(deckId);
		const cardExists =
			cardId === undefined ||
			deck?.cards.some((card) => String(card._id) === cardId);

		if (deck && cardExists) {
			renderCarouselView(deck, cardId);
			renderView(carouselSection);
		} else {
			renderView(notFoundSection);
		}
	} else {
		renderView(notFoundSection);
	}
}

newDeckButton.addEventListener("click", () => {
	window.location.hash = "new-deck";
});

window.addEventListener("hashchange", router);

/**
 * Fetches and caches the starter decks, reports errors, and routes after completion.
 * @returns {Promise<void>} Resolves when loading and view updates finish.
 */
function loadDecks() {
	loadingMessage.textContent = "Loading your decks…";
	retryButton.hidden = true;
	loadingSection.setAttribute("aria-busy", "true");
	router();
	return getDecks()
		.then((decks) => {
			fetchedDecks.splice(0, fetchedDecks.length);
			fetchedDecks.push(...decks);
			deckList.replaceChildren();
			decks.forEach(renderDeckEl);
			decksLoaded = true;
		})
		.catch(() => {
			loadingMessage.textContent = "Unable to load your decks. Check your connection and try again.";
			retryButton.hidden = false;
			showError("Can't fetch decks. Check your connection and try again.", "Unable to load decks");
		})
		.finally(() => {
			loadingSection.setAttribute("aria-busy", "false");
			router();
		});
}

retryButton.addEventListener("click", loadDecks);
document.addEventListener("DOMContentLoaded", loadDecks);
