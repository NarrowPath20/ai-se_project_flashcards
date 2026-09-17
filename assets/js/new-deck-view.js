import { decks } from "./decks.js";

const form = document.querySelector("#new-deck-form");
const submitBtn = form.querySelector(".new-deck-view__submit-btn");
const textarea = form.querySelector("#deck-json");

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

form.addEventListener("submit", (e) => {
	e.preventDefault();

	const formData = Object.fromEntries(new FormData(form));
	const jsonData = JSON.parse(formData[textarea.name]);
	const color = normalizeColor(formData.color);
	const id = `${slugify(jsonData.name)}-${Date.now()}`;

	decks.push({
		id,
		color,
		name: jsonData.name,
		cards: jsonData.cards,
	});

	window.location.hash = "deck/" + id;
});

export { disableSubmitBtn };
