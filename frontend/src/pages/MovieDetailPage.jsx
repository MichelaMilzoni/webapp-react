//* importo React
import React from "react";

// Per la pagina di dettaglio, bisogna accedere al parametro id dall'URL,
// quindi importo un hook di React Router Dom
import { useParams } from "react-router-dom";

//* funzione del componente:
function MovieDetailPage() {
  // utilizzo useParams per ottenere l'ID del film:
  const { id } = useParams();
  return (
    <div>
      <h1>Dettaglio Film: ID {id}</h1>
      <p>Qui verranno visualizzati i dettagli e le recensioni del film.</p>
    </div>
  );
}

//* esporto il componente come default
export default MovieDetailPage;
