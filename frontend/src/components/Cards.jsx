import React, { useState, useEffect } from "react";
import { getCards } from "../api/quizData";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  faArrowRight,
  faArrowLeft,
  faShuffle,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

library.add(faArrowRight, faArrowLeft, faShuffle);

export default function Cards() {
  const { id } = useParams();

  const collectionCardsQuery = useQuery(["cards"], () => {
    return getCards(id);
  });

  const cards = collectionCardsQuery.data;
  const loading = collectionCardsQuery.isLoading;

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flip, setFlip] = useState(false);
  const [disableAnimations, setDisableAnimations] = useState(false);
  const [shuffledCards, setShuffledCards] = useState(cards);

  const shuffleCards = () => {
    setShuffledCards([...cards].sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
    if (!loading && cards?.length > 0) {
      setCurrentCardIndex(0);
    }
  }, [cards, loading]);

  useEffect(() => {
    setDisableAnimations(true);
    setFlip(false);
    setTimeout(() => {
      setDisableAnimations(false);
    }, 400);
  }, []);

  const handleNextCardClick = () => {
    if (currentCardIndex < cards?.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setCurrentCardIndex(-1);
    }
  };

  const handlePreviousCardClick = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const handleStartAgainClick = () => {
    setCurrentCardIndex(0);
  };

  if (cards) {
    return (
      <div className="p-4">
        <span>
          Card: {currentCardIndex + 1} / {cards?.length}
        </span>

        {shuffledCards[currentCardIndex] ? (
          <div>
            <div className="flex justify-center">
              <div
                className={`card ${disableAnimations ? "" : "flip-effect"} ${
                  flip ? "flip" : ""
                }
              m-5 flex h-96 w-96 cursor-pointer select-none items-center justify-center border border-gray-500 p-16 text-center text-3xl shadow-md shadow-gray-400 hover:shadow-lg hover:shadow-gray-500`}
                onClick={() => setFlip(!flip)}
              >
                <div className="front">
                  {shuffledCards[currentCardIndex].frontContent}
                </div>
                <div className="back absolute">
                  {shuffledCards[currentCardIndex].backContent}
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              {currentCardIndex !== 0 && (
                <button
                  onClick={handlePreviousCardClick}
                  className="m-1 rounded border border-indigo-300 bg-indigo-200 p-1.5 hover:bg-indigo-300"
                >
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    className="text-xl text-indigo-700"
                  />
                </button>
              )}

              <button
                onClick={handleNextCardClick}
                className="m-1 rounded border border-indigo-300 bg-indigo-200 p-1.5 hover:bg-indigo-300"
              >
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="text-xl text-indigo-700"
                />
              </button>
            </div>
            {currentCardIndex == 0 && (
              <div className="flex justify-center">
                <button
                  onClick={shuffleCards}
                  className="m-1 mt-2 rounded-full border border-green-300 bg-green-500 p-1.5 pl-5 pr-5 text-white hover:bg-green-400"
                >
                  <FontAwesomeIcon
                    icon={faShuffle}
                    className="text-xl text-white"
                  />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex justify-center font-bold">
              <div className="hover:shadow-gray-500` m-5 flex h-96 w-96 cursor-pointer select-none items-center justify-center border border-gray-500 p-16 text-center text-3xl shadow-md shadow-gray-400 hover:shadow-lg">
                Done!
              </div>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleStartAgainClick}
                className="m-1 rounded border border-indigo-300 bg-indigo-200 p-1 font-bold text-blue-700 hover:bg-indigo-300"
              >
                Start again?
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}
