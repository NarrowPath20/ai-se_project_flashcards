import { fetchedDecks } from "./decks.js";
import { addDeck } from "./api.js";
import { showError } from "./error-modal.js";

const form = document.querySelector("#new-deck-form");
const submitBtn = form.querySelector(".new-deck-view__submit-btn");
const textarea = form.querySelector("#deck-json");
textarea.placeholder = JSON.stringify({
	name: "Deck Name",
	cards: [{ question: "Question 1", answer: "Answer 1" }],
}, null, 2);
let saving = false;

const HEX_DIGITS = /^[0-9a-fA-F]{6}$/;

/**
 * Returns a lowercase hex color with a leading "#", defaulting to green.
 *
 * @param {string|undefined} color
 * @returns {string}
 */
function normalizeColor(color) {
	if (!color) return "#64d583";
	const hex = color.startsWith("#") ? color.slice(1) : color;
	if (!HEX_DIGITS.test(hex)) return "#64d583";
	return "#" + hex.toLowerCase();
}

/**
 * Disables creation while saving or when the JSON textarea is empty.
 * @returns {void}
 */
function disableSubmitBtn() {
	submitBtn.disabled = saving || textarea.value.trim() === "";
}

textarea.addEventListener("input", disableSubmitBtn);

/**
 * Validates a deck name after trimming surrounding whitespace.
 * @param {*} name - The name read from parsed JSON.
 * @returns {string|null} A valid trimmed name, or null.
 */
function validateName(name) {
	if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 80) {
		return null;
	}
	return name.trim();
}

/**
 * Parses deck JSON without allowing a syntax error to escape the form handler.
 * @param {string} jsonString - The text to parse.
 * @returns {*} The parsed JSON value, or null if parsing fails.
 */
function parseJSON(jsonString) {
	try {
		return JSON.parse(jsonString);
	} catch (error) {
		return null;
	}
}

form.addEventListener("submit", (e) => {
	e.preventDefault();
	if (saving) return;

	const formData = Object.fromEntries(new FormData(form));
	const jsonData = parseJSON(formData[textarea.name]);
	if (jsonData === null) {
		showError(
			"Enter valid JSON for a deck object. Check for missing commas, quotes, or brackets.",
		);
		return;
	}
	if (typeof jsonData !== "object" || Array.isArray(jsonData)) {
		showError(
			'The deck JSON must be an object with "name" and "cards" fields.',
		);
		return;
	}

	const name = validateName(jsonData.name);
	if (name === null) {
		showError(
			'The deck must have a "name" that is a string between 2 and 80 characters.',
		);
		return;
	}
	if (!Array.isArray(jsonData.cards)) {
		showError(
			'The deck must have a "cards" field containing an array. Use [] for an empty deck.',
		);
		return;
	}
	if (jsonData.cards.some((card) =>
		!card || typeof card !== "object" || Array.isArray(card) ||
		typeof card.question !== "string" || !card.question.trim() ||
		typeof card.answer !== "string" || !card.answer.trim()
	)) {
		showError('Every card must have nonempty "question" and "answer" strings.');
		return;
	}

	const colorValue = normalizeColor(formData.color);
	if (
		typeof jsonData.color === "string" &&
		jsonData.color.toLowerCase() !== colorValue
	) {
		showError(
			'The JSON "color" does not match the selected color. Choose the matching color or update the JSON.',
		);
		return;
	}

	saving = true;
	Array.from(form.elements).forEach((element) => { element.disabled = true; });
	submitBtn.textContent = "Creating…";
	addDeck({ name, color: colorValue, cards: jsonData.cards })
		.then((newDeck) => {
			fetchedDecks.push(newDeck);
			form.reset();
			if (["#new-deck", "#new-deck-view"].includes(window.location.hash)) {
				window.location.hash = "deck/" + newDeck._id;
			} else {
				window.dispatchEvent(new Event("hashchange"));
			}
		})
		.catch(() => {
			showError("Unable to save your deck. Check your connection and try again. Your input has been kept.");
		})
		.finally(() => {
			saving = false;
			Array.from(form.elements).forEach((element) => { element.disabled = false; });
			submitBtn.textContent = "Create Deck";
			disableSubmitBtn();
		});
});

export { disableSubmitBtn };
