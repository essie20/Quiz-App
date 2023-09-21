import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  deleteCollection,
  saveCollection,
  deleteAllCards,
} from "../api/quizData";
import { useMutation } from "@tanstack/react-query";
import CreateCollection from "./CreateCollection";
import DeleteCollection from "./DeleteCollection";
import {
  faEdit,
  faBookOpen,
  faTrash,
  faPlus,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ToolTip from "./Tooltip";

library.add(faEdit, faBookOpen, faTrash, faPlus, faCheck);

export default function Collections({ collections }) {
  const [currentCollections, setCurrentCollections] = useState(
    collections.data
  );
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [editingCollectionId, setEditingCollectionId] = useState(null);
  const [newCollection, setNewCollection] = useState({ id: "", name: "" });
  const inputRef = useRef(null);
  const [showInput, setShowInput] = useState(false);

  const inputClassName = errorMessage
    ? "w-40 rounded p-1 outline-1 outline-red-500 border-2 border-gray-400"
    : "w-40 rounded p-1 outline-1 outline-indigo-300 border-2 border-gray-400";

  useEffect(() => {
    setCurrentCollections(collections.data);
  }, [collections.data]);

  useEffect(() => {
    if (errorMessage) {
      inputRef.current.focus();
    }
  }, [errorMessage]);

  const updateCollectionMutation = useMutation({
    mutationFn: saveCollection,
    onSuccess: () => {
      // Invalidate and refetch
      collections.refetch();
    },
  });

  const deleteCollectionMutation = useMutation({
    mutationFn: deleteCollection,
    onSuccess: () => {
      // Invalidate and refetch
      collections.refetch();
    },
  });

  const handleDeleteCollection = deleteCollectionMutation.mutate;

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
      setErrorMessage("Please enter between 3 and 18 characters.");
      return;
    }

    updateCollectionMutation.mutate({
      id: editingCollectionId,
      name: inputValue,
    });

    setEditingCollectionId(null);
    setNewCollection({ name: "" });
    setInputValue("");
    setErrorMessage("");
  };

  const handleNewClick = () => {
    setShowInput(true);
  };

  const handleCancelCreateCollection = () => {
    setShowInput(false);
  };

  const handleEditClick = (collectionId, collectionName) => {
    setEditingCollectionId(collectionId);
    setInputValue(collectionName);
  };

  if (collections.isLoading || collections.isRefetching)
    return <div>Loading...</div>;
  return (
    <div>
      <div className="flex flex-wrap">
        {showInput ? (
          <div></div>
        ) : (
          <div className="mb-6 mt-3 w-40 rounded-3xl border border-green-400 bg-green-500 p-1.5 font-semibold text-white hover:bg-green-400">
            <button onClick={handleNewClick}>
              <FontAwesomeIcon icon={faPlus} className="font-white mr-2 ml-2" />
              New Collection
            </button>
          </div>
        )}
        {showInput && (
          <div className="mt-8">
            <CreateCollection
              saveCollection={updateCollectionMutation.mutate}
              onCancel={handleCancelCreateCollection}
            />
          </div>
        )}
      </div>
      <div className="flex h-60 flex-wrap gap-4 border-2">
        {currentCollections
          ?.slice()
          .reverse()
          .map((collection) => (
            <div
              key={collection.id}
              className="box-border flex h-48 w-80 flex-col rounded-xl border-2 border-gray-400 p-3 shadow-md shadow-gray-500"
            >
              <div className="flex-grow rounded-xl border p-2">
                {editingCollectionId === collection.id ? (
                  <div className="m-1 flex items-center justify-center">
                    <form onSubmit={handleSubmit}>
                      <input
                        type="text"
                        className={inputClassName}
                        placeholder="Collection name"
                        value={inputValue}
                        onChange={handleChange}
                        ref={inputRef}
                      />

                      <button
                        type="submit"
                        className="bg-grey-100 ml-2 rounded border border-slate-400 p-2 text-xs font-semibold hover:bg-slate-50"
                      >
                        <FontAwesomeIcon
                          icon={faCheck}
                          className="pl-0.5 pr-0.5"
                        />
                      </button>
                      {errorMessage && (
                        <div className="text-red-500">{errorMessage}</div>
                      )}
                    </form>
                  </div>
                ) : (
                  <div className="flex items-center p-3 text-lg font-bold">
                    <button
                      onClick={() =>
                        handleEditClick(collection.id, collection.name)
                      }
                    >
                      {collection.name}
                      <FontAwesomeIcon
                        icon={faEdit}
                        className="ml-2"
                        size="xs"
                        color="gray"
                      />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-1.5 text-sm">
                <ToolTip
                  className={
                    "mt-4 rounded border border-black bg-white p-1 text-xs text-black"
                  }
                  containerClassName={
                    "h-10 rounded border border-blue-700 p-2 font-semibold text-blue-700 hover:bg-blue-600 hover:text-white"
                  }
                  tooltip={"Study"}
                >
                  <Link to={"collections/" + collection.id.toString()}>
                    <span className="flex items-center">
                      <FontAwesomeIcon className="pt-1" icon="book-open" />
                    </span>
                  </Link>
                </ToolTip>

                <ToolTip
                  className={
                    "mt-2 rounded border border-black bg-white p-1 text-xs text-black"
                  }
                  containerClassName={
                    "h-10 rounded border border-red-400 font-semibold text-rose-600 hover:bg-red-600 hover:text-white"
                  }
                  tooltip={"Delete"}
                >
                  <DeleteCollection
                    collectionId={collection.id}
                    deleteAllCards={deleteAllCards}
                    handleDeleteCollection={handleDeleteCollection}
                  />
                </ToolTip>

                <ToolTip
                  className={
                    "mt-4 rounded border border-black bg-white p-1 text-xs text-black"
                  }
                  containerClassName={
                    "h-10 hover:text-black-800 rounded border border-slate-400 p-2 font-semibold text-black hover:bg-white"
                  }
                  tooltip={"Edit"}
                >
                  <Link
                    to={
                      "collections/" + collection.id.toString() + "/cards/edit"
                    }
                  >
                    <FontAwesomeIcon icon={faEdit} className="p-0.5" />
                  </Link>
                </ToolTip>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
