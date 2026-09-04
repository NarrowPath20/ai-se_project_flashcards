import { decks, getDeckByID } from "./decks.js";
import { hexToString } from "./colors.js";
import { renderCarouselView } from "./carousel.js";

const mainContent = document.querySelector(".page__main-content");
const decksSection = document.querySelector("#home");
const carouselSection = document.querySelector("#carousel");
const notFoundSection = document.querySelector("#not-found");
const deckTemplate = document.querySelector("#deck-template");
const deckList = document.querySelector(".decks__list");

function createDeckEl(deckData) {
	const deckElement = deckTemplate.content.cloneNode(true);
	const deck = deckElement.querySelector(".deck");
	const deckLink = deckElement.querySelector(".deck__link");
	const deckTitle = deckElement.querySelector(".deck__title");
	const deckCount = deckElement.querySelector(".deck__count");
	const deleteButton = deckElement.querySelector(".deck__delete-btn");
	const colorName = hexToString(deckData.color);

	deck.classList.add(`deck_color_${colorName}`);
	deckLink.href = `#carousel/${deckData.id}`;
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
	} else if (hash.startsWith("carousel/")) {
		const deckId = hash.split("/")[1];
		const deck = getDeckByID(deckId);

		if (deck) {
			renderCarouselView(deck);
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
