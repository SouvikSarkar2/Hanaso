import { eq, sql } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { conversations, messages, users } from "~/server/db/schema";

export const friendRouter = createTRPCRouter({
  deleteFriend: protectedProcedure
    .input(z.object({ Id1: z.string(), Id2: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user1 = await ctx.db.query.users.findFirst({
        where: sql`${users.id} = ${input.Id1}`,
      });

      if (!user1) {
        throw new Error("User not Found");
      }
      const updatedUser1FriendList = user1.friends.filter(
        (id) => id !== input.Id2,
      );
      await ctx.db
        .update(users)
        .set({ friends: updatedUser1FriendList })
        .where(eq(users.id, input.Id1));

      const user2 = await ctx.db.query.users.findFirst({
        where: sql`${users.id} = ${input.Id2}`,
      });

      if (!user2) {
        throw new Error("User not Found");
      }
      const updatedUser2FriendList = user2.friends.filter(
        (id) => id !== input.Id1,
      );
      await ctx.db
        .update(users)
        .set({ friends: updatedUser2FriendList })
        .where(eq(users.id, input.Id2));
      //finding the conversation between them
      const conversationId = await ctx.db.query.conversations.findFirst({
        where: sql`
          ARRAY[${input.Id1}, ${input.Id2}]::text[] <@ users
      `,
      });

      if (!conversationId) {
        return;
      }
      //delete the messages including the conversationId
      await ctx.db
        .delete(messages)
        .where(eq(messages.conversationId, conversationId.id));

      //deleting the conversation itself

      await ctx.db.delete(conversations).where(
        sql`
          ARRAY[${input.Id1}, ${input.Id2}]::text[] <@ users
      `,
      );
    }),

  request: protectedProcedure
    .input(z.object({ senderId: z.string(), receiverId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const currentUser = await ctx.db.query.users.findFirst({
        where: sql`${users.id} = ${input.receiverId}`,
      });

      if (!currentUser) {
        throw new Error("User not found");
      }

      const updatedFriendRequests = [
        ...currentUser.friendRequests,
        input.senderId,
      ];

      await ctx.db
        .update(users)
        .set({
          friendRequests: updatedFriendRequests,
        })
        .where(eq(users.id, input.receiverId));
    }),
  acceptRequest: protectedProcedure
    .input(z.object({ senderId: z.string(), receiverId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      //remove id of sender from requestList of receiver
      const receiver = await ctx.db.query.users.findFirst({
        where: sql`${users.id} = ${input.receiverId}`,
      });

      if (!receiver) {
        throw new Error("User not found");
      }

      const newRequestList = receiver.friendRequests.filter(
        (id) => id !== input.senderId,
      );

      await ctx.db
        .update(users)
        .set({
          friendRequests: newRequestList,
        })
        .where(eq(users.id, input.receiverId));

      //add id of sender to receiver friends list

      const newReceiverFriendList = [...receiver.friends, input.senderId];

      await ctx.db
        .update(users)
        .set({
          friends: newReceiverFriendList,
        })
        .where(eq(users.id, input.receiverId));

      //add receiver id to the senders friend list

      const sender = await ctx.db.query.users.findFirst({
        where: sql`${users.id} = ${input.senderId}`,
      });

      if (!sender) {
        throw new Error("User not found");
      }

      const newSenderFriendList = [...sender.friends, input.receiverId];

      await ctx.db
        .update(users)
        .set({
          friends: newSenderFriendList,
        })
        .where(eq(users.id, input.senderId));

      //add a new conversation

      await ctx.db.insert(conversations).values({
        users: [input.receiverId, input.senderId],
        id: sql`uuid_generate_v4()`,
      });
    }),
  rejectRequest: protectedProcedure
    .input(z.object({ senderId: z.string(), receiverId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const currentUser = await ctx.db.query.users.findFirst({
        where: sql`${users.id} = ${input.receiverId}`,
      });

      if (!currentUser) {
        throw new Error("User not found");
      }

      const updatedFriendRequests = currentUser.friendRequests.filter(
        (id) => id !== input.senderId,
      );

      await ctx.db
        .update(users)
        .set({
          friendRequests: updatedFriendRequests,
        })
        .where(eq(users.id, input.receiverId));
    }),
  findPeople: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const currentUser = await ctx.db.query.users.findFirst({
        where: sql`${users.id} = ${input.id}`,
      });

      if (!currentUser) {
        throw new Error("User not found");
      }

      const userFriendList = currentUser.friends;
      const userFriendRequestList = currentUser.friendRequests;

      const res = await ctx.db.query.users.findMany({
        where: sql`${users.id} != ${input.id}`,
      });
      const peopleId = res.map((people) => people.id);

      const updatedPeopleId = peopleId.filter(
        (id) =>
          !userFriendList.includes(id) && !userFriendRequestList.includes(id),
      );
      return updatedPeopleId;
    }),
});
