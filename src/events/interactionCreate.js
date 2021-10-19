module.exports = class interactionCreateEvent {
    constructor(client) {
        this.client = client;
    }

    async run(interaction) {
        if (!interaction.isCommand()) return;

        const cmd = this.client.commands.get(interaction.commandName);

        const verify = cmd.verifyRequeriments(interaction);

        if (verify) return;

        cmd.run({ message: interaction });
    }
}