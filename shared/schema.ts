import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (keeping this from the original schema)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Algorithm table to store information about sorting algorithms
export const algorithms = pgTable("algorithms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  timeComplexityBest: text("time_complexity_best").notNull(),
  timeComplexityAverage: text("time_complexity_average").notNull(),
  timeComplexityWorst: text("time_complexity_worst").notNull(),
  spaceComplexity: text("space_complexity").notNull(),
  code: text("code").notNull(),
  useCases: text("use_cases").notNull(),
  avoidCases: text("avoid_cases").notNull(),
});

export const insertAlgorithmSchema = createInsertSchema(algorithms).omit({
  id: true,
});

// Result table to store sorting results
export const results = pgTable("results", {
  id: serial("id").primaryKey(),
  input: text("input").notNull(),
  results: jsonb("results").notNull(),
  timestamp: text("timestamp").notNull(),
});

export const insertResultSchema = createInsertSchema(results).omit({
  id: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertAlgorithm = z.infer<typeof insertAlgorithmSchema>;
export type Algorithm = typeof algorithms.$inferSelect;

export type InsertResult = z.infer<typeof insertResultSchema>;
export type Result = typeof results.$inferSelect;

// Schema for input validation
export const sortInputSchema = z.object({
  numbers: z.string().min(1, "Please enter at least one number"),
  dataSize: z.enum(["small", "medium", "large", "xlarge"]),
  dataOrder: z.enum(["random", "nearly-sorted", "reverse", "sorted", "few-unique"]),
});

export type SortInput = z.infer<typeof sortInputSchema>;

// Schema for algorithm result
export const algorithmResultSchema = z.object({
  algorithmId: z.number(),
  name: z.string(),
  executionTime: z.number(),
  timeComplexity: z.string(),
});

export type AlgorithmResult = z.infer<typeof algorithmResultSchema>;
