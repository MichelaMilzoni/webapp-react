//* importazione e configurazione moduli
const mysql = require('mysql2');
require('dotenv').config();
const { sendServerError } = require('../middleware/error');

//* configurazione del database usando le variabili d'ambiente
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};

//* funzione per ottenere una nuova connessione al database
function getConnection () {
    return mysql.createConnection(dbConfig);
};

//* funzione per testare la connessione al database all'avvio
/**
* Funzione per testare la connessione al database all'avvio dell'applicazione.
* Si connette e poi si disconnette, stampando lo stato in console.
*/
function testDbConnection () {
    // ottengo la connessione
    const connection = getConnection();
    // connetto usando una callback x gestire il risultato
    connection.connect(err => {
        // controllo se c'è un errore
        if (err) {
            // stampo l'errore in console
            console.error('Errore durante la connessione iniziale al database:', err.message);
            // termino il processo in caso di errore critico
            process.exit(1);
            // fermo l'esecuzione della callback
            return
        }
        // se non ci sono errori, stampo il messaggio di successo
        console.log('Connessione al database MySQL riuscita!');
        // chiudo la connessione
        connection.end();
    // chiudo la callback di connect
    });
// Chiudo la funzione testDbConnection
};

//* esporto le funzioni in modo che possano essere utilizzate da altri file
module.exports = {
getConnection,
testDbConnection
};