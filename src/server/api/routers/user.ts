import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { users } from "~/server/db/schema";
import { sql } from "drizzle-orm";

export const userRouter = createTRPCRouter({
  find: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.db.query.users.findFirst({
        where: sql`${users.id} = ${input.id}`,
      });
      if (!user) {
        return {
          name: "Unknown",
          image:
            "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          friends: [],
          friendRequests: [],
          id: "",
          email: "",
        };
      }
      return user;
    }),
  /* findMany: protectedProcedure
    .input(z.array(z.string()))
    .query(async ({ input, ctx }) => {
      const Users: (typeof users)[] = [];
      input.map(async (id) => {
        const user = await ctx.db.query.users.findFirst({
          where: sql`${users.id} = ${id}`,
        });
      });
      return Users;
    }), */
});
