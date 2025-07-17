require('dotenv').config();
const express = require('express');
const cors = require('cors');

const alertaRoutes = require('./routes/alerta');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/alerta', alertaRoutes);

// Ruta básica para verificar si está funcionando
app.get('/', (req, res) => {
  res.send('¡API de Alertas funcionando correctamente! ✅');
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API escuchando en puerto ${PORT}`);
});
