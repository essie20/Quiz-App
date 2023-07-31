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
  console.log("id", id);

  const [currentCollection, setCurrentCollection] = useState(
    collectionsQuery.data?.find((collection) => collection.id == id)
  );
  console.log("collectionQuery.data", collectionsQuery.data);
  console.log("currentCollection", currentCollection);

  const [newCard, setNewCard] = useState();

  useEffect(() => {
    setCurrentCollection(
      collectionsQuery.data?.find((collection) => collection.id == id)
    );
  }, [collectionsQuery.data]);

  const collectionCardsQuery = useQuery({
    queryKey: ["cards"],
    queryFn: () => {
      return getCards(id);
    },
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });
  console.log("collectionCardsQuery.data", collectionCardsQuery.data);
  console.log("getCards", getCards(id));
  console.log("collectionCardsQuery.data2", collectionCardsQuery.data);

  const [cards, SetCards] = useState(collectionCardsQuery.data);

  useEffect(() => {
    SetCards(collectionCardsQuery.data);
  }, [collectionCardsQuery.data]);

  const saveAllCards = (e) => {
    console.log(cards);
    cards.forEach((card) => {
      if (card.dirty) {
      }
    });
  };

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
          cards={cards}
          deleteMutation={deleteCardMutation}
        />
        <button
          type="button"
          className="ml-2 rounded border border-green-400 bg-green-200 p-1 hover:bg-green-500"
          onClick={saveAllCards}
        >
          Save All
        </button>
      </div>

      <div className="flex flex-wrap">
        {cards?.map((card) => {
          return (
            <EditCard
              inputCard={card}
              SetCards={SetCards}
              cards={cards}
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
            SetCards={SetCards}
            cards={cards}
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
