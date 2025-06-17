//* Importo il modulo Express.
const express = require('express');


//* Creo la funzione serveStaticFiles
// Questa funzione restituirà il middleware effettivo di Express per i file statici
function serveStaticFiles() {
    // Restituisco il middleware express.static.
    // Questo è il cuore della funzione. 
    // Indica a Express quale cartella deve servire come file statici.
    return express.static('public/movies_cover');
// Chiudo la funzione serveStaticFiles.
};

//* Esporto la funzione serveStaticFiles
module.exports = serveStaticFiles;
