"use client";

import { useRef, useState } from "react";
import { BackLink } from "@/components/BackLink";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { submitQuestionAnswer } from "@/actions/questions";
import Editor from "@monaco-editor/react";

export function NewQuestionClientPage({ questionId, questionData }) {
  const [feedback, setFeedback] = useState("");
  const [answer, setAnswer] = useState("");
  const [rating, setRating] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  let parsedQuestion = {};

  try {
    parsedQuestion =
      typeof questionData.question === "string"
        ? JSON.parse(questionData.question)
        : questionData.question;
  } catch (err) {
    console.error("Failed to parse question JSON:", err);
    parsedQuestion = { question: "", questionTitle: "" };
  }

  const question = parsedQuestion.question;
  const questionTitle = parsedQuestion.questionTitle;
  const originalAnswer = parsedQuestion.answer;

  const saveUserAnswerToDb = async () => {
    if (!question) {
      toast.error("This question is not available.");
      return;
    }

    if (!answer.trim()) {
      toast.error("Please provide an answer before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitQuestionAnswer({
        questionId: questionData.questionId,
        answer,
        question,
        questionTitle,
        originalAnswer,
      });

      setRating(result.rating);
      setFeedback(result.feedback);
      toast.success("Answer saved successfully!");
      setAnswer("");
    } catch (error) {
      console.error("Error saving answer:", error);
      toast.error(error.message || "Error saving answer. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-[2000px] mx-auto flex-grow h-screen-header">
      <div className="container flex gap-4 mt-4 items-center justify-between">
        <div className="flex-grow basis-0">
          <BackLink href={`/dashboard/questions`}>
            Questions Dashboard
          </BackLink>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={saveUserAnswerToDb}
            disabled={isSubmitting || !answer.trim()}
            size="sm"
          >
            <LoadingSwap isLoading={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Answer"}
            </LoadingSwap>
          </Button>
        </div>

        <div className="flex-grow hidden md:block" />
      </div>

      <QuestionContainer
        questionTitle={questionTitle}
        question={question}
        feedback={feedback}
        rating={rating}
        answer={answer}
        setAnswer={setAnswer}
      />
    </div>
  );
}

function QuestionContainer({
  questionTitle,
  question,
  feedback,
  rating,
  answer,
  setAnswer,
}) {
  const editorRef = useRef(null);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  function handleEditorChange(value, event) {
    setAnswer(value);
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="flex-grow border-t">
      <ResizablePanel id="question-and-feedback" defaultSize={50} minSize={5}>
        <ResizablePanelGroup direction="vertical" className="flex-grow">
          <ResizablePanel id="question" defaultSize={25} minSize={5}>
            <ScrollArea className="h-full min-w-48 *:h-full p-4">
              {questionTitle && (
                <h2 className="text-xl font-bold mb-3">{questionTitle}</h2>
              )}
              {question && (
                <MarkdownRenderer className="p-0">{question}</MarkdownRenderer>
              )}
            </ScrollArea>
          </ResizablePanel>

          {feedback && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel id="feedback" defaultSize={75} minSize={5}>
                <ScrollArea className="h-full min-w-48 *:h-full p-4">
                  <div className="mb-2 font-semibold text-lg">
                    Feedback: {rating ?? "-"} / 10
                  </div>
                  <MarkdownRenderer className="p-0">{feedback}</MarkdownRenderer>
                </ScrollArea>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </ResizablePanel>

      <ResizableHandle withHandle />
      <ResizablePanel id="answer" defaultSize={50} minSize={5}>
        <ScrollArea className="h-full min-w-48 *:h-full p-4">
          {/* <Textarea
            onChange={(e) => setAnswer(e.target.value)}
            value={answer ?? ""}
            placeholder="Type your answer here..."
            className="w-full h-full resize-none border-none rounded-none focus-visible:ring focus-visible:ring-inset !text-base p-4"
          /> */}
          <Editor
                    height={"70vh"}
                    theme="vs-dark"
                    value={answer}
                    onChange={handleEditorChange}
                    onMount={onMount}
                  />
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
