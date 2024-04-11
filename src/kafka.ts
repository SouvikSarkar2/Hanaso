import { Kafka } from "kafkajs";
import type { Producer } from "kafkajs";
import path from "path";
import { readFileSync } from "fs";
import type { Message } from "./utils/Types";
import { env } from "~/env";

const kafka = new Kafka({
  brokers: ["kafka-2eedfb50-hanaso.b.aivencloud.com:19052"],
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

export default Kafka;
