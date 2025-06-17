//* Importo il modulo Express per creare un router
const express = require('express');
//* Importo il controller dei film
const movieController = require('../controllers/movieController');

//* Creo un'istanza del router di Express
const router = express.Router();

//* Definisco le rotte
// INDEX
router.get('/', movieController.getAllMovies);

//SHOW
router.get('/:id', movieController.getMovieById);

//* Esporto il router
module.exports = router;