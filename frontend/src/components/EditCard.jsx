import React, { useState } from "react";

export default function EditCard({
  cardToEdit,
  setCards,
  cards,
  deleteCardMutation,
}) {
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event, side) => {
    const value = event.target.value;
    let editedCards = [...cards];

    let targetCard = editedCards.find((card) => {
      if (cardToEdit.id && card.id == cardToEdit.id) {
        return card;
      } else if (cards.indexOf(cardToEdit) == editedCards.indexOf(card)) {
        return card;
      }
    });

    targetCard[side] = value;
    targetCard.dirty = true;

    setErrorMessage("");
    targetCard.invalid = false;

    if (
      cardToEdit.frontContent.trim() === "" ||
      cardToEdit.backContent.trim() === ""
    ) {
      targetCard.invalid = true;
      setErrorMessage("Input cannot be empty.");
    }

    if (
      cardToEdit.frontContent.length < 2 ||
      cardToEdit.frontContent.length > 10 ||
      cardToEdit.backContent.length < 2 ||
      cardToEdit.backContent.length > 10
    ) {
      targetCard.invalid = true;
      setErrorMessage("Input length should be between 2 and 10 characters.");
    }

    setCards(editedCards);
  };

  const inputClassName = errorMessage
    ? "w-max rounded p-1 outline-1 outline-red-500"
    : "w-max rounded p-1 outline-1 outline-indigo-300";

  return (
    <div
      className={`m-2 max-w-[14rem] rounded-md border  ${
        cardToEdit.dirty ? "border-gray-600" : "border-blue-600"
      } p-4 shadow-md`}
    >
      <div className="mb-2 grid">
        <label className="inline-block w-max">Front</label>
        <input
          type="text"
          className={inputClassName}
          placeholder="Front text"
          value={cardToEdit.frontContent}
          onChange={(event) => {
            handleChange(event, "frontContent");
          }}
        />

        <label className="inline-block w-max">Back</label>
        <input
          type="text"
          className={inputClassName}
          placeholder="Back text"
          value={cardToEdit.backContent}
          onChange={(event) => {
            handleChange(event, "backContent");
          }}
        />
      </div>
      {errorMessage && (
        <div className="text-sm font-light text-red-500">{errorMessage}</div>
      )}

      <div className="flex justify-end pt-2">
        <button
          onClick={() => {
            if (!cardToEdit.id) {
              let i = cards.indexOf(cardToEdit);
              let newCards = [...cards];
              newCards.splice(i, 1);
              setCards(newCards);
            } else {
              deleteCardMutation.mutate(cardToEdit.id);
            }
          }}
          className="ml-2 rounded border border-red-400 bg-red-200 p-1 hover:bg-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
