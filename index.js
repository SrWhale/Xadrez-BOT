require('dotenv/config');

const { Client } = require('./src/index');

const { schedule } = require('node-cron');

const { get } = require('axios');

const Chess = require('chess-image-generator');

const client = new Client({
    intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_BANS', 'GUILD_EMOJIS_AND_STICKERS', 'GUILD_INTEGRATIONS', 'GUILD_WEBHOOKS',
        'GUILD_INVITES', 'GUILD_VOICE_STATES', 'GUILD_PRESENCES', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS',
        'GUILD_MESSAGE_TYPING', 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_TYPING'],
    restTimeOffset: 0,
    presence: {
        activies: {
            name: 'Clube de Xadrex'
        },
        status: 'idle'
    },
    allowedMentions: {
        parse: ['users', 'roles'],
        repliedUser: true
    }
});

client.login().then(async () => {

    client.log(`BOT iniciado com sucesso.`, { color: 'green', tags: ['discord client'] });

    setTimeout(() => client.user.setStatus('online'), 30000);

    client.connectdatabase();
    client.loadModules();

    schedule('15 19 * * *', async () => {
        const challenge = await get('https://lichess.org/api/puzzle/daily').then(res => res.data);

        const chess = new Chess({
            size: 1200,
            style: 'alpha'
        });

        chess.loadPGN(challenge.game.pgn);

        const buff = await chess.generateBuffer();

        const { MessageAttachment } = require('discord.js');

        const pngImage = new MessageAttachment(buff, 'challenge.png');

        client.challenge = challenge;

        const channel = this.client.channels.cache.get('900049678832394261');

        return channel.send({
            content: `O desafio de hoje é composto por ${Math.ceil(challenge.game.pgn.split(" ").length / 2)} lances das ${challenge.game.pgn.split(" ").length % 2 ? 'brancas' : 'pretas'}`,
            files: [pngImage]
        });
    }, {
        timezone: 'America/Sao_Paulo'
    })

}).catch(err => {
    console.log(err)
});

process.on('error', console.log)