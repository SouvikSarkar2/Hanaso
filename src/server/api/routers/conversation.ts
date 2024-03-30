import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { conversations, messages, users } from "~/server/db/schema";
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
  addMessage: protectedProcedure
    .input(
      z.object({
        conversationId: z.string(),
        senderId: z.string(),
        recipientId: z.string(),
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(messages).values({
        content: input.content,
        recipientId: input.recipientId,
        senderId: input.senderId,
        conversationId: input.conversationId,
        id: sql`uuid_generate_v4()`,
      });
    }),
});
