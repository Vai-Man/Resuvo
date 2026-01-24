import { db } from "@/utils/db";
import { fetchAIResponse } from "@/utils/GeminiAIModal";
import { CoverLetterDesc } from "@/utils/schema";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

export const generateCoverLetter = async (
  fullName,
  jobDesc,
  jobPosition,
  companyName,
  skills,
  experience,
  email
) => {
  // 🔹 Construct AI prompt
  const prompt = `
    Generate a professional and personalized cover letter for:
    - Name: ${fullName}
    - Applying for: ${jobPosition} at ${companyName}
    - Experience: ${experience}
    - Skills: ${skills}
    - Job Description: ${jobDesc}
    
    The letter should sound confident, natural, and concise (around 200–250 words).
    Do not include placeholders; make it sound like a real candidate’s application. Use "newline" to indicate line breaks.
    Return plain text only.
          `;

  const responseText = await fetchAIResponse(prompt);

  // Save to DB
  const output = await db
    .insert(CoverLetterDesc)
    .values({
      jobPosition,
      jobDesc,
      experience,
      userEmail: email || "unknown",
      userName: fullName || "Anonymous",
      skills,
      companyName,
      coverLetter: responseText,
      createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      coverLetterId: uuidv4(),
    })
    .returning({ id: CoverLetterDesc.coverLetterId });

  return output;
};
