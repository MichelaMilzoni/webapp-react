//* importo
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

//* Importo i nuovi componenti riutilizzabili
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

//* funzione del componente:
function HomePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = "http://localhost:3000";

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get(`${backendUrl}/movies`)
      .then((response) => {
        setMovies(response.data);
      })
      .catch((err) => {
        console.error("Errore nel recupero dei film:", err);
        setError("Impossibile caricare i film. Assicurati che il backend sia in esecuzione.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="container py-4">
      {" "}
      {/* Contenitore Bootstrap */}
      <h1 className="text-center my-4 display-4 fw-bold text-primary">I Nostri Film</h1>{" "}
      {/* Titolo centrato */}
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {" "}
          {/* Griglia responsive Bootstrap */}
          {movies.length > 0 ? (
            movies.map((movie) => (
              <div className="col" key={movie.id}>
                {" "}
                {/* Colonna per ogni card */}
                <MovieCard movie={movie} backendUrl={backendUrl} />
              </div>
            ))
          ) : (
            <p className="text-center col-12 text-secondary fs-5">Nessun film trovato.</p>
          )}
        </div>
      )}
    </div>
  );
}

//* esporto il componente come default
export default HomePage;
