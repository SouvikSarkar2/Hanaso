import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { conversations, users } from "~/server/db/schema";
import { sql } from "drizzle-orm";

export const conversationRouter = createTRPCRouter({});
