"use client";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function InterviewFeedbackWrapper({ params }) {
  // Unwrap params promise safely
  const { interviewId } = React.use(params);
  return <InterviewFeedbackPage interviewId={interviewId} />;
}

const InterviewFeedbackPage = ({ interviewId }) => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true); // entire page loader
  const router = useRouter();

  useEffect(() => {
    GetInterviewData();
  }, []);

  const GetInterviewData = async () => {
    setLoading(true);
    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, interviewId))
      .orderBy(UserAnswer.id);

    setFeedbackData(result);
    calculateAverageRating(result);
    setLoading(false);
  };

  const calculateAverageRating = (data) => {
    if (data.length > 0) {
      const totalRating = data.reduce((sum, item) => {
        const rating = parseFloat(item.rating) || 0;
        return sum + rating;
      }, 0);
      const average = totalRating / data.length;
      setAverageRating(average.toFixed(1));
    }
  };

  if (loading) {
    // Full page loader
    return (
      <div className="flex flex-col justify-center items-center h-screen w-full">
        <p className="text-muted-foreground animate-pulse text-lg">
          Loading feedback...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-semibold text-primary mb-2">
          🎉 Great Job!
        </h2>
        <p className="text-muted-foreground">
          Here's your detailed interview performance report.
        </p>
      </div>

      {feedbackData.length === 0 ? (
        <div className="text-center py-10 bg-muted/30 rounded-lg border border-border">
          <p className="text-destructive font-medium text-lg">
            No feedback found for this interview.
          </p>
        </div>
      ) : (
        <>
          {/* Overall Rating */}
          <div className="bg-card border border-border rounded-lg shadow-sm p-6 mb-8 text-center">
            <h2 className="text-lg font-semibold mb-1 text-foreground">
              Overall Rating
            </h2>
            <p className="text-3xl font-bold text-primary">
              {averageRating}/10
            </p>
          </div>

          <p className="text-sm text-muted-foreground mb-6 text-center">
            Expand each question to review your answers and personalized
            feedback.
          </p>

          {/* Feedback List */}
          <div className="space-y-4">
            {feedbackData.map((data, index) => (
              <Collapsible
                key={index}
                className="border border-border rounded-lg bg-card shadow-sm"
              >
                <CollapsibleTrigger className="flex justify-between items-center px-5 py-3 w-full rounded-lg hover:bg-muted transition-all">
                  <span className="font-medium text-base text-foreground">
                    Question {index + 1}: {data.question}
                  </span>
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="px-5 py-4 border-t border-border bg-muted/40 space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <strong className="text-foreground">Your Rating:</strong>{" "}
                      <span className="text-lg font-semibold text-primary">
                        {data.rating}
                      </span>
                      <span className="text-muted-foreground text-sm">/10</span>
                    </div>

                    <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-sm">
                      <strong className="text-destructive">Your Answer:</strong>{" "}
                      {data.userAns}
                    </div>

                    <div className="p-3 rounded-md bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-800 text-sm">
                      <strong className="text-emerald-700 dark:text-emerald-400">
                        Correct Answer:
                      </strong>{" "}
                      {data.correctAns}
                    </div>

                    <div className="p-3 rounded-md bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-sm text-justify">
                      <strong className="text-blue-700 dark:text-blue-400">
                        Feedback:
                      </strong>{" "}
                      {data.feedback}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </>
      )}

      {/* Go Home Button */}
      <div className="flex justify-center mt-12">
        <Button
          onClick={() => router.replace("/dashboard/interview")}
          className="rounded-lg px-6 py-2 text-base shadow-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
        >
          Go to Interview Dashboard
        </Button>
      </div>
    </div>
  );
};

export default InterviewFeedbackWrapper;
