import React, { useState } from "react";

export default function EditCard({
  deleteCard,
  cardId,
  inputCard,
  saveCard,
  SetCards,
  cards,
}) {
  const [editingCard, setEditingCard] = useState(inputCard);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFrontChange = (event) => {
    const value = event.target.value;
    //setEditingCard({ ...editingCard, frontContent: value });
    let newCards = [...cards];

    newCards.forEach((card) => {
      if (card.id == inputCard.id) {
        card.frontContent = value;
      }
    });
    SetCards(newCards);
    setErrorMessage("");
  };

  const handleBackChange = (event) => {
    const value = event.target.value;
    //setEditingCard({ ...editingCard, backContent: value });
    SetCards([...cards, { ...inputCard, backContent: value }]);
    setErrorMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      editingCard.frontContent.trim() === "" ||
      editingCard.backContent.trim() === ""
    ) {
      setErrorMessage("Input cannot be empty.");
      return;
    }

    if (
      editingCard.frontContent.length < 2 ||
      editingCard.frontContent.length > 10 ||
      editingCard.backContent.length < 2 ||
      editingCard.backContent.length > 10
    ) {
      setErrorMessage("Input length should be between 2 and 10 characters.");
      return;
    }

    saveCard(editingCard);

    // Reset the editing card state and error message
    setEditingCard({ frontContent: "", backContent: "" });
    setErrorMessage("");
  };

  const inputClassName = errorMessage
    ? "w-max rounded p-1 outline-1 outline-red-500"
    : "w-max rounded p-1 outline-1 outline-indigo-300";

  return (
    <form onSubmit={handleSubmit}>
      <div className="m-2 rounded-md border border-gray-700 p-4 shadow-md">
        <div className="mb-4 grid">
          <label className="inline-block w-max">Front</label>
          <input
            type="text"
            className={inputClassName}
            placeholder="Front text"
            value={editingCard.frontContent}
            onChange={handleFrontChange}
          />

          <label className="inline-block w-max">Back</label>
          <input
            type="text"
            className={inputClassName}
            placeholder="Back text"
            value={editingCard.backContent}
            onChange={handleBackChange}
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => {
              deleteCard(cardId);
            }}
            className="ml-2 rounded border border-red-400 bg-red-200 p-1 hover:bg-red-500"
          >
            Delete
          </button>
        </div>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </div>
    </form>
  );
}
