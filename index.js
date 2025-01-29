require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Configurar la carpeta "public" para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Redirigir la raíz a `/pages/gestion_cultural.html`
app.get('/', (req, res) => {
  res.redirect('/pages/gestion_cultural.html');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
