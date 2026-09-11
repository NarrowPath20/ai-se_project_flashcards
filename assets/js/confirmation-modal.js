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

function closeConfirmationModal() {
  confirmationModal.close();
  confirmDeletion = null;
}

function openConfirmationModal(message, onConfirm) {
  confirmationMessage.textContent = message;
  confirmDeletion = onConfirm;
  confirmationModal.showModal();
}

cancelButton.addEventListener("click", closeConfirmationModal);

deleteButton.addEventListener("click", () => {
  const deletionAction = confirmDeletion;
  closeConfirmationModal();
  deletionAction?.();
});

confirmationModal.addEventListener("cancel", () => {
  confirmDeletion = null;
});

export { openConfirmationModal };
