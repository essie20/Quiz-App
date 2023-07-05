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
  const [hoveredButton, setHoveredButton] = useState(null);
  const [hoveredDeleteButton, setHoveredDeleteButton] = useState(null);

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

  // const handleNameChange = (e) => {
  //   setInputValue(e.target.value);
  // };

  // const handleSaveClick = () => {
  //   setNewCollection((prevCollection) => ({
  //     ...prevCollection,
  //     name: inputValue,
  //   }));

  //   updateCollectionMutation.mutate({
  //     id: editingCollectionId,
  //     name: inputValue,
  //   });

  //   setEditingCollectionId(null);
  // };

  const handleButtonHover = (collectionId) => {
    setHoveredButton(collectionId);
  };

  const handleDeleteButtonHover = (collectionId) => {
    setHoveredDeleteButton(collectionId);
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
      <div className="flex h-60 flex-wrap gap-4 border border-2">
        {currentCollections
          ?.slice()
          .reverse()
          .map((collection) => (
            <div
              key={collection.id}
              className="box-border h-48 w-80 rounded-xl border border-2 border-gray-400 p-2 p-3 shadow-md shadow-gray-500"
            >
              <div className="rounded-xl border p-2 ">
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
                        className="bg-grey-100 ml-2 rounded-xl rounded border border-slate-400 p-2 text-xs font-semibold hover:bg-slate-50"
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
                    {collection.name}
                    <div className="bg-grey-100 ml-2 rounded-2xl rounded border border-slate-400 p-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                      <button
                        onClick={() =>
                          handleEditClick(collection.id, collection.name)
                        }
                      >
                        Edit
                        <FontAwesomeIcon icon={faEdit} className="ml-2" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex justify-end gap-1.5 text-sm ">
                <div className="bg-grey-700 relative mt-8 inline-block rounded-lg rounded border border-blue-700 p-2 font-semibold text-blue-700 hover:bg-blue-600 hover:text-white ">
                  <Link
                    to={"collections/" + collection.id.toString()}
                    // onClick={() => {
                    //   handleClick(new Date());
                    //   setClickedCollection(collection.id);
                    // }}
                    onMouseEnter={() => handleButtonHover(collection.id)}
                    onMouseLeave={() => setHoveredButton(null)}
                  >
                    <span className="flex items-center">
                      <FontAwesomeIcon className="pt-1" icon="book-open" />
                    </span>
                  </Link>
                  {hoveredButton === collection.id && (
                    <div className="absolute left-0 right-0 mt-2 w-11 whitespace-nowrap rounded-2xl border border-blue-500 bg-white p-1 text-xs text-black ">
                      Study
                    </div>
                  )}
                </div>
                <div className="mt-8">
                  <DeleteCollection
                    collectionId={collection.id}
                    deleteAllCards={deleteAllCards}
                    handleDeleteCollection={handleDeleteCollection}
                    isHovered={hoveredDeleteButton === collection.id}
                    onDeleteMouseEnter={() =>
                      handleDeleteButtonHover(collection.id)
                    }
                    onDeleteMouseLeave={() => setHoveredDeleteButton(null)}
                  />
                </div>
                <div className="hover:text-black-800 mt-8 rounded-lg rounded border border-slate-400 p-2 font-semibold text-black hover:bg-white ">
                  <Link
                    to={
                      "collections/" + collection.id.toString() + "/cards/edit"
                    }
                    onMouseEnter={() => handleButtonHover(collection.id)}
                    onMouseLeave={() => setHoveredButton(null)}
                  >
                    <FontAwesomeIcon icon={faEdit} className="p-0.5" />
                  </Link>
                  {hoveredButton === collection.id && (
                    <div className="absolute left-0 right-0 top-full mt-1 w-24 whitespace-nowrap rounded-lg border border-rose-500 bg-white p-2 text-xs text-black">
                      Edit
                    </div>
                  )}
                </div>
              </div>
              {/* {clickedCollection === collection.id.toString() && (
                <div className="mt-2 flex justify-end text-sm">{result}</div>
              )} */}
            </div>
          ))}
      </div>
    </div>
  );
}
