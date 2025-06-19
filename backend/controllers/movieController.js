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

//* aggiungo funzione addReview che gestirà la logica per l'inserimento di una nuova recensione
    function addReview(req, res) {
        // Recupero l'ID del film dall'URL params
        const movieId = req.params.id;
        // Recupero i dati della recensione dal body della richiesta
        const { name, vote, text } = req.body;

        // Validazione base dei dati di input
        if (!name || !vote || !text) {
            return res.status(400).json({ error: 'Nome, voto e testo della recensione sono campi obbligatori.' });
        }
        if (typeof vote !== 'number' || vote < 1 || vote > 5) {
            return res.status(400).json({ error: 'Il voto deve essere un numero tra 1 e 5.' });
        }

        // Ottengo una nuova connessione al database
        const connection = getConnection();

        // Connetto il database e gestisco la callback
        connection.connect(err => {
            if (err) {
                console.error('Errore durante la connessione al database per addReview:', err.message);
                connection.end();
                return sendServerError(res, 'Errore interno del server durante la connessione al database.');
            }

            // Eseguo la query per inserire la nuova recensione
            // Controllo prima se il movie_id esiste nella tabella movies
            const checkMovieSql = 'SELECT id FROM movies WHERE id = ?';
            connection.query(checkMovieSql, [movieId], (error, results) => {
                if (error) {
                    console.error('Errore durante la verifica del film:', error.message);
                    connection.end();
                    return sendServerError(res, 'Errore interno del server durante la verifica del film.');
                }

                if (results.length === 0) {
                    // Se il film non esiste, non si poù aggiungere la recensione
                    connection.end();
                    return sendNotFoundError(res, 'Film non trovato. Impossibile aggiungere recensione.');
                }

                // Se il film esiste, procedo con l'inserimento della recensione
                const insertReviewSql = 'INSERT INTO reviews (movie_id, name, vote, text) VALUES (?, ?, ?, ?)';
                const reviewData = [movieId, name, vote, text];

                connection.query(insertReviewSql, reviewData, (insertError, insertResults) => {
                    if (insertError) {
                        console.error('Errore durante l\'inserimento della recensione:', insertError.message);
                        connection.end();
                        return sendServerError(res, 'Errore interno del server durante l\'inserimento della recensione.');
                    }

                    // Invio una risposta di successo con l'ID della nuova recensione
                    res.status(201).json({ message: 'Recensione aggiunta con successo!', reviewId: insertResults.insertId });
                    connection.end(); // Chiude la connessione dopo l'operazione
                });
            });
        });
    }


//* Esporto le funzioni del controller
module.exports = {
    getAllMovies,
    getMovieById,
    addReview
};