import { Kafka } from "kafkajs";
import type { Producer } from "kafkajs";
import path from "path";
import { readFileSync } from "fs";
import type { Message } from "./utils/Types";
import { env } from "~/env";
import { api } from "./trpc/server";

const batchSize = 100;
const flushInterval = 1000;
let messageBuffer: Message[] = [];

const kafka = new Kafka({
  brokers: [env.KAFKA_BROKER],
  ssl: {
    ca: [readFileSync(path.resolve("./ca.pem"), "utf-8")],
  },
  sasl: {
    username: env.KAFKA_USERNAME,
    password: env.KAFKA_PASSWORD,
    mechanism: "plain",
  },
});

let producer: null | Producer = null;

export async function createProducer() {
  if (producer) return producer;

  const newProducer = kafka.producer();
  await newProducer.connect();
  producer = newProducer;
  return producer;
}

export async function produceMessage(message: Message) {
  const producer = await createProducer();
  await producer.send({
    messages: [{ key: `${Math.random()}`, value: JSON.stringify(message) }],
    topic: "MESSAGES",
  });
  return true;
}

export async function startMessageConsumer() {
  const consumer = kafka.consumer({ groupId: "default" });
  await consumer.connect();
  await consumer.subscribe({ topic: "MESSAGES", fromBeginning: true });

  await consumer.run({
    autoCommit: true,
    eachMessage: async ({ message, pause }) => {
      if (!message.value) return;
      try {
        const parsedMessage = JSON.parse(message.value?.toString()) as Message;

        messageBuffer.push(parsedMessage);
        if (messageBuffer.length >= batchSize) {
          await uploadMessages();
        }
      } catch (err) {
        console.log("Something is wrong");
        pause();
        setTimeout(() => {
          consumer.resume([{ topic: "MESSAGES" }]);
        }, 60 * 1000);
      }
    },
  });
}

const intervalFunction = async () => {
  try {
    await handleUpload();
  } catch (error) {
    console.error("Error occurred during interval upload:", error);
  }
};

const intervalWrapper = () => {
  intervalFunction().catch((error) => {
    console.error("Error occurred during interval upload:", error);
  });
};

setInterval(intervalWrapper, flushInterval);

async function handleUpload(): Promise<void> {
  try {
    await uploadMessages();
  } catch (error) {
    console.error("Error occurred during upload:", error);
  }
}

async function uploadMessages(): Promise<void> {
  if (messageBuffer.length === 0) {
    return;
  }

  try {
    await api.conversation.addMessages(messageBuffer);
    console.log(messageBuffer);
    console.log("Bulk upload successful");
    messageBuffer = [];
  } catch (error) {
    console.error("Error occurred during bulk upload:", error);
  }
}

export default Kafka;
