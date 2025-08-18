module.exports = {
    guildId: '1394864596627755038', // Senin verdiğin Sunucu ID
    clientSecret: process.env.CLIENT_SECRET, // Developer portal > OAuth2 > CLIENT SECRET
    clientID: "1216103189116616834", // Senin verdiğin Client ID
    roleId: '', // Üye yetkilendirme yaptıktan sonra verilecek rol
    token: process.env.TOKEN, // Bot Token
    mongo: process.env.MONGO, // MongoDB bağlantı URL
    prefix: ".", // Bot prefixi
    redirectURI: process.env.REDIRECT_URI || "https://baytonoauths.onrender.com:4848", // OAuth2 Redirect URI
    port: process.env.PORT || 4848, // Render otomatik portu kullan veya 4848
    owners: ["1214250364597960775", "846255119044706334", ""], // Bot sahipleri (eski hali)
    redirectionIP: [process.env.REDIRECTION_IP || "https://baytonoauths.onrender.com:4848"], // Yetkilendirme sonrası yönlendirme
    botlink: ["https://discord.com/oauth2/authorize?client_id=1216103189116616834&permissions=8&integration_type=0&scope=bot"], // Bot linki
    redirectionBot: [process.env.REDIRECTION_BOT || "https://baytonoauths.onrender.com:4849"], // Yetkilendirme sonrası bot yönlendirme
    redirectport: 4849, // Yetkilendirme sonrası HTML server portu
    authlink: "https://discord.com/oauth2/authorize?client_id=1216103189116616834&response_type=code&redirect_uri=https%3A%2F%2Fbaytonoauths.onrender.com%3A4848&scope=identify+guilds.join", // OAuth2 URL
    webhookURL: process.env.WEBHOOK, // Log webhook URL
    webhookURL2: "https://discord.com/api/webhooks/1254814784574980127/L0giXKQO" // İkinci log webhook
};
