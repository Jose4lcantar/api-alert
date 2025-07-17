const express = require('express');
const multer = require('multer');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');

const router = express.Router();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
const chatId = process.env.TELEGRAM_CHAT_ID;

// Configurar multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `audio-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

async function enviarAlertaTelegram(texto, audioUrl) {
  try {
    await bot.sendMessage(chatId, texto);
    if (audioUrl) {
      await bot.sendAudio(chatId, audioUrl);
    }
    console.log('✅ Alerta enviada por Telegram');
  } catch (error) {
    console.error('❌ Error enviando a Telegram:', error);
  }
}

// POST /api/alerta
router.post('/', upload.single('audio'), async (req, res) => {
  const { lat, lon } = req.body;
  const audioFile = req.file;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Faltan coordenadas (lat/lon)' });
  }

  const texto = `🚨 ¡Alerta de prueba!\nUbicación: https://maps.google.com/?q=${lat},${lon}`;

  const audioUrl = audioFile
    ? `${req.protocol}://${req.get('host')}/uploads/${audioFile.filename}`
    : null;

  try {
    await enviarAlertaTelegram(texto, audioUrl);
    res.json({ message: 'Alerta enviada por Telegram' });
  } catch (error) {
    res.status(500).json({ error: 'Error al enviar la alerta' });
  }
});

module.exports = router;
