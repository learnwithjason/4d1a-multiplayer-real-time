import type * as Party from 'partykit/server';
export default class Server implements Party.Server {
	count = 0;
	connections = new Map();
	maxEnergyLevel = 10;

	constructor(readonly party: Party.Party) {}

	onMessage(message: string, sender: Party.Connection) {
		this.party.broadcast(message, [sender.id]);
	}

	onConnect(connection: Party.Connection) {
		const percent =
			Math.min((this.connections.size / this.maxEnergyLevel) * 100, 100) + '%';
		this.connections.set(connection.id, percent);

		this.count = [...this.party.getConnections()].length;
		this.party.broadcast(
			JSON.stringify({
				count: this.count,
				connections: [...this.connections.entries()],
				id: connection.id,
				type: 'join',
			}),
		);
	}

	onClose(connection: Party.Connection) {
		this.connections.delete(connection.id);

		this.count = [...this.party.getConnections()].length;
		this.party.broadcast(
			JSON.stringify({
				count: this.count,
				id: connection.id,
				type: 'leave',
			}),
		);
	}
}
