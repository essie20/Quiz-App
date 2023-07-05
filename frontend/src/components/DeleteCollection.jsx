import React, { useState } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";

library.add(faTrash);

export default function DeleteCollection({
  collectionId,
  deleteAllCards,
  handleDeleteCollection,
  onDeleteMouseEnter,
  onDeleteMouseLeave,
  isHovered,
}) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [showDeleteMessage, setShowDeleteMessage] = useState(false);

  const handleDelete = () => {
    setShowConfirmation(true);
  };

  const handleConfirmDelete = () => {
    setShowConfirmation(false);
    setShowDeleteMessage(true);

    setTimeout(() => {
      deleteAllCards(collectionId);
      handleDeleteCollection(collectionId);
      setShowDeleteMessage(false);
    }, 1000);
  };
  const handleCancelDelete = () => {
    // Reset the confirmation box state
    setShowConfirmation(false);
    setShowDeleteMessage(false);
  };
  const [isHoveredButton, setIsHoveredButton] = useState(isHovered);

  useEffect(() => {
    setIsHoveredButton(isHovered);
  }, [isHovered]);
  return (
    <div className="relative">
      <div className="rounded-lg rounded border border-red-400 font-semibold text-rose-600 hover:bg-red-600 hover:text-white">
        <button
          onClick={handleDelete}
          className="p-2"
          onMouseEnter={onDeleteMouseEnter}
          onMouseLeave={onDeleteMouseLeave}
        >
          <FontAwesomeIcon className="" icon="trash" />
        </button>
      </div>
      {isHoveredButton && (
        <div className="absolute bottom-0 left-0 right-0 mb-8 w-11 w-24 whitespace-nowrap rounded-2xl border border-rose-500 bg-white p-1 text-xs text-black">
          Delete
        </div>
      )}

      {showConfirmation && (
        <div className="modal">
          <div className="modal-content">
            <p className="mb-3 font-semibold">
              Are you sure you want to delete the collection?
            </p>
            <div className="flex justify-end ">
              <button
                className="ml-2 rounded border border-slate-500 bg-slate-500 p-1 font-semibold text-white hover:bg-slate-700"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                className="ml-2 rounded border border-red-400 bg-red-500 p-1 font-semibold text-white hover:bg-red-700"
                onClick={handleConfirmDelete}
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
              <p className="font-semibold">The collection is deleted.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
