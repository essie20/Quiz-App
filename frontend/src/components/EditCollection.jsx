import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import EditCard from "./EditCard";
import DeleteAllCards from "./DeleteAllCards";
import {
  getCards,
  saveCard,
  deleteCard,
  deleteAllCards,
} from "../api/quizData";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function EditCollection({ collectionsQuery }) {
  const queryClient = useQueryClient();
  const { id } = useParams();

  const [currentCollection, setCurrentCollection] = useState(
    collectionsQuery.data?.find((collection) => collection.id == id)
  );
  const [newCard, setNewCard] = useState();

  useEffect(() => {
    setCurrentCollection(
      collectionsQuery.data?.find((collection) => collection.id == id)
    );
  }, [collectionsQuery.data]);

  const collectionCardsQuery = useQuery(["cards"], () => {
    return getCards(id);
  });

  const [cards, SetCards] = useState([collectionCardsQuery.data]);

  const updateCardMutation = useMutation({
    mutationFn: saveCard,
    onSuccess: (result) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      if (result.newCard) {
        setNewCard(null); //clear (react useState) new card if it was saved
      }
    },
  });

  const deleteCardMutation = useMutation({
    mutationFn: deleteCard,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });

  const deleteAllCardsMutation = useMutation({
    mutationFn: deleteAllCards,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });

  const [showMsg, setShowMsg] = useState(false);

  if (
    collectionCardsQuery.isLoading ||
    collectionsQuery.isLoading ||
    collectionCardsQuery.isRefetching ||
    collectionsQuery.isRefetching
  )
    return <div>Loading...</div>;
  return (
    <>
      <div className="mb-3 flex">
        <div className="mr-2 mt-1 text-xl font-semibold">
          {currentCollection?.name}
        </div>

        <DeleteAllCards
          collectionId={id}
          deleteAllCards={deleteAllCardsMutation.mutate}
          cards={collectionCardsQuery.data}
          deleteMutation={deleteCardMutation}
        />
        <button
          type="submit"
          className="ml-2 rounded border border-green-400 bg-green-200 p-1 hover:bg-green-500"
        >
          Save All
        </button>
      </div>

      <div className="flex flex-wrap">
        {collectionCardsQuery.data.map((card) => {
          return (
            <EditCard
              inputCard={card}
              deleteCard={deleteCardMutation.mutate}
              saveCard={updateCardMutation.mutate}
              cardId={card.id}
              key={card.id}
            />
          );
        })}
        {/* This is for new UNSAVED card (doesn't have an id) */}
        {newCard ? (
          <EditCard
            inputCard={newCard}
            deleteCard={() => {
              setNewCard(null);
            }}
            saveCard={updateCardMutation.mutate}
          />
        ) : null}
        <button
          className="m-2 rounded-md border border-gray-700 p-4 pb-8 shadow-md duration-300 ease-in-out hover:scale-110"
          onClick={() => {
            setNewCard({
              frontContent: "",
              backContent: "",
              collectionId: id,
            });
            setShowMsg(false);
          }}
        >
          <div className="text-7xl">+</div>
          Add new card
        </button>
      </div>
    </>
  );
}
