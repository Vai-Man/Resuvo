"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";
import { db } from "@/utils/db";
import { Question } from "@/utils/schema";
import moment from "moment";
import { fetchAIResponse } from "@/utils/GeminiAIModal";
import { useUser } from "@clerk/clerk-react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

function AddNewQuestion() {
  const [openDialog, setOpenDialog] = useState(false);
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return alert("Please enter a topic or technology.");

    setLoading(true);
    try {
      // AI prompt to generate question + answer in JSON format
      const prompt = `Generate one ${difficulty.toLowerCase()} interview coding or machine round question about "${topic}" and provide the answer. The question should not be that easy that even a beginner is able to do it. Respond in JSON format like: {"question": "...","questionTitle":"...", "answer": "..."}. questionTitle should be a short title for the question.`;
      const responseText = await fetchAIResponse(prompt);
      
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
              toast.error("Failed to parse feedback. Try again.");
              setLoading(false);
              return;
            }

      const output=await db.insert(Question).values({
        question: jsonResponse,
        difficulty,
        createdBy: user?.primaryEmailAddress?.emailAddress || "AI",
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        topic,
        questionId: uuidv4()
      }).returning({ questionId: Question.questionId });

      if (output) {
        setOpenDialog(false);
        router.push(`/dashboard/questions/${output[0].questionId}`);
      }
      setTopic("");
      setDifficulty("Easy");
    } catch (error) {
      console.error("Error generating question:", error);
      alert("Failed to generate question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans">
      {/* Add New Button */}
      <div
        className="p-10 border border-border rounded-2xl
                   bg-gradient-to-br from-orange-100/60 to-amber-100/40 dark:from-orange-900/20 dark:to-amber-800/10
                   hover:border-primary/50 hover:shadow-lg hover:scale-[1.02]
                   cursor-pointer transition-all duration-300 flex items-center justify-center"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg font-semibold text-foreground">+ Generate AI Question</h2>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl rounded-2xl shadow-2xl border border-border p-0 overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-border">
            <DialogTitle className="text-2xl font-bold text-foreground">
              Generate a New Question
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-2">Master coding challenges with detailed AI explanations</p>
          </div>

          <DialogDescription asChild>
            <div className="px-6 py-6">
                <form onSubmit={onSubmit} className="space-y-5">
                  {/* Topic Input */}
                  <Input
                    placeholder="Enter topic or technology (e.g., ReactJS, SQL)"
                    required
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/50 focus:outline-none rounded-lg h-11 transition-all duration-200"
                  />

                  {/* Difficulty Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Difficulty Level</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full border border-border rounded-lg bg-background text-foreground px-4 py-2.5 focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all duration-200"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-4 mt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setOpenDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
                    >
                      {loading ? (
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        "Generate Question"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewQuestion;
