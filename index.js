require('dotenv').config();
const express = require('express');
const cors = require('cors');

const alertaRoutes = require('./routes/alerta');

const app = express();

app.use(cors());
app.use(express.json());

// Para servir archivos como audios
app.use('/uploads', express.static('uploads'));

// Rutas
app.use('/api/alerta', alertaRoutes);

app.get('/', (req, res) => {
  res.send('¡API de Alertas funcionando correctamente! ✅');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ API escuchando en puerto ${PORT}`);
});
