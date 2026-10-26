"use server";

import { db } from "@/utils/db";
import {
  MockInterview,
  Question,
  UserAnswer,
  CoverLetterDesc,
} from "@/utils/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

async function requireEmail() {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  if (!email) throw new Error("Unauthorized");
  return email;
}

const now = () => moment().format("YYYY-MM-DD HH:mm:ss");

// ---------- Questions ----------

export async function getUserQuestions() {
  const email = await requireEmail();
  return db
    .select()
    .from(Question)
    .where(eq(Question.createdBy, email))
    .orderBy(desc(Question.id));
}

export async function createQuestion({ question, difficulty, topic }) {
  const email = await requireEmail();
  return db
    .insert(Question)
    .values({
      question,
      difficulty,
      createdBy: email,
      createdAt: now(),
      topic,
      questionId: uuidv4(),
    })
    .returning({ questionId: Question.questionId });
}

// ---------- Mock interviews ----------

export async function getUserInterviews() {
  const email = await requireEmail();
  return db
    .select()
    .from(MockInterview)
    .where(eq(MockInterview.createdBy, email))
    .orderBy(desc(MockInterview.id));
}

export async function createInterview({
  jsonMockResp,
  jobPosition,
  jobDesc,
  jobExperience,
  parsedResume,
}) {
  const email = await requireEmail();
  return db
    .insert(MockInterview)
    .values({
      mockId: uuidv4(),
      jsonMockResp,
      jobPosition: jobPosition || "Resume-based Interview",
      jobDesc: jobDesc || "N/A",
      jobExperience: jobExperience || "N/A",
      parsedResume: parsedResume || null,
      createdBy: email,
      createdAt: now(),
    })
    .returning({ mockId: MockInterview.mockId });
}

export async function getInterviewById(mockId) {
  const email = await requireEmail();
  const result = await db
    .select()
    .from(MockInterview)
    .where(
      and(eq(MockInterview.mockId, mockId), eq(MockInterview.createdBy, email))
    );
  return result[0] ?? null;
}

export async function saveInterviewAnswer({
  mockIdRef,
  question,
  correctAns,
  userAns,
  feedback,
  rating,
}) {
  const email = await requireEmail();
  await db.insert(UserAnswer).values({
    mockIdRef,
    question,
    correctAns,
    userAns,
    feedback: feedback || "",
    rating: rating || "",
    userEmail: email,
    createdAt: now(),
  });
}

export async function getInterviewFeedback(mockId) {
  const email = await requireEmail();
  return db
    .select()
    .from(UserAnswer)
    .where(and(eq(UserAnswer.mockIdRef, mockId), eq(UserAnswer.userEmail, email)))
    .orderBy(UserAnswer.id);
}

// ---------- Cover letters ----------

export async function getUserCoverLetters() {
  const email = await requireEmail();
  return db
    .select()
    .from(CoverLetterDesc)
    .where(eq(CoverLetterDesc.userEmail, email))
    .orderBy(desc(CoverLetterDesc.id));
}

export async function updateCoverLetter(coverLetterId, coverLetter) {
  const email = await requireEmail();
  await db
    .update(CoverLetterDesc)
    .set({ coverLetter, updatedAt: now() })
    .where(
      and(
        eq(CoverLetterDesc.coverLetterId, coverLetterId),
        eq(CoverLetterDesc.userEmail, email)
      )
    );
}
