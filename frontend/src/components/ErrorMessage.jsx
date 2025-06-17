import React from "react";

/**
 * Componente ErrorMessage: Visualizza un messaggio di errore.
 * @param {object} props.message - Il messaggio di errore da visualizzare.
 */
function ErrorMessage({ message }) {
  return (
    <div className="alert alert-danger" role="alert">
      {" "}
      {/* Alert di errore Bootstrap */}
      <strong>Errore:</strong> {message}
    </div>
  );
}

export default ErrorMessage;
