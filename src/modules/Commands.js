const { readdirSync, stat } = require('fs');

const { join } = require('path');

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

module.exports = class commandLoader {
    constructor(client) {
        this.client = client;
    }

    async start() {
        await this.loadCommands('src/commands');

        setTimeout(() => this.registerSlashCommands(), 2000);
    }

    async loadCommands(path) {
        const files = readdirSync(path);

        files.forEach(file => {
            const filePath = join(path, file);

            stat(filePath, (err, stats) => {
                if (stats.isDirectory()) {
                    return this.loadCommands(filePath);
                } else if (stats.isFile()) {

                    const command = new (require(`../../${filePath}`))(this.client);

                    this.client.commands.set(command.name, command);

                    return command;
                }
            })
        })

    }

    async registerSlashCommands() {

        const commands = this.client.commands.filter(c => c);

        const rest = new REST({ version: '9' }).setToken(this.client.token);

        try {
            await rest.put(Routes.applicationGuildCommands(this.client.user.id, '892778828127141948'), {
                body: commands
            });

            this.client.log(`Slash Commands atualizados.`, { color: 'green', tags: ['Slash Commands'] });
        } catch (err) {
            this.client.log(`Ocorreu um erro ao atualizar os slash commands.\n ${err}`, { color: 'red', tags: ['Slash Commands'] });
        }

    }
}