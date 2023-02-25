import React from "react";
import CardList from "./CardList";


export default function CardCollectionList({ cardCollections }) {
  return (
    <div>
      {cardCollections.map((cardCollection, i) => {
        return (
          <div key={i} className="border border-gray-500 shadow-md shadow-gray-400 p-2 mb-5">
            <span className="font-bold">Card Name: {cardCollection.name}</span>
            <CardList cardCollection={cardCollection} />
          </div>
        )
      })}
    </div>
  )
}