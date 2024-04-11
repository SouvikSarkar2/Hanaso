"use server";

import { produceMessage } from "~/kafka";
import type { Message } from "~/utils/Types";

export const produceMessageHelper = async (message: Message) => {
  await produceMessage(message);
};
