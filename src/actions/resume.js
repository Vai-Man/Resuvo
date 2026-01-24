"use server";

import { db } from "@/utils/db";
import { fetchAIResponse } from "@/utils/GeminiAIModal";
import { Resume, Users } from "@/utils/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import moment from "moment";

export async function saveResume(content) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const existingUser = await db
    .select()
    .from(Users)
    .where(eq(Users.clerkUserId, userId));

  if (!existingUser || existingUser.length === 0)
    throw new Error("User not found");

  const userEmail = existingUser[0].email;

  try {
    const existingResume = await db
      .select()
      .from(Resume)
      .where(eq(Resume.userEmail, userEmail));

    if (existingResume.length > 0) {
      // Update existing resume
      await db
        .update(Resume)
        .set({
          content,
          updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        })
        .where(eq(Resume.userEmail, userEmail));

      return { message: "Resume updated" };
    } else {
      // Create new resume
      await db.insert(Resume).values({
        content,
        userEmail,
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      });

      return { message: "Resume created" };
    }
  } catch (error) {
    console.error("Error saving resume:", error);
    throw new Error("Failed to save resume");
  }
}

export async function getResume() {
  const user = await auth();
  // console.log("User in getResume function:", user);

  const existingUser = await db
    .select()
    .from(Users)
    .where(eq(Users.clerkUserId, user.userId));

  // console.log("Existing User in getResume:", existingUser);

  if (!existingUser) throw new Error("User not found");

  const userEmail = existingUser[0].email;

  if (!userEmail) throw new Error("User not found");

  return await db.select().from(Resume).where(eq(Resume.userEmail, userEmail));
}

export async function improveWithAI({ current, type }) {
  
  const user = await auth();
  if (!user) throw new Error("Unauthorized");

  const prompt = `
    As an expert resume writer, improve the following ${type} description for a tech professional.
    Make it more impactful, quantifiable, and aligned with industry standards.
    Current content: "${current}"

    Requirements:
    1. Use action verbs
    2. Include metrics and results where possible
    3. Highlight relevant technical skills
    4. Keep it concise but detailed
    5. Focus on achievements over responsibilities
    6. Use industry-specific keywords
    
    Format the response as a single paragraph without any additional text or explanations.
  `;

  try {
    const responseText = await fetchAIResponse(prompt);
    const improvedContent = responseText.trim();
    // console.log("Improved Content:", improvedContent);
    return improvedContent;
  } catch (error) {
    console.error("Error improving content:", error);
    throw new Error("Failed to improve content");
  }
}