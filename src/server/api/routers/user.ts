import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { users } from "~/server/db/schema";
import { sql } from "drizzle-orm";

export const userRouter = createTRPCRouter({
  find: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.query.users.findFirst({
        where: sql`${users.id} = ${input.id}`,
      });
    }),
});
