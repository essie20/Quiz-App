import React, { useState, useRef, useEffect } from "react";

export default function CreateCollection({ saveCollection, onCancel }) {
  const [newCollection, setNewCollection] = useState({ name: "" });
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (errorMessage) {
      inputRef.current.focus();
    }
  }, [errorMessage]);

  const handleChange = (event) => {
    setNewCollection({ ...newCollection, name: event.target.value });

    const value = event.target.value;
    setInputValue(value);
    setErrorMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (inputValue.trim() === "") {
      setErrorMessage("Input cannot be empty.");
      return;
    }

    if (inputValue.length < 3 || inputValue.length > 18) {
      setErrorMessage("Input length should be between 3 and 18 characters.");
      return;
    }
    if (newCollection.name.trim()) {
      saveCollection(newCollection);
    }

    setNewCollection({ name: "" });
    setInputValue("");
    setErrorMessage("");
  };

  const inputClassName = errorMessage
    ? "w-96 rounded p-1 outline-1 outline-red-500"
    : "w-96 rounded p-1 outline-1 outline-indigo-300";

  return (
    <div>
      <div className="mb-7 rounded-md border-2 border-gray-400 p-1.5">
        <form onSubmit={handleSubmit}>
          <div className="mb-4 border-b border-gray-300 text-xl font-bold">
            New Collection
          </div>
          <div className="mt-2">
            <div className="mb-1">Collection Name*</div>
            <div>
              <input
                type="text"
                className={inputClassName}
                placeholder="Collection name"
                value={inputValue}
                onChange={handleChange}
                ref={inputRef}
              />
            </div>
          </div>
          <div className="mb-1 mt-3 flex justify-end border-t border-gray-300 text-sm">
            <button
              className="mt-3 mr-1 rounded border border-red-400 bg-red-500 p-1.5 font-semibold text-white hover:bg-red-400"
              onClick={() => {
                setNewCollection({ name: "" });
                setInputValue("");
                setErrorMessage("");
                onCancel();
              }}
            >
              Cancel
            </button>
            <button
              className="mt-3 rounded border border-green-400 bg-green-500 p-1.5 font-semibold text-white hover:bg-green-400"
              type="submit"
            >
              Create
            </button>
          </div>
        </form>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </div>
    </div>
  );
}
