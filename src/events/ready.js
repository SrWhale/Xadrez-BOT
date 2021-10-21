const { schedule } = require('node-cron');

const { get } = require('axios');

module.exports = class readyEvent {
	constructor(client) {
		this.client = client;
	}

	async run(data) {

	}
}