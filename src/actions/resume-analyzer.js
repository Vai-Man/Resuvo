"use server";

import { db } from "@/utils/db";
import { QuestionAnswer } from "@/utils/schema";
import { auth } from "@clerk/nextjs/server";
import moment from "moment";
import { fetchAIResponse } from "@/utils/GeminiAIModal";

export async function analyzeResume({ jobTitle, jobExperience, jobDescription, resumeContent }) {
  const user = await auth();

//   console.log("jobTitle:", jobTitle);
//   console.log("jobExperience:", jobExperience);
//   console.log("jobDescription:", jobDescription);
//   console.log("resumeContent:", resumeContent);

  if (!user?.userId) {
    throw new Error("Unauthorized");
  }

  const currentDate = moment().format("MMMM DD, YYYY");

  const feedbackPrompt = `You are an expert resume reviewer and hiring advisor. Today's date is ${currentDate}.

You will receive a candidate's resume as a file in the user prompt. This resume is being used to apply for a job with the following information:

Job Description:
\`\`\`
${jobDescription}
\`\`\`
Experience Level: ${jobExperience}
${jobTitle ? `\nJob Title: ${jobTitle}` : ""}
Resume Content:
\`\`\`
${resumeContent}
\`\`\`

Your task is to evaluate the resume against the job requirements and provide structured feedback using the following categories:

1. **ats** - Analysis of how well the resume matches ATS (Applicant Tracking System) requirements.
   - Consider layout simplicity, use of standard section headings, avoidance of graphics or columns, consistent formatting, etc.

2. **jobMatch** - Analysis of how well the resume aligns with the job description and experience level.
   - Assess skills, technologies, achievements, and relevance.

3. **writingAndFormatting** - Analysis of the writing quality, tone, grammar, clarity, and formatting.
   - Comment on structure, readability, section organization, and consistency.
   - Be sure to consider the wording and formatting of the job description when evaluating the resume so you can recommend specific wording or formatting changes that would improve the resume's alignment with the job requirements.

4. **keywordCoverage** - Analysis of how well the resume includes keywords or terminology from the job description.
   - Highlight missing or well-used terms that might help with ATS matching and recruiter readability.
   - Be sure to consider the keywords used in the job description when evaluating the resume so you can recommend specific keywords that would improve the resume's alignment with the job requirements.

5. **other** - Any other relevant feedback not captured above.
   - This may include things like missing contact info, outdated technologies, major red flags, or career gaps.

For each category, return:
- \`score\` (1-10): A number rating the resume in that category.
- \`summary\`: A short, high-level summary of your evaluation.
- \`feedback\`: An array of structured feedback items:
  - \`type\`: One of \`"strength"\`, \`"minor-improvement"\`, or \`"major-improvement"\`
  - \`name\`: A label for the feedback item.
  - \`message\`: A specific and helpful explanation or recommendation.

Also return an overall score for the resume from 1-10 based on your analysis.

Only return the structured JSON response in the following format : {"overallScore": ..., "ats": ..., "jobMatch": ..., "writingAndFormatting": ..., "keywordCoverage": ..., "other": ...}. Do not include explanations, markdown, or extra commentary outside the defined format.

Other Guidelines:
- Tailor your analysis and feedback to the specific job description and experience level provided.
- Be clear, constructive, and actionable. The goal is to help the candidate improve their resume so it is ok to be critical.
- Refer to the candidate as "you" in your feedback. This feedback should be written as if you were speaking directly to the candidate.
- Stop generating output as soon you have provided the full feedback.
`;

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

  return {
    overallScore: jsonResponse?.overallScore || null,
    ats: jsonResponse?.ats || null,
    jobMatch: jsonResponse?.jobMatch || null,
    writingAndFormatting: jsonResponse?.writingAndFormatting || null,
    keywordCoverage: jsonResponse?.keywordCoverage || null,
    other: jsonResponse?.other || null,
  };
}