import React from "react";

/**
 * Componente ReviewItem: Visualizza una singola recensione di un film.
 * Riceve i dati della recensione tramite props.
 * @param {object} props.review - L'oggetto recensione contenente name, vote, text.
 */
function ReviewItem({ review }) {
  return (
    <div className="card mb-3 shadow-sm">
      {" "}
      {/* card Bootstrap con margine inferiore e ombra */}
      <div className="card-body">
        {" "}
        {/* Corpo della card */}
        <h6 className="card-subtitle mb-2 text-muted">
          {review.name}
          {/* Visualizza le stelle in base al voto (esempio con caratteri Unicode) */}
          <span className="text-warning ms-2">
            {"★".repeat(review.vote)}
            {"☆".repeat(5 - review.vote)}
          </span>
        </h6>
        <p className="card-text">"{review.text}"</p> {/* Testo della recensione */}
      </div>
    </div>
  );
}

export default ReviewItem;
