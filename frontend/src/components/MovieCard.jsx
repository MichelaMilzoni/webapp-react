import React from "react";
import { Link } from "react-router-dom";

/**
 * Componente MovieCard: Visualizza una singola card di un film.
 * Riceve i dati del film e l'URL del backend tramite props.
 * @param {object} props.movie - L'oggetto film contenente id, title, director, release_year, image.
 * @param {string} props.backendUrl - L'URL base del backend per caricare le immagini.
 */
function MovieCard({ movie, backendUrl }) {
  return (
    // Il componente è un link che porta alla pagina di dettaglio del film
    <Link to={`/movies/${movie.id}`} className="text-decoration-none text-dark">
      <div className="card shadow-sm h-100">
        {" "}
        {/* card Bootstrap, ombra, altezza 100% */}
        {/* Immagine della copertina del film */}
        <img
          src={`${backendUrl}/movies_cover/${movie.image}`}
          alt={movie.title}
          className="card-img-top" // Classe Bootstrap per immagini in cima alla card
          style={{ height: "300px", objectFit: "cover" }} // Stile inline per altezza e fit
          // Gestione dell'errore di caricamento dell'immagine, mostra un placeholder
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/400x600/cccccc/333333?text=Immagine+non+disponibile";
          }}
        />
        {/* Dettagli del film */}
        <div className="card-body">
          {" "}
          {/* Corpo della card Bootstrap */}
          <h5 className="card-title text-truncate">{movie.title}</h5> {/* Titolo card, troncato */}
          <p className="card-text text-muted mb-0">{movie.director}</p>{" "}
          {/* Testo card, testo muted */}
          <p className="card-text text-muted">{movie.release_year}</p>
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;
