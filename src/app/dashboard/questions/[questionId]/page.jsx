import { Loader2Icon } from "lucide-react"
import { Suspense } from "react"
import { Question } from "@/utils/schema"
import { NewQuestionClientPage } from "./_components/NewQuestionClientPage"
import { db } from "@/utils/db"
import { eq } from "drizzle-orm"

export default async function AnswerPage({
  params
}) {
  const { questionId } = await params;

  console.log("questionId in page.jsx:", questionId);

  return (
    <Suspense
      fallback={
        <div className="h-screen-header flex items-center justify-center">
          <Loader2Icon className="animate-spin size-24" />
        </div>
      }
    >
      <SuspendedComponent questionId={questionId} />
    </Suspense>
  )
}

async function SuspendedComponent({ questionId }) {



  const questionData=await db.select().from(Question).where(eq(Question.questionId, questionId));

  return <NewQuestionClientPage questionId={questionId} questionData={questionData[0]} />
}