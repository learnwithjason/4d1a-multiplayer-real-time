import type * as Party from 'partykit/server';
export default class Server implements Party.Server {
	count = 0;
	connIds = new Set();

	constructor(readonly party: Party.Party) {}

	onMessage(message: string, sender: Party.Connection) {
		this.party.broadcast(message, [sender.id]);
	}

	onConnect(connection: Party.Connection) {
		for (const conn of this.party.getConnections()) {
			this.connIds.add(conn.id);
		}

		console.log(connection.id);
		console.log([...this.connIds.values()]);
		this.count = [...this.party.getConnections()].length;
		this.party.broadcast(
			JSON.stringify({
				count: this.count,
				connections: [...this.connIds.values()],
				id: connection.id,
				type: 'join',
			}),
		);
	}

	onClose(connection: Party.Connection) {
		this.connIds.delete(connection.id);

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
