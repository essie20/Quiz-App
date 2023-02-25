import { useState } from "react";
import CardCollectionList from "./components/CardCollectionList";



function App() {
  const [cardCollections, setCardCollections] = useState(sampleCardCollection)

  return (
    <div className="m-3">
      <CardCollectionList cardCollections={cardCollections} />
    </div>
  );
}

const sampleCardCollection = [
  {
    id: 1,
    name: "test1",
    cards: [
      {
        id: 1,
        frontContent: "hello",
        backContent: "hola"
      },
      {
        id: 2,
        frontContent: "front of card",
        backContent: "back of card"
      },
      {
        id: 3,
        frontContent: "thanks",
        backContent: "gracias"
      },
    ],
  },
  {
    id: 2,
    name: "test2",
    cards: [
      {
        id: 1,
        frontContent: "hello",
        backContent: "bonjour"
      },
      {
        id: 2,
        frontContent: "thanks",
        backContent: "merci"
      },
    ],
  },
];


export default App;