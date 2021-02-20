const Discord = require('discord.js');
const client = new Client();
const request = require('request');

let ayarlar = {
    "özelurl": "url değişince yapılcak url",
    "urlog": "guard log",
    "token": "bot token" // clasus#0001
}

client.on('guildUpdate', async (berke, gokce) => {
    if (berke.vanityURLCode === gokce.vanityURLCode) return;
    let entry = await gokce.fetchAuditLogs({
        type: 'GUILD_UPDATE'
    }).then(audit => audit.entries.first());
    if (!entry.executor || entry.executor.id === client.user.id) return;
    let channel = client.channels.cache.get(Options.urlog);

    if (channel) channel.send(`
    ${entry.executor} adlı kullanıcı özel url'yi değiştirmeye çalıştı ve sunucudan yasaklandı.
    `)

    if (!channel) gokce.owner.send(`
    ${entry.executor} adlı kullanıcı özel url'yi değiştirmeye çalıştı ve sunucudan yasaklandı.
    `)

    gokce.members.ban(entry.executor.id, {
        reason: `${entry.executor.tag} URL GUARD`
    });

    const ayarlar = {
        url: `https://discord.com/api/v6/guilds/${gokce.id}/vanity-url`,
        body: { code: ayarlar.özelurl },
        json: true,
        method: 'PATCH',
        headers: { "Authorization": `Bot ${ayarlar.token}` }
    };

    request(ayarlar, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
    });
});
