"use client"

import React, { useState, useRef } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  UploadIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import pdfToText from "react-pdftotext"
import { analyzeResume } from "@/actions/resume-analyzer"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ResumePageClient() {
  const [isDragOver, setIsDragOver] = useState(false)
  const [fileName, setFileName] = useState("")
  const [parsedResume, setParsedResume] = useState("")
  const [aiAnalysis, setAiAnalysis] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [jobTitle, setJobTitle] = useState("")
  const [jobExperience, setJobExperience] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const fileRef = useRef(null)

  // --- Handle resume upload ---
  const handleFileUpload = (file) => {
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit")
      return
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ]

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF, Word document, or text file")
      return
    }

    fileRef.current = file
    setFileName(file.name)

    pdfToText(file)
      .then((text) => {
        setParsedResume(text)
        toast.success("Resume text extracted ✅")
      })
      .catch((error) => {
        toast.error("Failed to extract text")
        console.error(error)
      })
  }

  // --- Handle AI analysis ---
  const handleAnalyze = async () => {
    if (!fileRef.current || !parsedResume) {
      toast.error("Upload and extract resume first!")
      return
    }

    if (!jobTitle || !jobExperience || !jobDescription) {
      toast.error("Please fill all job details before analyzing")
      return
    }

    setIsLoading(true)
    try {
      const res = await analyzeResume({
        jobTitle,
        jobExperience,
        jobDescription,
        resumeContent: parsedResume,
      })
      setAiAnalysis(res)
      toast.success("Analysis complete ✅")
    } catch (e) {
      toast.error("Failed to analyze resume")
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  // --- Reset form for another resume ---
  const handleReset = () => {
    setFileName("")
    setParsedResume("")
    setAiAnalysis(null)
    setJobTitle("")
    setJobExperience("")
    setJobDescription("")
    fileRef.current = null
  }

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto">
      {/* --- Upload & Job Form --- */}
      {!aiAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle>
              {isLoading ? "Analyzing your resume..." : "Upload your resume"}
            </CardTitle>
            <CardDescription>
              {isLoading
                ? "This may take a couple of minutes"
                : "Get personalized feedback on your resume based on the job"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 mb-6">
              <div>
                <label className="text-sm font-medium">Job Title</label>
                <Input
                  placeholder="e.g. Frontend Developer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Experience Level</label>
                <Input
                  placeholder="e.g. Fresher, 2 years"
                  value={jobExperience}
                  onChange={(e) => setJobExperience(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Job Description</label>
                <Textarea
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
            </div>

            {/* --- Resume Upload --- */}
            <div
              className={cn(
                "mt-2 border-2 border-dashed rounded-lg p-6 transition-colors relative",
                isDragOver
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/50 bg-muted/10"
              )}
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragOver(true)
              }}
              onDragLeave={(e) => {
                e.preventDefault()
                setIsDragOver(false)
              }}
              onDrop={(e) => {
                e.preventDefault()
                setIsDragOver(false)
                handleFileUpload(e.dataTransfer.files[0])
              }}
            >
              <label htmlFor="resume-upload" className="sr-only">
                Upload your resume
              </label>
              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="opacity-0 absolute inset-0 cursor-pointer"
                onChange={(e) => handleFileUpload(e.target.files?.[0])}
              />
              <div className="flex flex-col items-center justify-center text-center gap-4">
                <UploadIcon className="size-12 text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-lg">Drag your resume here or click to upload</p>
                  <p className="text-xs text-muted-foreground">
                    Supported: PDF, Word, or TXT (Max 10MB)
                  </p>
                  {fileName && (
                    <p className="text-sm text-primary font-medium">
                      Uploaded: {fileName}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={!parsedResume || isLoading}
              className="w-full mt-6"
            >
              {isLoading ? "Analyzing..." : "Analyze Resume"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* --- AI Analysis Results --- */}
      {aiAnalysis && (
        <AnalysisResults aiAnalysis={aiAnalysis} onReset={handleReset} />
      )}
    </div>
  )
}

// ---------------------- RESULTS UI ----------------------
function AnalysisResults({ aiAnalysis, onReset }) {
  const sections = {
    ats: "ATS Compatibility",
    jobMatch: "Job Match",
    writingAndFormatting: "Writing & Formatting",
    keywordCoverage: "Keyword Coverage",
    other: "Additional Insights",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis Results</CardTitle>
        <CardDescription>Overall Score: {aiAnalysis.overallScore}/10</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple">
          {Object.entries(sections).map(([key, title]) => {
            const category = aiAnalysis[key]
            return (
              <AccordionItem key={key} value={key}>
                <AccordionTrigger>
                  <CategoryAccordionHeader title={title} score={category.score} />
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-foreground/80 mb-4">{category.summary}</p>
                  <div className="space-y-3">
                    {category.feedback.map((f, i) => (
                      <FeedbackItem key={i} {...f} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>

        {/* --- Reset Button --- */}
        <Button
          variant="outline"
          className="w-full mt-6"
          onClick={onReset}
        >
          Analyze Another Resume
        </Button>
      </CardContent>
    </Card>
  )
}

// ---------------------- ACCORDION HEADER ----------------------
function CategoryAccordionHeader({ title, score }) {
  let badge
  if (score >= 8)
    badge = <Badge className="bg-green-100 text-green-700">Excellent</Badge>
  else if (score >= 6)
    badge = <Badge className="bg-yellow-100 text-yellow-800">Ok</Badge>
  else badge = <Badge variant="destructive">Needs Work</Badge>

  return (
    <div className="flex justify-between w-full items-start">
      <div className="flex flex-col items-start gap-1">
        <span>{title}</span>
        {badge}
      </div>
      <span>{score}/10</span>
    </div>
  )
}

// ---------------------- FEEDBACK ITEM ----------------------
function FeedbackItem({ type, name, message }) {
  const colorMap = {
    strength: "bg-primary/10 border border-primary/40",
    "minor-improvement": "bg-yellow-100/20 border border-yellow-400/50",
    "major-improvement": "bg-destructive/10 border border-destructive/40",
  }

  const iconMap = {
    strength: <CheckCircleIcon className="size-4 text-primary mt-0.5" />,
    "minor-improvement": <AlertCircleIcon className="size-4 text-yellow-500 mt-0.5" />,
    "major-improvement": <XCircleIcon className="size-4 text-destructive mt-0.5" />,
  }

  return (
    <div
      className={cn(
        "flex gap-3 p-3 rounded-md border text-sm items-start",
        colorMap[type]
      )}
    >
      {iconMap[type]}
      <div>
        <p className="font-semibold">{name}</p>
        <p>{message}</p>
      </div>
    </div>
  )
}
