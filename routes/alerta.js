const express = require('express');
const multer = require('multer');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const router = express.Router();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
const chatId = process.env.TELEGRAM_CHAT_ID;

// Configurar multer para subir archivos de audio
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir); // Crea la carpeta si no existe
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `audio-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

// Función para enviar mensaje (y opcionalmente audio) a Telegram
async function enviarAlertaTelegram(texto, audioPath) {
  try {
    await bot.sendMessage(chatId, texto);

    if (audioPath) {
      await bot.sendAudio(chatId, fs.createReadStream(audioPath));
    }

    console.log('✅ Alerta enviada por Telegram');
  } catch (error) {
    console.error('❌ Error enviando a Telegram:', error);
  }
}

// Ruta POST: /api/alerta
router.post('/', upload.single('audio'), async (req, res) => {
  const { lat, lon } = req.body;
  const audioFile = req.file;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Faltan coordenadas (lat/lon)' });
  }

  const texto = `🚨 ¡Alerta de prueba!\n📍 Ubicación: https://maps.google.com/?q=${lat},${lon}`;
  const audioPath = audioFile ? audioFile.path : null;

  try {
    await enviarAlertaTelegram(texto, audioPath);
    res.json({ message: 'Alerta enviada por Telegram' });
  } catch (error) {
    console.error('❌ Error al enviar la alerta:', error);
    res.status(500).json({ error: 'Error al enviar la alerta' });
  }
});

module.exports = router;
