require('dotenv').config();
const express = require('express');
const cors = require('cors');

const alertaRoutes = require('./routes/alerta');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/alerta', alertaRoutes);

const PORT = process.env.PORT || 3000;

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.listen(PORT, () => {
  console.log(`API escuchando en puerto ${PORT}`);
});
