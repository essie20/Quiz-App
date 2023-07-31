import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Collections from "./components/Collections";
import Cards from "./components/Cards";
import EditCollection from "./components/EditCollection";
import { useQuery } from "@tanstack/react-query";
import { getCollections } from "./api/quizData";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

library.add(faBook);

function App() {
  const collectionsQuery = useQuery({
    queryKey: ["getCollections"],
    queryFn: getCollections,
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="m-3">
      <div className="mb-3 block border-b border-gray-300 text-2xl font-semibold">
        <Link to={"/"}>
          Collections <FontAwesomeIcon icon={faBook} />
        </Link>
      </div>

      <Routes>
        <Route
          path="/"
          element={<Collections collections={collectionsQuery} />}
        />
        <Route path="/collections/:id" element={<Cards />} />
        <Route
          path="/collections/:id/cards/edit"
          element={<EditCollection collectionsQuery={collectionsQuery} />}
        />
      </Routes>
    </div>
  );
}

export default App;
