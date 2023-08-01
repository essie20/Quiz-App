import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/",
  timeout: 5000,
});

export async function getCollections() {
  const res = await instance.get("/collections");
  return res.data;
}

export async function deleteCollection(collectionId) {
  const res = await instance.delete(`/collections/${collectionId}`);
  return res.data;
}

export async function saveCollection(collection) {
  if (collection.id) {
    const res = await instance.put(`/collections/${collection.id}`, collection);
    return res.data;
  } else {
    const res = await instance.post(`/collections`, collection);
    res.data.newCollection = true;
    return res.data;
  }
}

export async function getCards(collectionId) {
  const res = await instance.get(`/cards/${collectionId}`);
  return res.data;
}
export async function saveCard(card) {
  console.log("saving", card);
  if (card.id) {
    //ID means we should update (put)
    const res = await instance.put(`/cards/${card.id}`, card);
    return res.data;
  } else {
    //no ID means we should create (post)
    const res = await instance.post(`/cards`, card);
    return res.data;
  }
}
export async function deleteCard(cardId) {
  const res = await instance.delete(`/cards/${cardId}`);
  return res.data;
}

export async function deleteAllCards(collectionId) {
  const res = await instance.delete(`/collections/${collectionId}/cards`);
  return res.data;
}
