import {Express} from "express";
import http from "http";
import { Server } from 'socket.io';

export default class SocketIO {
	private static io: Server;

	static connect(app: Express) {
		const server = http.createServer(app);
		this.io = new Server(server, {
			cors: {
				origin: "http://localhost:3000",
				methods: ["GET", "POST"]
			}
		});

		this.io.on('connection', (socket) => {
			const socketId = socket.id;

			console.log('Socket.io connected...');

			socket.on("disconnect", () => {
				console.log("Client disconnected");
			})
		});

		return server;
	}

	static emit(event: string, message: any) {
		this.io.emit(event, message);
	}
}