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
import { db } from "@/utils/db";
import { CoverLetterDesc } from "@/utils/schema";
import { fetchAIResponse } from "@/utils/GeminiAIModal";
import { useUser } from "@clerk/clerk-react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import moment from "moment";
import { generateCoverLetter } from "@/actions/cover-letter";

const AddNewCoverLetter = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useUser();
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!jobPosition.trim() || !companyName.trim() || !jobDesc.trim()) {
      return alert("Please fill in all required fields.");
    }

    console.log("Generating cover letter for:", user);

    const fullName = user?.fullName || "Anonymous";
    const email = user?.primaryEmailAddress?.emailAddress || "unknown";

    setLoading(true);
    try {
      
        const output = await generateCoverLetter(fullName, jobDesc, jobPosition, companyName, skills, experience, email);

      if (output) {
        setOpenDialog(false);
        // console.log("Generated cover letter:", output);
        router.push(`/dashboard/cover-letter/${output[0].id}`);
      }

      // Reset form
      setJobPosition("");
      setCompanyName("");
      setExperience("");
      setSkills("");
      setJobDesc("");
    } catch (error) {
      console.error("Error generating cover letter:", error);
      alert("Failed to generate cover letter. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans">
      {/* Add New Button */}
      <div
        className="p-10 border border-border rounded-2xl
                   bg-gradient-to-br from-rose-100/60 to-pink-100/40 dark:from-rose-900/20 dark:to-pink-800/10
                   hover:border-primary/50 hover:shadow-lg hover:scale-[1.02]
                   cursor-pointer transition-all duration-300 flex items-center justify-center"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg font-semibold text-foreground">+ Generate AI Cover Letter</h2>
      </div>

      {/* Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl rounded-2xl shadow-2xl border border-border p-0 overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-border">
            <DialogTitle className="text-2xl font-bold text-foreground">
              Generate a New Cover Letter
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-2">Create a compelling, job-specific cover letter instantly</p>
          </div>

          <DialogDescription asChild>
            <div className="px-6 py-6">
                <form onSubmit={onSubmit} className="space-y-5">
                  {/* Job Position */}
                  <Input
                    placeholder="Job Position (e.g., Software Engineer Intern)"
                    required
                    value={jobPosition}
                    onChange={(e) => setJobPosition(e.target.value)}
                    className="border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/50 focus:outline-none rounded-lg h-11 transition-all duration-200"
                  />

                  {/* Company Name */}
                  <Input
                    placeholder="Company Name"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/50 focus:outline-none rounded-lg h-11 transition-all duration-200"
                  />

                  {/* Experience */}
                  <Input
                    placeholder="Experience (e.g., Final-year B.Tech student in CS)"
                    required
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/50 focus:outline-none rounded-lg h-11 transition-all duration-200"
                  />

                  {/* Skills */}
                  <Input
                    placeholder="Skills (comma-separated, e.g., Java, React, Firebase)"
                    required
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/50 focus:outline-none rounded-lg h-11 transition-all duration-200"
                  />

                  {/* Job Description */}
                  <Textarea
                    placeholder="Paste the job description or key requirements"
                    required
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                    className="border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/50 focus:outline-none min-h-[120px] rounded-lg transition-all duration-200"
                  />

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
                        "Generate Cover Letter"
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
};

export default AddNewCoverLetter;
