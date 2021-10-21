const { schedule } = require('node-cron');

const { get } = require('axios');

module.exports = class readyEvent {
	constructor(client) {
		this.client = client;
	}

	async run(data) {

		this.client.music.init(this.client.user.id);

		schedule('18 56 * * *', () => {
			const challenge = await get('https://lichess.org/api/puzzle/daily').then(res => res.data);

			const chess = new Chess({
				size: 1200,
				style: 'alpha'
			});

			chess.loadPGN(challenge.game.pgn);

			const buff = await chess.generateBuffer();

			const { MessageAttachment } = require('discord.js');

			const pngImage = new MessageAttachment(buff, 'challenge.png');

			this.client.challenge = challenge;

			const channel = this.client.channels.cache.get('900049678832394261');

			return channel.send({
				content: `O desafio de hoje é composto por ${Math.ceil(challenge.game.pgn.split(" ").length / 2)} lances das ${challenge.game.pgn.split(" ").length % 2 ? 'brancas' : 'pretas'}`,
				files: [pngImage]
			});
		}, {
			timezone: 'America/Sao_Paulo'
		})
	}
}