import { addCard, updateCard } from "./api.js";
import { hexToString } from "./colors.js";
import { showError } from "./error-modal.js";

const editorTemplate = document.querySelector("#card-editor-template");

/**
 * Builds a two-sided form for adding or editing a card in a cached deck.
 * @param {import("./decks.js").Deck} deck - The card's owning deck.
 * @param {import("./decks.js").Card|null} card - A card to edit, or null to add one.
 * @param {function(): void} onSave - Refreshes the view after a successful save.
 * @param {function(): void} onCancel - Restores the view after cancellation.
 * @returns {HTMLLIElement} The editor, with question and answer fields in one form.
 */
function createCardEditor(deck, card, onSave, onCancel) {
  const editor = editorTemplate.content.firstElementChild.cloneNode(true);
  const form = editor.querySelector("form");
  const questionInput = form.elements.question;
  const answerInput = form.elements.answer;
  const flipButton = form.querySelector(".card-editor__button_type_flip");
  const saveButton = form.querySelector(".card-editor__button_type_save");
  const cancelButton = form.querySelector(".card-editor__button_type_cancel");
  let answerVisible = false;
  let saving = false;

  editor.classList.add(`card_color_${hexToString(deck.color)}`);
  questionInput.value = card?.question ?? "";
  answerInput.value = card?.answer ?? "";

  /**
   * Displays one side of the form and focuses its field.
   * @param {boolean} showAnswer - Whether to show the answer instead of the question.
   * @returns {void}
   */
  function showSide(showAnswer) {
    answerVisible = showAnswer;
    editor.classList.toggle("card-editor_side_answer", showAnswer);
    form.querySelector('[data-side="question"]').hidden = showAnswer;
    form.querySelector('[data-side="answer"]').hidden = !showAnswer;
    flipButton.setAttribute("aria-label", showAnswer ? "Show question" : "Show answer");
    (showAnswer ? answerInput : questionInput).focus();
  }

  flipButton.addEventListener("click", () => showSide(!answerVisible));
  cancelButton.addEventListener("click", () => {
    if (!saving) onCancel();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (saving) return;
    const data = { question: questionInput.value.trim(), answer: answerInput.value.trim() };
    if (!data.question || !data.answer) {
      showSide(Boolean(data.question));
      showError("Enter both a question and an answer before saving.", "Unable to save card");
      return;
    }

    saving = true;
    form.setAttribute("aria-busy", "true");
    Array.from(form.elements).forEach((element) => { element.disabled = true; });
    saveButton.setAttribute("aria-label", "Saving card");
    try {
      const savedCard = card
        ? await updateCard(card._id, data)
        : await addCard(deck._id, data);
      if (card) {
        Object.assign(card, savedCard);
      } else {
        deck.cards.push(savedCard);
      }
      onSave();
    } catch (error) {
      showError("Unable to save your card. Check your connection and try again. Your text has been kept.", "Unable to save card");
    } finally {
      saving = false;
      form.setAttribute("aria-busy", "false");
      Array.from(form.elements).forEach((element) => { element.disabled = false; });
      saveButton.setAttribute("aria-label", "Save card");
    }
  });

  return editor;
}

export { createCardEditor };
