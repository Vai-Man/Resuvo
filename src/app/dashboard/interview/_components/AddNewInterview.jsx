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
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/clerk-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { fetchAIResponse } from "@/utils/GeminiAIModal";
import { db } from "@/utils/db";
import pdfToText from "react-pdftotext";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [mode, setMode] = useState("job"); // "job" or "resume"
  const [Jobpost, setJobpost] = useState("");
  const [JobDescription, setJobDescription] = useState("");
  const [Experience, setExperience] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [parsedResume, setParsedResume] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const extractText = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setLoading(true);
    pdfToText(file)
      .then((text) => {
        setParsedResume(text);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to extract text from pdf", error);
        setLoading(false);
      });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let Inputprompt = "";

    if (mode === "job") {
      Inputprompt = `Job position: ${Jobpost}, Job Description: ${JobDescription}, Experience: ${Experience}. Based on the Job position, Job Description, and Experience, give me 5 interview questions along with answers in JSON format. Provide both question and answer fields in the JSON. Answers should not contain bold text or markdown formatting.`;
    } else if (mode === "resume") {
      if (!parsedResume) {
        alert("Please upload and parse your resume first.");
        setLoading(false);
        return;
      }
      Inputprompt = `Resume content: ${parsedResume}. Based on this resume, generate 5 interview questions along with answers in JSON format tailored to the candidate's skills. Provide both question and answer fields in the JSON.`;
    }

    try {
      const responseText = await fetchAIResponse(Inputprompt);

      const cleanResponse = responseText
        .trim()
        .replace(/```json/g, "")
        .replace(/```/g, "");

      const output = await db
        .insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: cleanResponse,
          jobPosition: Jobpost || "Resume-based Interview",
          jobDesc: JobDescription || "N/A",
          jobExperience: Experience || "N/A",
          parsedResume: parsedResume || null,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        })
        .returning({ mockId: MockInterview.mockId });

      if (output) {
        setOpenDialog(false);
        router.push(`/dashboard/interview/${output[0].mockId}`);
      }
    } catch (error) {
      console.error("Error fetching interview questions:", error);
      alert(
        "There was an error fetching interview questions. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans">
      {/* Add New Button */}
      <div
        className="p-10 border border-border rounded-2xl 
                   bg-gradient-to-br from-blue-100/60 to-blue-100/40 dark:from-blue-900/20 dark:to-blue-800/10
                   hover:border-primary/50 hover:shadow-lg hover:scale-[1.02]
                   cursor-pointer transition-all duration-300 flex items-center justify-center"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg font-semibold text-foreground">+ Create Mock Interview</h2>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl rounded-2xl shadow-2xl border border-border p-0 overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-border">
            <DialogTitle className="text-2xl font-bold text-foreground">
              Create a new Mock Interview
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-2">Practice with AI-powered interviews tailored to your role</p>
          </div>

          <DialogDescription asChild>
            <div className="px-6 py-6">
                <form onSubmit={onSubmit} className="space-y-5">
                  {/* Mode Selection */}
                  <div className="flex gap-3 bg-muted p-3 rounded-lg border border-border">
                    <label className="flex-1 flex items-center gap-2 cursor-pointer px-3 py-2 rounded-md transition-all duration-200" style={{backgroundColor: mode === 'job' ? 'rgba(59, 130, 246, 0.15)' : 'transparent'}}>
                      <input
                        type="radio"
                        value="job"
                        checked={mode === "job"}
                        onChange={() => setMode("job")}
                        className="accent-primary"
                      />
                      <span className={mode === 'job' ? 'font-semibold text-primary' : 'text-muted-foreground'}>Job-based</span>
                    </label>
                    <label className="flex-1 flex items-center gap-2 cursor-pointer px-3 py-2 rounded-md transition-all duration-200" style={{backgroundColor: mode === 'resume' ? 'rgba(59, 130, 246, 0.15)' : 'transparent'}}>
                      <input
                        type="radio"
                        value="resume"
                        checked={mode === "resume"}
                        onChange={() => setMode("resume")}
                        className="accent-primary"
                      />
                      <span className={mode === 'resume' ? 'font-semibold text-primary' : 'text-muted-foreground'}>Resume-based</span>
                    </label>
                  </div>

                  {/* Job Mode Inputs */}
                  {mode === "job" && (
                    <div className="space-y-3">
                      <Input
                        placeholder="Job Title"
                        required
                        onChange={(e) => setJobpost(e.target.value)}
                        className="border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/50 focus:outline-none rounded-lg h-11 transition-all duration-200"
                      />
                      <Textarea
                        placeholder="Job Description / Tech Stack"
                        required
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/50 focus:outline-none rounded-lg transition-all duration-200 min-h-[100px]"
                      />
                      <Input
                        placeholder="Experience (years)"
                        type="number"
                        max="50"
                        required
                        onChange={(e) => setExperience(e.target.value)}
                        className="border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/50 focus:outline-none rounded-lg h-11 transition-all duration-200"
                      />
                    </div>
                  )}

                  {/* Resume Mode Inputs */}
                  {mode === "resume" && (
                    <div className="space-y-3">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={extractText}
                        className="w-full border border-border rounded-lg bg-background text-foreground px-4 py-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 file:mr-3 file:px-3 file:py-1 file:rounded file:border-0 file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all duration-200"
                      />
                      {loading && (
                        <p className="text-muted-foreground text-sm animate-pulse">
                          Parsing resume...
                        </p>
                      )}
                      {parsedResume && (
                        <div className="p-4 border border-border bg-muted rounded-lg text-sm max-h-40 overflow-auto">
                          <strong className="text-foreground">Parsed Resume Preview:</strong>
                          <p className="text-muted-foreground mt-2">
                            {parsedResume.substring(0, 500)}
                            {parsedResume.length > 500 ? "..." : ""}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

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
                      disabled={loading || (mode === "resume" && !parsedResume)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
                    >
                      {loading ? (
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        "Start Interview"
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

export default AddNewInterview;
