import amqp, {ConsumeMessage} from "amqplib";
import * as process from "node:process";
import mongoose from "mongoose";
import logger from "@utils/logger";
import {DBCollectionImporter} from "@dev/collection";
import SocketIO from "@ap/core/socket";

export default class ImporterService {
	private static EXCHANGE = {
		"work": "apiflow.exchange.work",
		"retry": "apiflow.exchange.retry",
	}

	private static QUEUE = {
		"work": "apiflow.queue.work",
		"retry": "apiflow.queue.retry",
	}

	private static RETRY_MESSAGE_TTL = 5 * 1000;
	private static MAX_RETRY = 3;

	public static async pushMessage(message: any) {
		try {
			const connection = await this.connectRabbitMQ();
			const channel = await connection.createChannel();

			// Work queues declaration
			await channel.assertExchange(this.EXCHANGE.work, "direct", {durable: true});
			await channel.assertQueue(this.QUEUE.work, {
				durable: true,
				deadLetterExchange: this.EXCHANGE.retry,
				exclusive: false
			});
			await channel.bindQueue(this.QUEUE.work, this.EXCHANGE.work, "");

			// Retry queue declaration
			await channel.assertExchange(this.EXCHANGE.retry, "direct", {durable: true});
			await channel.assertQueue(this.QUEUE.retry, {
				durable: true,
				deadLetterExchange: this.EXCHANGE.work,
				exclusive: false,
				messageTtl: this.RETRY_MESSAGE_TTL
			});
			await channel.bindQueue(this.QUEUE.retry, this.EXCHANGE.retry, "");

			// Push message to exchange for consumer
			channel.publish(this.EXCHANGE.work, '', Buffer.from(JSON.stringify(message)), {persistent: true});

			setTimeout(async () => {
				await connection.close();
			}, 2000)
		} catch (error) {
			throw new Error((error as Error).message);
		}
	}


	public static async consumeMessage() {
		try {
			const connection = await this.connectRabbitMQ();
			const channel = await connection.createChannel();

			await channel.prefetch(1);

			// Work queues declaration
			await channel.assertExchange(this.EXCHANGE.work, "direct", {durable: true});
			await channel.assertQueue(this.QUEUE.work, {
				durable: true,
				deadLetterExchange: this.EXCHANGE.retry,
				exclusive: false
			});
			await channel.bindQueue(this.QUEUE.work, this.EXCHANGE.work, "");

			await channel.consume(this.QUEUE.work, async (message: ConsumeMessage | null) => {
				if (!message) return;

				const session = await mongoose.startSession();
				session.startTransaction();
				try {
					const messageContent = JSON.parse(message.content.toString());
					if (message.properties.headers && message.properties.headers["x-death"] && message.properties.headers["x-death"].length != 0) {
						const deathHeader = message.properties.headers["x-death"] || [];
						const workRejects = deathHeader.find((x: any) => x.queue === this.QUEUE.work);
						if (workRejects && workRejects.count > 3) {
							channel.ack(message);

							SocketIO.emit("collection.import", {
								error: -1,
								data: {},
								message: "We don’t recognize/support this format."
							});
							return;
						}
					}

					const {
					    collection,
					    folders,
					    requests,
					    examples
					} = await DBCollectionImporter.importCollection(messageContent.user_id, messageContent.data, session);

					await session.commitTransaction();

					channel.ack(message);

					SocketIO.emit("collection.import", {
						error: 0,
						data: {
							collection,
							folders,
							requests,
							examples
						},
						message: "Import collection "
					});
				} catch (error) {
					channel.nack(message, false, false);
					await session.abortTransaction();
				} finally {
					await session.endSession();
				}
			});
		} catch (error) {
			logger.error((error as Error).message);
			// throw new Error((error as Error).message);
		}
	}


	private static async connectRabbitMQ() {
		try {
			return await amqp.connect(process.env.RABBITMQ_CONNECTION_STRING || 'amqp://localhost');
		} catch (error) {
			throw new Error((error as Error).message);
		}
	}

}