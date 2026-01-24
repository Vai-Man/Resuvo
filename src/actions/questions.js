"use server";

import { db } from "@/utils/db";
import { QuestionAnswer } from "@/utils/schema";
import { auth } from "@clerk/nextjs/server";
import moment from "moment";
import { fetchAIResponse } from "@/utils/GeminiAIModal";

export async function submitQuestionAnswer({ questionId, answer, question, questionTitle, originalAnswer }) {
  const user = await auth();

  // console.log("question:", question);
  // console.log("questionTitle:", questionTitle);
  // console.log("originalAnswer:", originalAnswer);
  // console.log("submitted answer:", answer);
  
  if (!user?.userId) {
    throw new Error("Unauthorized");
  }

  if (!answer?.trim()) {
    throw new Error("Answer cannot be empty");
  }

   if (!answer || answer.trim().length === 0) {
    return { rating: 1, feedback: "No answer provided." };
  }

  const normalizedQuestion = question.replace(/\s+/g, "").toLowerCase();
  const normalizedAnswer = answer.replace(/\s+/g, "").toLowerCase();

  if (normalizedAnswer === normalizedQuestion) {
    return { rating: 1, feedback: "Answer is identical to the question and does not provide a solution." };
  }

  if (answer.trim().length < 10) { // arbitrary minimal length
    return { rating: 1, feedback: "Answer is too short to be meaningful." };
  }


  const feedbackPrompt = ` Return the response in JSON format having {"rating": "...", "feedback": "..."} for following: 
  Question: ${question}. Do not include question in your evaluation process. The user given answer starts now, Answer: ${answer}. Remember the answer should be trying to answer the question. If it is irrelevant, say so. The answer should only be in some kind of code, if not give a low rating and say so. Remember that the question is there and answer should try to solve the problem. Please assess the quality of the answer on a scale from 1 to 10, where 1 is poor and 10 is excellent. Provide constructive feedback on how the answer could be improved. If a solution isn't provided, then it doesn't exist, keep that in mind. Be as harsh as you want.`;

  const responseText = await fetchAIResponse(feedbackPrompt);

  // Clean Gemini response
  const cleanedResponse = responseText
    .trim()
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .replace(/[\u0000-\u001F]+/g, "");

    // console.log("Cleaned Response:", cleanedResponse);

  let jsonResponse;
  try {
    jsonResponse = JSON.parse(cleanedResponse);
  } catch (parseError) {
    console.error("Error parsing JSON:", parseError);
    throw new Error("Failed to parse feedback");
  }

  const sanitizedAnswer = answer.toString().replace(/\0/g, "");

  // Insert into DB
  await db.insert(QuestionAnswer).values({
    questionIdRef: questionId,
    answer: sanitizedAnswer,
    feedback: jsonResponse?.feedback || "",
    rating: jsonResponse?.rating?.toString() || "",
    createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    createdBy: user.userId,
  });

  return {
    feedback: jsonResponse?.feedback || "",
    rating: jsonResponse?.rating || "",
  };
}