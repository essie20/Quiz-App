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

  const [currentCard, setCurrentCard] = useState({});
  const [flip, setFlip] = useState(false);
  const [disableAnimations, setDisableAnimations] = useState(false);

  useEffect(() => {
    if (!loading && cards?.length > 0) {
      setCurrentCard(cards[0]);
    }
  }, [cards, loading]);

  useEffect(() => {
    setDisableAnimations(true);
    setFlip(false);
    setTimeout(() => {
      setDisableAnimations(false);
    }, 400);
  }, [currentCard]);

  const getIndex = () => cards?.indexOf(currentCard);

  const handleNextCardClick = () => {
    if (getIndex() < cards?.length - 1) {
      setCurrentCard(cards[getIndex() + 1]);
    } else {
      setCurrentCard(cards[cards.length]);
    }
  };

  const handlePreviousCardClick = () => {
    if (getIndex() > 0) {
      setCurrentCard(cards[getIndex() - 1]);
    }
  };

  const handleStartAgainClick = () => {
    setCurrentCard(cards[0]);
  };

  if (cards) {
    return (
      <div className="p-4">
        <span>
          Card: {getIndex() + 1} / {cards?.length}
        </span>

        {currentCard ? (
          <div>
            <div className="flex justify-center">
              <div
                className={`card ${disableAnimations ? "" : "flip-effect"} ${
                  flip ? "flip" : ""
                }
              m-5 flex h-96 w-96 cursor-pointer select-none items-center justify-center border border-gray-500 p-16 text-center text-3xl shadow-md shadow-gray-400 hover:shadow-lg hover:shadow-gray-500`}
                onClick={() => setFlip(!flip)}
              >
                <div className="front">{currentCard.frontContent}</div>
                <div className="back absolute">{currentCard.backContent}</div>
              </div>
            </div>
            <div className="flex justify-center">
              {getIndex() !== 0 && (
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
            {getIndex() == 0 && (
              <div className="flex justify-center">
                <button
                  //onClick={handleClick}
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
