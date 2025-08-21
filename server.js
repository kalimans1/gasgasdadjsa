const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const emoji = require('./src/Structures/Emojis.js');
const config = require('./config');
const { WebhookClient } = require('discord.js');
const webhook = new WebhookClient({ url: config.webhookURL });
const fetch = require('node-fetch');
const { createUser, updateUser } = require('./src/Structures/Functions');
const { User } = require('./src/Models/index');
const { success, logErr, log, yellow } = require('./src/Structures/Functions');

Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)];
};

// MongoDB bağlantısı
async function loadDatabase() {
    try {
        await mongoose.connect(config.mongo, {
            autoIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB bağlantısı başarılı!");
    } catch (err) {
        console.error("❌ MongoDB bağlantısı başarısız:", err);
    }
}

// Sunucu başlatma
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.send('Bot Render üzerinde çalışıyor 🚀');
});

// Express server’ı dinlet
app.listen(PORT, async () => {
    console.log(`✅ Server çalışıyor: http://localhost:${PORT}`);
    await loadDatabase();
});
