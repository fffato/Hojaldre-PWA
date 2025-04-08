import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Este es tu componente principal

// Crea el contenedor para renderizar la aplicación
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderiza tu componente App en el contenedor
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
