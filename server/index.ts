import type * as Party from 'partykit/server';

const MAX_AMOUNT_PER_PERSON = 25;

export default class Server implements Party.Server {
	unlocks = new Map();
	connections = new Map();
	count = 0;
	// maxEnergyLevel = 10;

	// options: Party.ServerOptions = {
	// 	hibernate: true,
	// };

	constructor(readonly party: Party.Party) {}

	onMessage(message: string, sender: Party.Connection) {
		const msg = JSON.parse(message);

		if (msg.type === 'unlock') {
			const currentPct = this.unlocks.get(sender.id);
			const newPct = Math.max(
				0,
				Math.min(MAX_AMOUNT_PER_PERSON, currentPct + msg.amount),
			);
			this.unlocks.set(sender.id, newPct);
		}

		this.party.broadcast(
			JSON.stringify({
				...msg,
				unlocks: [...this.unlocks.entries()],
			}),
		);
	}

	onConnect(connection: Party.Connection) {
		this.unlocks.set(connection.id, 0);
		this.count = this.unlocks.size;

		this.party.broadcast(
			JSON.stringify({
				count: this.count,
				unlocks: [...this.unlocks.entries()],
				id: connection.id,
				type: 'join',
			}),
		);
	}

	onClose(connection: Party.Connection) {
		this.unlocks.delete(connection.id);
		this.count = this.unlocks.size;

		this.party.broadcast(
			JSON.stringify({
				count: this.count,
				id: connection.id,
				type: 'leave',
			}),
		);
	}
}
