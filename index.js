require('dotenv').config(); 
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; 

// Configurar la carpeta "public" para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal para enviar el archivo HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
