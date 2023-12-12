import type * as Party from 'partykit/server';
export default class Server implements Party.Server {
	constructor(readonly party: Party.Party) {}

	onMessage(message: string, sender: Party.Connection) {
		this.party.broadcast(message, [sender.id]);
	}

	onConnect(connection: Party.Connection) {
		connection.send(`connected`);
		const connCount = [...this.party.getConnections()].length;
		this.party.broadcast(JSON.stringify({ connCount }));
	}

	onClose(connection: Party.Connection) {
		this.party.broadcast(`Connection ${connection.id} left`);
	}
}
