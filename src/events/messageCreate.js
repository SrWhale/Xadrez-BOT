module.exports = class messageCreateEvent {
    constructor(client) {
        this.client = client;
    }

    async run(message) {
        if (message.channel.id !== '900049678832394261') return;

        const chessGame = this.client.challenge;

        const chessAnswer = chessGame.puzzle.solution;

        const messageAnswers = message.content.replace(/([^a-z0-9])/gi, '').match(/([a-z][0-9][a-z][0-9])/gi);

        if (!messageAnswers) return;

        if (messageAnswers.length === chessAnswer.length) {
            for (let i = 0; i < messageAnswers.length; i++) {
                if (messageAnswers[i].toLowerCase() !== chessAnswer[i].toLowerCase()) {

                    message.react('❌');

                    break;
                }

                else if (i === messageAnswers.length - 1) {

                    message.react('✅');

                    message.reply({
                        content: 'Parabéns, você acertou os movimentos!'
                    })
                }
            }
        } else {

            if (messageAnswers.length < Math.ceil(chessGame.puzzle.solution.length / 2)) return message.reply({
                content: `Para vencer, são necessários \`${Math.ceil(chessGame.puzzle.solution.length / 2)}\` lances, você colocou apenas \`${messageAnswers.length}\` `
            });

            for (let i = 0; i < messageAnswers.length; i++) {
                if (messageAnswers[i].toLowerCase() !== chessAnswer[i ? (i * 2) : 0].toLowerCase()) {

                    message.react('❌');

                    break;
                }

                else if (i === messageAnswers.length - 1) {

                    message.react('✅');

                    message.reply({
                        content: 'Parabéns, você acertou os movimentos!'
                    });

                }
            }
        }
    }
}