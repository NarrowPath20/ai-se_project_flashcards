const errorModal = document.querySelector("#error-modal");
const errorCloseBtn = errorModal.querySelector(".modal__close-btn");
const errorMessage = errorModal.querySelector(".modal__error");
const errorTitle = errorModal.querySelector(".modal__title");
let returnFocus;

/**
 * Displays an error message and moves focus to the dismiss button.
 * @param {string|Error} message - The error to display.
 * @param {string} [title="Unable to create deck"] - The modal heading.
 * @returns {void}
 */
function showError(message, title = "Unable to create deck") {
  returnFocus = document.activeElement;
  errorTitle.textContent = title;
  errorMessage.textContent = message instanceof Error ? message.message : message;
  errorModal.classList.add("modal_visible");
  errorCloseBtn.focus();
}

/**
 * Dismisses the error modal and restores focus when the original control still exists.
 * @returns {void}
 */
function closeError() {
  errorModal.classList.remove("modal_visible");
  if (returnFocus?.isConnected) returnFocus.focus();
}

errorCloseBtn.addEventListener("click", closeError);
errorModal.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeError();
  } else if (event.key === "Tab") {
    event.preventDefault();
    errorCloseBtn.focus();
  }
});

export { showError };
