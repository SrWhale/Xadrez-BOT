const { get } = require('axios');

const { Command } = require('../../client/index');

const Chess = require('chess-image-generator');

module.exports = class ChallengeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'challenge',
            description: 'Faça o challenge diário',
            permissions: ['send_messages'],
        })
    }

    async run({ message, args }) {

        const challenge = await axios.get('https://lichess.org/api/puzzle/daily').then(res => res.data);

        const chess = new Chess({
            size: 1200,
            style: 'alpha'
        });

        chess.loadPGN(challenge.game.pgn);

        const buff = await chess.generateBuffer();

        const { MessageAttachment } = require('discord.js');

        const pngImage = new MessageAttachment(buff, 'challenge.png');

        return message.reply({
            files: [pngImage]
        })
    }
}