import React, { useState } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

library.add(faTrash);

export default function DeleteAllCards({ deleteAllCards, cards }) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [showMessage, setShowMessage] = useState(false);
  const [showDeleteMessage, setShowDeleteMessage] = useState(false);

  const handleDeleteAll = () => {
    if (cards.length === 0) {
      setShowMessage(true);
    } else {
      setShowConfirmation(true);
    }
  };
  const handleCloseMessage = () => {
    setShowMessage(false);
  };
  const handleConfirmDeleteAll = () => {
    setShowConfirmation(false);
    setShowDeleteMessage(true);
    deleteAllCards();

    setTimeout(() => {
      setShowDeleteMessage(false);
    }, 3000);
  };
  const handleCancelDeleteAll = () => {
    // Reset the confirmation box state
    setShowConfirmation(false);
    setShowDeleteMessage(false);
  };

  return (
    <>
      <div className="ml-2 rounded border border-red-400 bg-red-300  p-1 hover:bg-red-500">
        <button onClick={handleDeleteAll}>
          Delete All
          <FontAwesomeIcon className="ml-2" icon="trash" />
        </button>
      </div>
      {showMessage && (
        <div className="modal">
          <div className="modal-content">
            <p className="font-semibold text-rose-500">
              There are no cards to delete.
            </p>
            <div className="flex justify-end">
              <button
                className="text-bold mt-2 ml-2 rounded border border-slate-500 bg-slate-500 p-1 text-sm text-white hover:bg-slate-700"
                onClick={handleCloseMessage}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showConfirmation && (
        <div className="modal">
          <div className="modal-content">
            <p className="mb-3 font-semibold">
              Are you sure you want to delete all?
            </p>
            <div className="flex justify-end ">
              <button
                className="ml-2 rounded border border-slate-500 bg-slate-500 p-1 font-semibold text-white hover:bg-slate-700"
                onClick={handleCancelDeleteAll}
              >
                Cancel
              </button>
              <button
                className="ml-2 rounded border border-red-400 bg-red-500 p-1 font-semibold text-white hover:bg-red-700"
                onClick={handleConfirmDeleteAll}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="modal">
            <div className="modal-content">
              <p className="font-semibold">All cards are deleted.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
