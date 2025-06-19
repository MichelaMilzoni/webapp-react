//* importo
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // Importa Link per il pulsante "Torna indietro"
import axios from "axios";

//* Importo i nuovi componenti riutilizzabili
import ReviewItem from "../components/ReviewItem";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import ReviewForm from "../components/ReviewForm";

//* funzione del componente:
function MovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshReviews, setRefreshReviews] = useState(0); // refresh

  const backendUrl = "http://localhost:3000";

  // Funzione per recuperare i dettagli del film e le recensioni
  const fetchMovie = () => {
    setLoading(true);
    setError(null);

    axios
      .get(`${backendUrl}/movies/${id}`)
      .then((response) => {
        setMovie(response.data);
      })
      .catch((err) => {
        console.error(`Errore nel recupero del film con ID ${id}:`, err);
        if (err.response && err.response.status === 404) {
          setError("Film non trovato.");
        } else {
          setError(
            "Impossibile caricare i dettagli del film. Assicurati che il backend sia in esecuzione."
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // useEffect per eseguire la chiamata API quando il componente viene montato, l'ID cambia o refreshReviews cambia
  useEffect(() => {
    if (id) {
      fetchMovie();
    }
  }, [id, refreshReviews]); // Aggiunto refreshReviews alle dipendenze

  // Funzione di callback per aggiornare le recensioni dopo l'invio del form
  const handleReviewAdded = () => {
    setRefreshReviews((prev) => prev + 1); // Incrementa lo stato per forzare useEffect a rifare la chiamata
  };

  return (
    <div className="container py-4">
      <Link to="/" className="btn btn-secondary mb-4">
        <svg
          className="bi bi-arrow-left me-2"
          fill="currentColor"
          width="1em"
          height="1em"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
          />
        </svg>
        Torna alla lista
      </Link>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && movie && (
        <div className="card shadow-lg mb-4">
          <div className="row g-0">
            <div className="col-md-4">
              <img
                src={`${backendUrl}/movies_cover/${movie.image}`}
                alt={movie.title}
                className="img-fluid rounded-start"
                style={{ height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/400x600/cccccc/333333?text=Immagine+non+disponibile";
                }}
              />
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h1 className="card-title display-5 fw-bold text-primary mb-3">{movie.title}</h1>
                <p className="card-text fs-5 mb-2">
                  <strong>Regista:</strong> {movie.director}
                </p>
                <p className="card-text fs-6 mb-2">
                  <strong>Genere:</strong> {movie.genre}
                </p>
                <p className="card-text fs-6 mb-3">
                  <strong>Anno di uscita:</strong> {movie.release_year}
                </p>
                <p className="card-text lead text-justify">{movie.abstract}</p>
              </div>
            </div>
          </div>

          <div className="card-body border-top">
            <h2 className="card-title h3 mb-4">Recensioni</h2>
            {movie.reviews && movie.reviews.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {movie.reviews.map((review) => (
                  <ReviewItem key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <p className="text-muted">Nessuna recensione disponibile per questo film.</p>
            )}

            {/* Inserisci il componente ReviewForm qui */}
            {/* Passa l'ID del film e la funzione di callback */}
            <ReviewForm movieId={id} onReviewAdded={handleReviewAdded} />
          </div>
        </div>
      )}
      {!loading && !error && !movie && (
        <p className="text-center text-secondary fs-5">Film non trovato.</p>
      )}
    </div>
  );
}

//* esporto il componente come default
export default MovieDetailPage;
