//* Importo il modulo Express
const express = require('express');

//* Importo CORS
const cors = require('cors');

//* Importo e configuro il modulo dotenv
require('dotenv').config();

//* Importo le funzioni e i middleware personalizzati
const { testDbConnection } = require('./config/db');
// file statici
const serveStaticFiles = require('./middleware/staticFiles');
// middleware errori
const { errorHandler } = require('./middleware/error');
// rotte 
const movieRoutes = require('./routes/movieRoutes');

//* Creo un'istanza dell'applicazione Express
const app = express();

//* Definisco la porta del server
const port = process.env.PORT || 3000;
//* Definisco l'URL del server
const appUrl = process.env.APP_URL;

//* Eseguo il test di connessione al database all'avvio dell'app
testDbConnection();


//* Configuro i middleware globali
app.use(cors());
app.use('/movies_cover', serveStaticFiles());

//* Definisco le rotte dell'applicazione
app.use('/movies', movieRoutes);

//* Middleware per gestire le rotte non trovate (404)
app.use((req, res, next) => {
  res.status(404);
  res.json({
    error: 'Risorsa non trovata',
    path: req.originalUrl
  });
});


//* Aggiungo il middleware per la gestione degli errori
app.use(errorHandler);

//* Avvio del server
app.listen(port, () => {
    console.log(`Ascolto l'app all'URL ${appUrl}:${port}`);
});
