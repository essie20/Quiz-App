import React, { useState } from "react";

export default function Card({ card }) {
  const [flip, setFlip] = useState(false)
  return (
    <div
      onClick={() => setFlip(!flip)}
      className="
        border border-gray-500 shadow-md shadow-gray-400 mb-5 text-3xl text-center h-96 w-96 p-16 place-content-center justify-center">
        <div className="justify-center">
          {card.frontContent}
        </div>
    </div>
    
  )
}