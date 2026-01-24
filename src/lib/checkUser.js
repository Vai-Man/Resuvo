import { db } from "@/utils/db";
import { Users } from "@/utils/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }
  try {
    const loggedInUser = await db
      .select()
      .from(Users)
      .where(eq(Users.clerkUserId, user.id))
      .orderBy(Users.id);
    if (loggedInUser.length > 0) {
    //   console.log("Logged In User from DB:", loggedInUser[0]);
      return {loggedInUser, found:true};
    }

    const name = user.firstName + " " + user.lastName;

    const newUser = await db
      .insert(Users)
      .values({
        clerkUserId: user.id,
        name: name,
        email: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      })
      .returning();

    // console.log("New User Created:", newUser);

    return {newUser, found:false};
  } catch (error) {
    console.log("Error in checking/creating user:", error);
  }
};
