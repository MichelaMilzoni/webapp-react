import React from "react";

/**
 * Componente LoadingSpinner: Visualizza un messaggio di caricamento.
 * Puoi aggiungere qui un'animazione CSS più complessa.
 */
function LoadingSpinner() {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "200px" }}
    >
      <div className="spinner-border text-primary" role="status">
        {" "}
        {/* Spinner Bootstrap */}
        <span className="visually-hidden">Caricamento...</span>
      </div>
      <p className="ms-3 text-secondary">Caricamento...</p>
    </div>
  );
}

export default LoadingSpinner;
