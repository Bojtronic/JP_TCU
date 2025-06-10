require('dotenv').config(); 
const express = require('express');
const app = express();
const proyectoRoutes = require('./routes/proyectoRoutes');
const path = require('path');

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





/*

const express = require('express');
const app = express();
const proyectoRoutes = require('./routes/proyectoRoutes');
const path = require('path');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Rutas API
app.use('/api/proyectos', proyectoRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

*/