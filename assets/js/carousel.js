import { hexToString, removeColorClasses } from "./colors.js";

let currentIndex = 0;
let showingQuestion = true;
let currentDeck;

const carouselTitle = document.querySelector(".carousel__title");
const carouselCard = document.querySelector(".carousel__card");
const carouselCardText = document.querySelector(".carousel__card-text");
const leftButton = document.querySelector(".carousel__btn_type_left");
const rightButton = document.querySelector(".carousel__btn_type_right");
const flipButton = document.querySelector(".carousel__btn_type_flip");

function getCarouselTitleString(deck, index) {
	return `${deck.name} · ${index + 1} of ${deck.cards.length}`;
}

function updateDisplay() {
	const currentCard = currentDeck.cards[currentIndex];

	carouselTitle.textContent = getCarouselTitleString(currentDeck, currentIndex);
	removeColorClasses(carouselCard);
	carouselCard.classList.add(
		`carousel__card_color_${hexToString(currentDeck.color)}`,
	);

	if (showingQuestion) {
		carouselCardText.textContent = currentCard.question;
		carouselCard.classList.remove("carousel__card_color_white");
	} else {
		carouselCardText.textContent = currentCard.answer;
		carouselCard.classList.add("carousel__card_color_white");
	}

	leftButton.disabled = currentIndex === 0;
	rightButton.disabled = currentIndex === currentDeck.cards.length - 1;
	leftButton.classList.toggle("carousel__btn_disabled", leftButton.disabled);
	rightButton.classList.toggle("carousel__btn_disabled", rightButton.disabled);
}

leftButton.addEventListener("click", () => {
	if (currentDeck && currentIndex > 0) {
		currentIndex -= 1;
		showingQuestion = true;
		updateDisplay();
	}
});

rightButton.addEventListener("click", () => {
	if (currentDeck && currentIndex < currentDeck.cards.length - 1) {
		currentIndex += 1;
		showingQuestion = true;
		updateDisplay();
	}
});

flipButton.addEventListener("click", () => {
	showingQuestion = !showingQuestion;
	updateDisplay();
});

function renderCarouselView(deck, cardId) {
	currentDeck = deck;
	const requestedIndex = deck.cards.findIndex(
		(card) => String(card.id) === String(cardId),
	);
	currentIndex = requestedIndex === -1 ? 0 : requestedIndex;
	showingQuestion = true;
	updateDisplay();
}

export { renderCarouselView };
