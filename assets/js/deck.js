import { hexToString } from "./colors.js";

const deckTitle = document.querySelector("#deck-title");
const cardList = document.querySelector("#card-list");
const cardTemplate = document.querySelector("#card-template");

function createCardElement(cardData, deckData) {
	const cardFragment = cardTemplate.content.cloneNode(true);
	const cardElement = cardFragment.querySelector(".card");
	const cardTitle = cardFragment.querySelector(".card__title");
	const practiceButton = cardFragment.querySelector(".card__practice-btn");
	const deleteButton = cardFragment.querySelector(".card__delete-btn");

	cardElement.classList.add(`card_color_${hexToString(deckData.color)}`);
	cardTitle.textContent = cardData.question;
	practiceButton.href = `#carousel/${deckData.id}/${cardData.id}`;
	deleteButton.setAttribute("aria-label", `Delete card: ${cardData.question}`);
	deleteButton.addEventListener("click", () => cardElement.remove());

	return cardFragment;
}

function renderDeckView(deckData) {
	deckTitle.textContent = deckData.name;
	cardList.replaceChildren();

	const cardsFragment = document.createDocumentFragment();
	deckData.cards.forEach((cardData) => {
		cardsFragment.append(createCardElement(cardData, deckData));
	});
	cardList.append(cardsFragment);
}

export { renderDeckView };
