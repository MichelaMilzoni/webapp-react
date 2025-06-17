//* Creo la funzione errorHandler
// Questa funzione è un middleware speciale di Express che gestisce gli errori. 
// Prende quattro parametri: err, req, res, next.
function errorHandler(err, req, res, next) {
    // Stampo l'errore in console
    console.error('Errore catturato dal middleware di gestione errori:', err.message);

    // Imposto lo status code dell'errore: se non è già definito uso 500 (Internal Server Error)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);

    // Invio una risposta JSON con il messaggio di errore.
    res.json({
        message: err.message
    });
}

//* funzione Internal Server Error (500) pensata per essere usata nei controller/servizi quando un'operazione fallisce
function sendServerError(res, message) {
    console.error('Errore del server:', message);
    res.status(500).json({ error: message || 'Errore interno del server' });
}

//* funzione NOT FOUND (404) pensata per essere usata nei controller quando una risorsa non viene trovata
function sendNotFoundError(res, message) {
    res.status(404).json({ error: message || 'Risorsa non trovata' });
}

//* Esporto il middleware per poterlo usare in app.js
module.exports = {
    errorHandler,
    sendServerError,
    sendNotFoundError
};
