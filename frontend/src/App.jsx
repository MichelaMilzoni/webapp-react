//* importo
import React from "react";
import { Routes, Route } from "react-router-dom";

//* importo le pagine
import HomePage from "./pages/HomePage";
import MovieDetailPage from "./pages/MovieDetailPage";

function App() {
  return (
    <Routes>
      {/* rotta per la pagina Home */}
      <Route path="/" element={<HomePage />} />

      {/* rotta per la pagina di dettaglio di un singolo film */}
      {/* :id è un parametro dinamico che catturerà l'ID del film dall'URL */}
      <Route path="/movies/:id" element={<MovieDetailPage />} />
    </Routes>
  );
}

export default App;
