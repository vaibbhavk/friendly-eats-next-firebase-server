import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
  uuid,
} from "drizzle-orm/pg-core";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

const connectionString = process.env.AUTH_DRIZZLE_URL;
const pool = postgres(connectionString, { max: 10 });

export const db = drizzle(pool);

// ENUM Definitions
export const roleEnum = pgEnum("role", ["user", "admin", "superadmin"]);
export const planTypeEnum = pgEnum("plan_type", ["free", "individual", "firm"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "expired",
  "cancelled",
]);

// Users Table
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  phone_number: text("phone_number").notNull().unique(),
  org_id: uuid("org_id").references(() => organizations.id, {
    onDelete: "set null",
  }), // User may not belong to an org
  role: roleEnum("role").notNull().default("user"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
