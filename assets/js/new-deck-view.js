import { decks } from "./decks.js";

const form = document.querySelector("#new-deck-form");
const submitBtn = form.querySelector(".new-deck-view__submit-btn");
const textarea = form.querySelector("#deck-json");
const errorModal = document.querySelector("#error-modal");
const errorCloseBtn = errorModal.querySelector(".modal__close-btn");
const errorMessage = errorModal.querySelector(".modal__error");

const HEX_DIGITS = /^[0-9a-fA-F]{6}$/;

/**
 * Converts a string to a lowercase, URL-safe slug.
 *
 * @param {string} str
 * @returns {string}
 */
function slugify(str) {
	return str
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

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

function disableSubmitBtn() {
	submitBtn.disabled = false;
}

function validateName(name) {
	if (typeof name !== "string" || name.length < 2 || name.length > 80) {
		return null;
	}
	return name;
}

function parseJSON(jsonString) {
	try {
		return JSON.parse(jsonString);
	} catch (error) {
		return null;
	}
}

function showError(message) {
	errorMessage.textContent = message;
	errorModal.classList.add("modal_visible");
	errorCloseBtn.focus();
}

function closeError() {
	errorModal.classList.remove("modal_visible");
	textarea.focus();
}

errorCloseBtn.addEventListener("click", closeError);

errorModal.addEventListener("keydown", (e) => {
	if (e.key === "Escape") {
		closeError();
	} else if (e.key === "Tab") {
		// Dismiss is the only focusable control in this modal.
		e.preventDefault();
		errorCloseBtn.focus();
	}
});

form.addEventListener("submit", (e) => {
	e.preventDefault();

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

	const id = `${slugify(name)}-${Date.now()}`;

	decks.push({
		id,
		color: colorValue,
		name,
		cards: jsonData.cards,
	});

	window.location.hash = "deck/" + id;
});

export { disableSubmitBtn };
