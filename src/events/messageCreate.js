module.exports = class messageCreateEvent {
    constructor(client) {
        this.client = client;
    }

    async run(message) {
        if (message.channel.id !== '900049678832394261') return;

        const chessGame = this.client.challenge;

        const chessAnswer = chessGame.puzzle.solution;

        const messageAnswers = message.content.replace(/([^a-z0-9])/gi, '').match(/([a-z][0-9][a-z][0-9])/gi);

        console.log(message.content, messageAnswers);

        if (!messageAnswers) return;

        if (messageAnswers.length === chessAnswer.length) {
            for (let i = 0; i < messageAnswers.length; i++) {
                if (messageAnswers[i].toLowerCase() !== chessAnswer[i].toLowerCase()) {

                    message.react('❌');

                    break;
                }

                else if (i === messageAnswers.length - 1) message.react('✅')
            }
        } else {
            const isWhite = chessGame.game.pgn.split(" ").length % 2;

            if (messageAnswers.length < Math.ceil(chessGame.puzzle.solution.length / 2)) return message.reply({
                content: `Para vencer, são necessários \`${Math.ceil(chessGame.puzzle.solution.length / 2)}\` lances, você colocou apenas \`${messageAnswers.length}\` `
            });

            for (let i = 0; i < messageAnswers.length; i++) {
                if (messageAnswers[i] !== chessAnswer[isWhite ? i : i + 1]) {

                    message.react('❌');

                    break;
                }

                else if (i === messageAnswers.length - 1) message.react('✅')
            }
        }
    }
}