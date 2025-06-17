import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

//* importazione
import { Routes, Route } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0)

return (
  <Routes>
    {/* rotta per la pagina Home */}
    <Route path="/" element={<h1>Homepage Caricamento...</h1>} />

    {/* rotta per la pagina di dettaglio di un singolo film */}
    {/* :id è un parametro dinamico che catturerà l'ID del film dall'URL */}
    <Route path="/movies/:id" element={<h1>Dettaglio Film Caricamento...</h1>} />
  </Routes>
);
}

export default App
