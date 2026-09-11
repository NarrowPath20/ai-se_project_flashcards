import { hexToString } from "./colors.js";
import { openConfirmationModal } from "./confirmation-modal.js";

const deckTitle = document.querySelector("#deck-title");
const cardList = document.querySelector("#card-list");
const cardTemplate = document.querySelector("#card-template");
const practiceButton = document.querySelector(".gallery__practice-btn");

function createCardElement(cardData, deckData) {
	const cardFragment = cardTemplate.content.cloneNode(true);
	const cardElement = cardFragment.querySelector(".card");
	const cardTitle = cardFragment.querySelector(".card__title");
	const cardPracticeButton = cardFragment.querySelector(".card__practice-btn");
	const deleteButton = cardFragment.querySelector(".card__delete-btn");

	cardElement.classList.add(`card_color_${hexToString(deckData.color)}`);
	cardTitle.textContent = cardData.question;
	cardPracticeButton.href = `#carousel/${deckData.id}/${cardData.id}`;
	deleteButton.setAttribute("aria-label", `Delete card: ${cardData.question}`);
	deleteButton.addEventListener("click", () => {
		openConfirmationModal(
			`Delete this card: “${cardData.question}”?`,
			() => {
				const cardIndex = deckData.cards.findIndex(
					(card) => card.id === cardData.id,
				);
				if (cardIndex !== -1) deckData.cards.splice(cardIndex, 1);
				cardElement.remove();
			},
		);
	});

	return cardFragment;
}

function renderDeckView(deckData) {
	deckTitle.textContent = deckData.name;
	practiceButton.onclick = () => {
		window.location.hash = `carousel/${deckData.id}`;
	};
	cardList.replaceChildren();

	const cardsFragment = document.createDocumentFragment();
	deckData.cards.forEach((cardData) => {
		cardsFragment.append(createCardElement(cardData, deckData));
	});
	cardList.append(cardsFragment);
}

export { renderDeckView };
