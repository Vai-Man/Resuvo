import { Button } from "@/components/ui/button";
import React from "react";
import { useRouter } from "next/navigation";
import { HelpCircle, Zap, Calendar } from "lucide-react";

const QuestionCardList = ({ questionItem }) => {
  const router = useRouter();

  // Parse the question JSON safely
  let someQuestion = {};
  try {
    someQuestion =
      typeof questionItem.question === "string"
        ? JSON.parse(questionItem.question)
        : questionItem.question;
  } catch {
    someQuestion = { question: questionItem.question, answer: "" };
  }

  // Determine title to display
  const displayTitle =
    someQuestion.questionTitle ||
    (someQuestion.question.length > 25
      ? someQuestion.question.substring(0, 25) + "..."
      : someQuestion.question);

  // Difficulty color mapping
  const difficultyColors = {
    Easy: "bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800",
    Medium: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800",
    Hard: "bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800",
  };

  return (
    <div className="group relative rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300 overflow-hidden flex flex-col h-full p-6 shadow-sm hover:shadow-md">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400">
          <HelpCircle className="w-5 h-5" />
        </div>
      </div>

      <h2 className="font-bold text-lg mb-2 line-clamp-2">{displayTitle}</h2>
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
        <span className="truncate">{questionItem.topic}</span>
      </div>

      {/* Difficulty Badge */}
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium w-fit mb-4 ${difficultyColors[questionItem.difficulty] || 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-800'}`}>
        <Zap className="w-3 h-3" />
        {questionItem.difficulty}
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
        <Calendar className="w-4 h-4" />
        <span>Created: {questionItem.createdAt?.slice(0, 10)}</span>
      </div>

      {/* Button */}
      <Button
        size="sm"
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium mt-auto"
        onClick={() =>
          router.push(`/dashboard/questions/${questionItem.questionId}`)
        }
      >
        View Question
      </Button>
    </div>
  );
};

export default QuestionCardList;
