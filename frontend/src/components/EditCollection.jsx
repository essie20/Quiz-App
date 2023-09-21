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
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

library.add(faFloppyDisk);

export default function EditCollection({ collectionsQuery }) {
  const queryClient = useQueryClient();
  const { id } = useParams();

  const [currentCollection, setCurrentCollection] = useState(
    collectionsQuery.data?.find((collection) => collection.id == id)
  );

  const [newCards, setNewCards] = useState([]);

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

  const [cards, setCards] = useState(collectionCardsQuery.data);

  useEffect(() => {
    setCards(collectionCardsQuery.data);
  }, [collectionCardsQuery.data]);

  const saveAllCards = (e) => {
    cards.concat(newCards).forEach((card) => {
      if (card.dirty && !card.invalid) {
        updateCardMutation.mutate(card);
      }
    });
  };

  const updateCardMutation = useMutation({
    mutationFn: saveCard,
    onSuccess: (result) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      // remove the saved card from the list of new cards
      setNewCards([]);
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
          deleteAllCards={() => {
            if (cards.length) deleteAllCardsMutation.mutate(id);
            setNewCards([]);
          }}
          cards={cards.concat(newCards)}
          deleteMutation={deleteCardMutation}
        />
        <button
          type="button"
          className="ml-2 rounded border border-green-400 bg-green-200 p-1 hover:bg-green-500"
          onClick={saveAllCards}
        >
          Save All
          <FontAwesomeIcon className="ml-2" icon="floppy-disk" />
        </button>
      </div>

      <div className="flex flex-wrap">
        {cards?.map((card) => {
          return (
            <EditCard
              cardToEdit={card}
              setCards={setCards}
              cards={cards}
              cardId={card.id}
              key={card.id}
              deleteCardMutation={deleteCardMutation}
            />
          );
        })}

        {newCards?.map((card) => {
          return (
            <EditCard
              cardToEdit={card}
              setCards={setNewCards}
              cards={newCards}
              cardId={card.id}
              key={newCards.indexOf(card)}
              deleteCardMutation={deleteCardMutation}
            />
          );
        })}

        <button
          className="m-2 h-[13rem] w-[13rem] rounded-md border border-gray-700 p-4 pb-8 shadow-md duration-300 ease-in-out hover:scale-110"
          onClick={() => {
            setNewCards([
              ...newCards,
              {
                frontContent: "",
                backContent: "",
                collectionId: id,
                dirty: true,
              },
            ]);
            setShowMsg(false);
          }}
        >
          <div className="text-7xl">+</div>
        </button>
      </div>
    </>
  );
}
