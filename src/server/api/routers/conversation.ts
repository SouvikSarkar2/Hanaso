import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { messages } from "~/server/db/schema";
import { sql } from "drizzle-orm";

export const conversationRouter = createTRPCRouter({
  find: protectedProcedure
    .input(z.object({ Id1: z.string(), Id2: z.string() }))
    .query(async ({ ctx, input }) => {
      const conversationId = await ctx.db.query.conversations.findFirst({
        where: sql`
              ARRAY[${input.Id1}, ${input.Id2}]::text[] <@ users
          `,
      });
      return conversationId;
    }),
  findLastMessage: protectedProcedure
    .input(z.object({ conversationId: z.string() }))
    .query(async ({ ctx, input }) => {
      const lastMessage = await ctx.db.query.messages.findFirst({
        where: sql`${messages.conversationId} = ${input.conversationId}`,
        orderBy: (messages, { desc }) => [desc(messages.sentAt)],
      });
      if (!lastMessage) {
        return "";
      }
      return lastMessage;
    }),
  findMessage: protectedProcedure
    .input(z.object({ conversationId: z.string() }))
    .query(async ({ ctx, input }) => {
      const allMessages = await ctx.db.query.messages.findMany({
        where: sql`${messages.conversationId} = ${input.conversationId}`,
      });
      return allMessages;
    }),
  addMessage: protectedProcedure
    .input(
      z.object({
        conversationId: z.string(),
        senderId: z.string(),
        recipientId: z.string(),
        content: z.string(),
        senderName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(messages).values({
        content: input.content,
        recipientId: input.recipientId,
        senderId: input.senderId,
        conversationId: input.conversationId,
        id: sql`uuid_generate_v4()`,
        senderName: input.senderName,
      });
    }),
  addMessages: protectedProcedure
    .input(
      z.array(
        z.object({
          conversationId: z.string(),
          senderId: z.string(),
          recipientId: z.string(),
          content: z.string(),
          senderName: z.string(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      const messageValues = input.map((message) => ({
        content: message.content,
        recipientId: message.recipientId,
        senderId: message.senderId,
        conversationId: message.conversationId,
        id: sql`uuid_generate_v4()`,
        senderName: message.senderName,
      }));

      await ctx.db.insert(messages).values(messageValues);
    }),

  findConversationsOfUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const conversationIds = await ctx.db.query.conversations.findMany({
        where: sql`
        ARRAY[${input.id}]::text[] <@ users
    `,
      });
      return conversationIds.map((el) => el.id);
    }),
});
