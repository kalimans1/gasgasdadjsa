module.exports = {
	guildId: '', // Sunucu ID buraya yazılıcak.
    clientSecret: process.env.clientsecret, // Developer portal > botunu seç > OAuth2 sekmesindeki "CLIENT SECRET" buraya yazılıcak.
    clientID: "1255943052963614820", // Developer portal > botunu seç > OAuth2 sekmesindeki "CLIENT ID" buraya yazılıcak.
    roleId: '', // Üye yetkilendirme yaptıktan sonra vericeği rol.(Birden fazla rol atanmaz!)
    token: process.env.token, // Developer portal > botunu seç > Bot sekmesindeki "TOKEN" buraya yazılıcak.
    mongo: process.env.mongo, // https://www.mongodb.com/ sitesindeki bağlantı linki buraya yazılıcak.(Veriler burada depolanıcak!)
    prefix: ".", // Bot prefixi buraya yazılıcak.
    redirectURI: process.env.redirect:4848, // Developer portal > botunu seç > OAuth2 sekmesindeki "Redirects" buraya yazılıcak. Vds kullanıyorsanız ip adresini yazıp yanına port yazıp ardından kaydedin. (Örnek: http://55.224.167.186:4848)
    port: 4848, // Buraya port yazılıcak. Yukarıyla aynı olmak zorundadır. (Örnek portlar; 80 , 4848)
    owners: ["1214250364597960775" , "846255119044706334", ""], // Bot sahipleri buraya yazılıcak.(Birden fazla yazılabilir ve sadece buradaki kişiler botu kullanabilir!)
    redirectionIP: [process.env.redirect:4848], // Yukarıdaki ip buraya yazılıcak. (Örnek: http://55.224.167.186:4848)
    botlink: ["https://discord.com/oauth2/authorize?client_id=1255943052963614820&permissions=8&integration_type=0&scope=bot"], // Developer portal > botunu seç > OAuth2 sekmesindeki "OAuth2 URL Generator" buraya yazılıcak.
    redirectionBot: [process.env.redirect:4849],
    redirectport: 4849, // Yetkilendirme yapıldıktan sonra yönlendiriceği link. (Buraya ip adresi yazılıcak.) (Örnek: http://55.224.167.186)
    authlink: "https://discord.com/oauth2/authorize?client_id=1255943052963614820&response_type=code&redirect_uri=http%3A%2F%2F185.148.242.5%3A4848&scope=identify+guilds.join", // Developer portal > botunu seç > OAuth2 sekmesindeki "OAuth2 URL Generator" girdikten sonra "SCOPES" bölümünden [identify ve guilds.join] seçiyoruz ardından aşağıya geliyoruz ve "SELECT REDIRECT URL" kısmından girdiğimiz ip adresini seçiyoruz ve linki kopyalayıp buraya yapıştırıyoruz.
    webhookURL: process.env.webhook, // Üyeler yetkilendirme yaptığında log gönderileceği kanal webhooku buraya yazılıcak.
    webhookURL2: "https://discord.com/api/webhooks/1254814784574980127/L0giXKQO" // Üyeler yetkilendirme yaptığında log gönderileceği kanal webhooku buraya yazılıcak.