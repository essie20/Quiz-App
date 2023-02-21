import { useState } from "react";

function App() {
  const sampleCardCollection = {
    name: "test",
    cards: [
      {
        frontContent: "hello",
        backContent: "hola",
      },
      {
        frontContent: "front of card",
        backContent: "back of card",
      },
    ],
  };

  const collections = [sampleCardCollection];

  return <div className="m-3"></div>;
}

export default App;
