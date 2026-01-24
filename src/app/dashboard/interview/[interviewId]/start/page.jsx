"use client";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState, useMemo } from "react";
import { db } from "@/utils/db";
import QuestionsList from "./_components/QuestionsList";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Flag, Clock, Gauge, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

function StartInterviewWrapper({ params }) {
  // Unwrap params promise safely
  const { interviewId } = React.use(params);
  return <StartInterview interviewId={interviewId} />;
}

function StartInterview({ interviewId }) {
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestions, setMockInterviewQuestions] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showQuitDialog, setShowQuitDialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchInterviewData();
  }, [interviewId]);

  const fetchInterviewData = async () => {
    try {
      setLoading(true);
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, interviewId));

      if (!result || result.length === 0) {
        console.error("No interview data found for the given interview ID:", interviewId);
        setLoading(false);
        return;
      }

      const questions = JSON.parse(result[0].jsonMockResp);
      setMockInterviewQuestions(questions);
      setInterviewData(result[0]);
    } catch (error) {
      console.error("Error fetching interview details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuitInterview = () => {
    router.push(`/dashboard/interview`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg font-medium text-foreground">Loading interview...</p>
      </div>
    );
  }

  if (!interviewData) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg font-medium text-red-600">Interview not found.</p>
      </div>
    );
  }

  const progressPercent = ((activeQuestionIndex + 1) / mockInterviewQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-border/50">
        <div className="px-6 md:px-20 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center border border-primary/20">
                <Gauge className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Mock Interview</h2>
                <p className="text-xs text-muted-foreground">{interviewData.jobPosition}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="border-red-500/30 text-red-600 hover:bg-red-500/10 hover:text-red-700"
              onClick={() => setShowQuitDialog(true)}
            >
              <Flag className="w-4 h-4 mr-2" />
              Quit Interview
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">
                Question {activeQuestionIndex + 1} of {mockInterviewQuestions.length}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {Math.round(progressPercent)}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 md:px-20 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Questions Panel */}
            <div>
              <QuestionsList
                mockInterviewQuestions={mockInterviewQuestions}
                activeQuestionIndex={activeQuestionIndex}
              />
            </div>

            {/* Recording Panel - Memoized to prevent remounting */}
            <div key={`recording-${interviewId}`}>
              <RecordAnswerSection
                mockInterviewQuestions={mockInterviewQuestions}
                activeQuestionIndex={activeQuestionIndex}
                interviewData={interviewData}
              />
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="mt-12 flex items-center justify-between">
            <Button 
              variant="outline"
              disabled={activeQuestionIndex === 0}
              onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Question {activeQuestionIndex + 1} / {mockInterviewQuestions.length}</span>
            </div>

            {activeQuestionIndex === mockInterviewQuestions.length - 1 ? (
              <Link href={`/dashboard/interview/${interviewId}/feedback`}>
                <Button className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  <Flag className="w-4 h-4" />
                  End Interview & View Feedback
                </Button>
              </Link>
            ) : (
              <Button 
                onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
                className="gap-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Quit Confirmation Dialog */}
      <Dialog open={showQuitDialog} onOpenChange={setShowQuitDialog}>
        <DialogContent className="bg-gradient-to-br from-card to-card/95 dark:from-slate-900 dark:to-slate-800 border border-primary/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Quit Interview?</DialogTitle>
            <DialogDescription className="text-foreground/80 mt-2">
              Are you sure you want to exit this interview? Your progress will be saved, but you won't receive feedback for unanswered questions.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-6">
            <Button 
              variant="outline" 
              onClick={() => setShowQuitDialog(false)}
              className="border border-border/50"
            >
              Continue Interview
            </Button>
            <Button 
              onClick={handleQuitInterview}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Quit Interview
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StartInterviewWrapper;
