const confirmationModal = document.querySelector("#confirmation-modal");
const confirmationMessage = confirmationModal.querySelector(
  ".confirmation-modal__message",
);
const cancelButton = confirmationModal.querySelector(
  ".confirmation-modal__button_type_cancel",
);
const deleteButton = confirmationModal.querySelector(
  ".confirmation-modal__button_type_delete",
);

let confirmDeletion = null;
let deleting = false;

/**
 * Closes the deletion dialog unless a request is in progress.
 * @returns {void}
 */
function closeConfirmationModal() {
  if (deleting) return;
  confirmationModal.close();
  confirmDeletion = null;
}

/**
 * Opens the reusable dialog with an action to execute after confirmation.
 * @param {string} message - The confirmation prompt.
 * @param {function(): (void|Promise<void>)} onConfirm - The deletion action; rejection displays an error in the modal.
 * @returns {void}
 */
function openConfirmationModal(message, onConfirm) {
  confirmationMessage.textContent = message;
  confirmDeletion = onConfirm;
  confirmationModal.showModal();
}

cancelButton.addEventListener("click", closeConfirmationModal);

deleteButton.addEventListener("click", async () => {
  if (deleting || !confirmDeletion) return;
  deleting = true;
  deleteButton.disabled = true;
  cancelButton.disabled = true;
  deleteButton.textContent = "Deleting…";
  try {
    await confirmDeletion();
    confirmationModal.close();
    confirmDeletion = null;
  } catch (error) {
    confirmationMessage.textContent = "Unable to delete. Check your connection and try again.";
  } finally {
    deleting = false;
    deleteButton.disabled = false;
    cancelButton.disabled = false;
    deleteButton.textContent = "Delete";
  }
});

confirmationModal.addEventListener("cancel", (event) => {
  if (deleting) {
    event.preventDefault();
    return;
  }
  confirmDeletion = null;
});

export { openConfirmationModal };
