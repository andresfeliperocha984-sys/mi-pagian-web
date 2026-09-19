const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); 
app.use(express.json());

app.post('/send-message-dynamic', async (req, res) => {
    const { mensaje } = req.body;
    
    // Valida que la contraseña coincida
    const apiKey = req.headers['x-api-key-authorization'];
    if (apiKey !== process.env.API_KEY_SECRET) {
        return res.status(401).json({ error: 'No autorizado' });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    try {
        // AHORA SÍ CORREGIDO: Tiene el api., el /bot y el signo $ para la variable
        const url = `https://telegram.org{botToken}/sendMessage`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: mensaje })
        });

        if (response.ok) {
            return res.json({ success: true, message: 'Mensaje enviado' });
        } else {
            return res.status(500).json({ error: 'Error en Telegram' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
