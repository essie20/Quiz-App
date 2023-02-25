import React from "react";
import Card from "./Card";

export default function CardCollectionList({ cardCollection }) {
  return (
    <div>
      <div className="flex justify-center">
        {
          cardCollection.cards.map((card, i) => {
            return <Card card={card} key={i}/>
          })
        }
      </div>
    </div>
    
  )
}