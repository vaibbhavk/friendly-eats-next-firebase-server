"use server";

import { db, users } from "@/src/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getOrCreateDbUser(uid, email) {
  if (!uid || !email) {
    return null;
  }

  // Check if user exists in the database
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.id, uid))
    .limit(1);

  if (existingUser.length === 0) {
    // Create new user if not found
    await db.insert(users).values({
      id: uid,
      phone_number: email,
    });

    const newUser = await db
      .select()
      .from(users)
      .where(eq(users.id, uid))
      .limit(1);
    return newUser[0];
  }

  return existingUser[0];
}
