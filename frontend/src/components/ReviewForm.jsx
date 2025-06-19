import React, { useState } from "react";
import axios from "axios";

function ReviewForm({ movieId, onReviewAdded }) {
  // Stati per i campi del form
  const [name, setName] = useState("");
  const [vote, setVote] = useState(5); // Voto predefinito a 5
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false); // Stato per gestire l'invio (es. disabilitare il pulsante)
  const [apiError, setApiError] = useState(null); // Stato per gli errori API
  const [success, setSuccess] = useState(null); // Stato per i messaggi di successo

  // Nuovi stati per la validazione del form
  const [nameError, setNameError] = useState("");
  const [voteError, setVoteError] = useState("");
  const [textError, setTextError] = useState("");

  const backendUrl = "http://localhost:3000"; // URL del backend

  // Funzione per gestire l'invio del form
  const handleSubmit = (e) => {
    e.preventDefault(); // Previene il comportamento predefinito di ricarica della pagina del form

    // Resetta tutti gli errori prima di una nuova validazione/invio
    setApiError(null);
    setSuccess(null);
    setNameError("");
    setVoteError("");
    setTextError("");

    let isValid = true; // Flag per la validazione

    // Validazione del campo 'Nome'
    if (!name.trim()) {
      // .trim() rimuove spazi bianchi all'inizio e alla fine
      setNameError("Il nome è obbligatorio.");
      isValid = false;
    } else if (name.trim().length < 2) {
      setNameError("Il nome deve avere almeno 2 caratteri.");
      isValid = false;
    }

    // Validazione del campo 'Voto'
    if (isNaN(vote) || vote < 1 || vote > 5) {
      setVoteError("Il voto deve essere un numero tra 1 e 5.");
      isValid = false;
    }

    // Validazione del campo 'Recensione'
    if (!text.trim()) {
      setTextError("La recensione è obbligatoria.");
      isValid = false;
    } else if (text.trim().length < 10) {
      setTextError("La recensione deve avere almeno 10 caratteri.");
      isValid = false;
    }

    // Se la validazione fallisce, blocca l'invio
    if (!isValid) {
      return;
    }

    setSubmitting(true);

    const newReview = { name: name.trim(), vote: parseInt(vote), text: text.trim() };

    axios
      .post(`${backendUrl}/movies/${movieId}/reviews`, newReview)
      .then((response) => {
        setSuccess(response.data.message);
        setName("");
        setVote(5);
        setText("");

        if (onReviewAdded) {
          onReviewAdded();
        }
      })
      .catch((err) => {
        console.error("Errore durante l'invio della recensione:", err);
        setApiError(
          err.response?.data?.error || "Errore durante l'invio della recensione. Riprova."
        );
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  // Il rendering del form
  return (
    <div className="card p-4 mt-5 shadow-sm">
      {" "}
      {/* Bootstrap card */}
      <h4 className="card-title mb-3">Aggiungi una Recensione</h4>
      {success && <div className="alert alert-success">{success}</div>}
      {apiError && <div className="alert alert-danger">{apiError}</div>}{" "}
      {/* Usa apiError per gli errori di rete/server */}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Il tuo Nome
          </label>
          <input
            type="text"
            className={`form-control ${nameError ? "is-invalid" : ""}`} // Classe per errore Bootstrap
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => {
              // Validazione onBlur (quando l'utente esce dal campo)
              if (!name.trim()) setNameError("Il nome è obbligatorio.");
              else if (name.trim().length < 2)
                setNameError("Il nome deve avere almeno 2 caratteri.");
              else setNameError("");
            }}
            required
          />
          {nameError && <div className="invalid-feedback">{nameError}</div>}{" "}
          {/* Messaggio di errore */}
        </div>
        <div className="mb-3">
          <label htmlFor="vote" className="form-label">
            Voto (1-5)
          </label>
          <select
            className={`form-select ${voteError ? "is-invalid" : ""}`} // Classe per errore Bootstrap
            id="vote"
            value={vote}
            onChange={(e) => setVote(parseInt(e.target.value))}
            onBlur={() => {
              if (isNaN(vote) || vote < 1 || vote > 5)
                setVoteError("Il voto deve essere un numero tra 1 e 5.");
              else setVoteError("");
            }}
            required
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          {voteError && <div className="invalid-feedback">{voteError}</div>}{" "}
          {/* Messaggio di errore */}
        </div>
        <div className="mb-3">
          <label htmlFor="text" className="form-label">
            La tua Recensione
          </label>
          <textarea
            className={`form-control ${textError ? "is-invalid" : ""}`} // Classe per errore Bootstrap
            id="text"
            rows="3"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={() => {
              if (!text.trim()) setTextError("La recensione è obbligatoria.");
              else if (text.trim().length < 10)
                setTextError("La recensione deve avere almeno 10 caratteri.");
              else setTextError("");
            }}
            required
          ></textarea>
          {textError && <div className="invalid-feedback">{textError}</div>}{" "}
          {/* Messaggio di errore */}
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting} // Disabilita il pulsante durante l'invio
        >
          {submitting ? "Invio..." : "Invia Recensione"}
        </button>
      </form>
    </div>
  );
}

export default ReviewForm;
