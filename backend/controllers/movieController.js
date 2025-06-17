//* Importo la funzione per ottenere una connessione al database
const { getConnection } = require('../config/db');
//* Importo le funzioni degli errori 404 e 500
const { sendServerError, sendNotFoundError } = require('../middleware/error');

//* Creo la funzione getAllMovies per ottenere tutti i film
// Questa funzione gestirà la logica per la rotta che restituisce l'elenco di tutti i film.
function getAllMovies(req, res) {
    // Ottiengo una nuova connessione al database all'interno di getAllMovies
    const connection = getConnection();
    // mi connetto al database e gestisco la callback
    connection.connect(err => {
        // Gestisco un errore di connessione iniziale
        if (err) {
            console.error('Errore durante la connessione al database per getAllMovies:', err.message);
            connection.end(); // Chiude la connessione in caso di errore di connessione
            return sendServerError(res, 'Errore interno del server durante la connessione al database per i film.');
        }

        //* Eseguo la query per selezionare tutti i film e gestisci la sua callback.
        connection.query('SELECT * FROM movies', (error, results) => {
            // Gestisco eventuali errori nella query
            // Se la query fallisce, stampo l'errore, invio un 500 e chiudo la connessione.
            if (error) {
                console.error('Errore durante il recupero dei film:', error.message);
                connection.end(); // Chiude la connessione in caso di errore della query
                return sendServerError(res, 'Errore interno del server durante il recupero dei film.');
            } else {
                // Invio i risultati come JSON se la query ha successo
                res.json(results);
            }
            // Chiudo il blocco else e poi chiudo la connessione al database.
            connection.end();
            // Chiudo la callback di connection.query.
        });
        // Chiudo la callback di connection.connect.
    });
}
// Chiudo la funzione getAllMovies.


//* Creo la funzione getMovieById per ottenere un singolo film e le sue recensioni.
// Questa funzione gestirà la logica per la rotta che restituisce i dettagli di un film specifico e le sue recensioni.
function getMovieById(req, res) {
    // Recupero l'ID del film dalla richiesta
    // L'ID del film arriverà come parte dell'URL (es. /movies/1)
    const movieId = req.params.id;
    // Ottengo una nuova connessione al database
    const connection = getConnection();
    // Connetto il database e gestisco la callback
    connection.connect(err => {
        // Gestisco un errore di connessione iniziale
        if (err) {
            console.error('Errore durante la connessione al database per getMovieById:', err.message);
            connection.end(); // Chiude la connessione in caso di errore di connessione
            return sendServerError(res, 'Errore interno del server durante la connessione al database per il film specifico.');
        }
        // Eseguo la prima query (recupero i dettagli del film tramite ID)
        connection.query('SELECT * FROM movies WHERE id = ?', [movieId], (error, movieResults) => {
            // Gestisco eventuali errori nella query dei dettagli del film
            // Se la query fallisce, stampo l'errore, invio un 500 e chiudo la connessione
            if (error) {
                console.error('Errore durante il recupero dei dettagli del film:', error.message);
                connection.end(); // Chiude la connessione in caso di errore della query
                return sendServerError(res, 'Errore interno del server durante il recupero dei dettagli del film.');
            }
            // Ottengo il film dal risultato della query e verifico se è stato trovato
            // Il risultato sarà un array
            const movie = movieResults[0];
            if (!movie) {
                connection.end(); // Chiude la connessione prima di inviare l'errore 404
                return sendNotFoundError(res, 'Film non trovato.');
            }
            // Eseguo la seconda query x recupera le recensioni per il film trovato
            // Questa query viene eseguita solo se il film è stato trovato
            connection.query('SELECT * FROM reviews WHERE movie_id = ?', [movieId], (error, reviewsResults) => {
                // Gestisci eventuali errori nella query delle recensioni
                if (error) {
                    console.error('Errore durante il recupero delle recensioni:', error.message);
                    connection.end(); // Chiude la connessione in caso di errore della query delle recensioni
                    return sendServerError(res, 'Errore interno del server durante il recupero delle recensioni.');
                }
                // Aggiungo le recensioni all'oggetto film
                movie.reviews = reviewsResults;
                // Invio i dettagli del film (con le recensioni) come risposta JSON
                res.json(movie);
                // Chiudo la connessione al database
                connection.end();
                // Chiudo la callback di connection.query per le recensioni
            });
            // Chiudo la callback di connection.query per il film
        });
        // Chiudo la callback di connection.connect
    });
}
// Chiudo la funzione getMovieById


//* Esporto le funzioni del controller
module.exports = {
    getAllMovies,
    getMovieById
};