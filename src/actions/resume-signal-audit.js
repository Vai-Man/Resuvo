"use server";

import { auth } from "@clerk/nextjs/server";
import { fetchAIResponse } from "@/utils/GeminiAIModal";
import moment from "moment";

export async function analyzeResumeSignal({ resumeContent }) {
  const user = await auth();

  if (!user?.userId) {
    throw new Error("Unauthorized");
  }

  const currentDate = moment().format("MMMM DD, YYYY");

  const systemPrompt = `You are an evaluation system, not a resume writer. Today's date is ${currentDate}.

Your task is to analyze the provided resume text.
Do NOT rewrite or improve the resume.
Operate ONLY on the given content.

GOAL:
Identify (1) claims and whether they are supported by evidence,
and (2) vague or overconfident language that weakens hiring signal.

DEFINITIONS:
- A "claim" is any statement asserting impact, skill, or achievement.
- "Evidence" includes metrics, concrete outcomes, tools used, or clear mechanisms.
- "Vague language" includes unquantified adjectives (e.g., significant, major),
  weak verbs (e.g., worked on, helped with), or absolutes (e.g., best, always).

INSTRUCTIONS:
1. Split the resume into individual bullet points or statements.
2. For EACH bullet point:
   a. Extract the primary claim.
   b. Determine whether supporting evidence is present.
   c. Flag vague or overconfident phrases if any.
   d. State what is missing, if applicable.
3. Do NOT assume missing information implies lack of skill.
4. Explicitly state uncertainty where appropriate.
5. Do NOT assign an overall resume score.

Return the analysis in this EXACT JSON format (no markdown, no code blocks):
{
  "analysis": [
    {
      "original_text": "<bullet point>",
      "claim": "<core claim>",
      "evidence_present": true | false,
      "evidence_type": "<metrics | tools | outcomes | none>",
      "vagueness_flags": ["<phrase>", "..."],
      "overconfidence_flags": ["<phrase>", "..."],
      "missing_information": "<what would strengthen this claim>",
      "evaluation_uncertainty": "<what cannot be inferred from this text>"
    }
  ],
  "summary": {
    "high_risk_patterns": ["<pattern>", "..."],
    "global_uncertainty": "This analysis evaluates signal quality, not actual competence."
  }
}

REMINDERS:
- Do not hallucinate metrics.
- Absence of evidence is NOT evidence of absence.
- Be concise and neutral.`;

  const feedbackPrompt = `${systemPrompt}

Analyze this resume:
\`\`\`
${resumeContent}
\`\`\`

Provide ONLY the JSON response, no other text.`;

  try {
    const responseText = await fetchAIResponse(feedbackPrompt);

    // Clean Gemini response
    const cleanedResponse = responseText
      .trim()
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .replace(/[\u0000-\u001F]+/g, "");

    let jsonResponse;
    try {
      jsonResponse = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      throw new Error("Failed to parse analysis response");
    }

    return jsonResponse;
  } catch (error) {
    console.error("Error analyzing resume signal:", error);
    throw error;
  }
}
