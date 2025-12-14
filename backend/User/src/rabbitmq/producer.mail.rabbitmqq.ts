import { getChannel } from "./connection.rabbitmq.js";

const exchange: string = "mail.exchange";
const routingKey = "mail.send";


export async function sendMail(message: any) {
    const channel = getChannel();

    channel.publish(
        exchange,                 // direct exchange
        routingKey,                    // routing key 
        Buffer.from(JSON.stringify(message)),
        {
            persistent: true
        }
    );
}
