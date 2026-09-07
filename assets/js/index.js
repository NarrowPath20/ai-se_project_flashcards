import { decks, getDeckByID } from "./decks.js";
import { hexToString } from "./colors.js";
import { renderCarouselView } from "./carousel.js";
import { renderDeckView } from "./deck.js";

const mainContent = document.querySelector(".page__main-content");
const decksSection = document.querySelector("#home");
const deckSection = document.querySelector("#deck");
const carouselSection = document.querySelector("#carousel");
const notFoundSection = document.querySelector("#not-found");
const deckTemplate = document.querySelector("#deck-template");
const deckList = document.querySelector(".gallery__list");

function createDeckEl(deckData) {
	const deckElement = deckTemplate.content.cloneNode(true);
	const deck = deckElement.querySelector(".card");
	const deckLink = deckElement.querySelector(".card__link");
	const deckTitle = deckElement.querySelector(".card__title");
	const deckCount = deckElement.querySelector(".card__count");
	const deleteButton = deckElement.querySelector(".card__delete-btn");
	const colorName = hexToString(deckData.color);

	deck.classList.add(`card_color_${colorName}`);
	deckLink.href = `#deck/${deckData.id}`;
	deckTitle.textContent = deckData.name;
	deckCount.textContent = `${deckData.cards.length} cards`;
	deleteButton.setAttribute("aria-label", `Delete the ${deckData.name} deck`);
	deleteButton.addEventListener("click", () => deck.remove());

	return deckElement;
}

function renderDeckEl(deckData) {
	deckList.prepend(createDeckEl(deckData));
}

decks.forEach(renderDeckEl);

function renderView(section) {
	decksSection.hidden = section !== decksSection;
	deckSection.hidden = section !== deckSection;
	carouselSection.hidden = section !== carouselSection;
	notFoundSection.hidden = section !== notFoundSection;
	mainContent.classList.toggle(
		"page__main-content_location_carousel",
		section === carouselSection,
	);
}

function router() {
	const hash = window.location.hash.slice(1);

	if (hash === "home" || hash === "") {
		renderView(decksSection);
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
			deck?.cards.some((card) => String(card.id) === cardId);

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

window.addEventListener("hashchange", router);
router();
