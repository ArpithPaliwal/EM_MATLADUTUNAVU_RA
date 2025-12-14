import { getChannel } from "./connection.rabbitmq.js";

const exchange: string = "mail.exchange";
const queue: string = "mailqueue";
const routingkey: string = "mail.send";

export async function startMailConsumer(): Promise<void> {
    const channel = getChannel();

    await channel.assertExchange(exchange, "direct", {
        durable: true,
    })

    await channel.assertQueue(queue, { durable: true })

    await channel.bindQueue(queue, exchange, routingkey);

    console.log("Mail consumer started and waiting for messages");

    channel.consume(queue, async (message) => {
        if (!message) return;
    })
}