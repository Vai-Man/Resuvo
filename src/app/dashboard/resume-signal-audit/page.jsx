"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoaderCircle, AlertCircle, CheckCircle2, Zap, Upload } from "lucide-react";
import { toast } from "sonner";
import { analyzeResumeSignal } from "@/actions/resume-signal-audit";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import pdfToText from "react-pdftotext";
import { cn } from "@/lib/utils";

export default function ResumeSignalAuditClient() {
  const [resumeContent, setResumeContent] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadMode, setUploadMode] = useState("upload"); // "upload" or "paste"
  const [uploadedFileName, setUploadedFileName] = useState("");

  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (!resumeContent.trim()) {
      toast.error("Please upload or paste your resume content");
      return;
    }

    setLoading(true);
    try {
      const result = await analyzeResumeSignal({ resumeContent });
      setAnalysis(result);
      toast.success("Analysis complete ✅");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to analyze resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const extractText = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setUploadedFileName(file.name);
    pdfToText(file)
      .then((text) => {
        setResumeContent(text);
        setLoading(false);
        toast.success(`✅ "${file.name}" uploaded and parsed successfully`);
      })
      .catch((error) => {
        console.error("Failed to extract text from pdf", error);
        toast.error("Failed to parse PDF. Please try again.");
        setUploadedFileName("");
        setLoading(false);
      });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type === "application/pdf") {
      setLoading(true);
      setUploadedFileName(file.name);
      pdfToText(file)
        .then((text) => {
          setResumeContent(text);
          setLoading(false);
          toast.success(`✅ "${file.name}" uploaded and parsed successfully`);
        })
        .catch((error) => {
          console.error("Failed to extract text from pdf", error);
          toast.error("Failed to parse PDF. Please try again.");
          setUploadedFileName("");
          setLoading(false);
        });
    } else {
      toast.error("Please upload a PDF file");
    }
  };

  const toggleItem = (index) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const handleReset = () => {
    setResumeContent("");
    setAnalysis(null);
    setExpandedItems(new Set());
  };

  return (
    <div className="w-full space-y-6">
      {!analysis ? (
        <Card className="border border-primary/20 dark:border-primary/10 bg-gradient-to-br from-card to-card/95 dark:from-slate-900 dark:to-slate-800 rounded-2xl shadow-lg">
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-600/10 dark:from-amber-900/20 dark:to-orange-800/20 px-6 py-4 border-b border-primary/10 rounded-t-2xl">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Resume Signal Audit
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-2">
              Identify unsupported claims, vague language, and hiring signal weaknesses
            </CardDescription>
          </div>

          <CardContent className="pt-6">
            <form onSubmit={handleAnalyze} className="space-y-4">
              {/* Tab Selection */}
              <div className="flex gap-3 bg-muted/50 dark:bg-slate-800/50 p-3 rounded-lg border border-border/50">
                <button
                  type="button"
                  onClick={() => setUploadMode("upload")}
                  className={cn(
                    "flex-1 px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium",
                    uploadMode === "upload"
                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Upload className="w-4 h-4 inline mr-2" />
                  Upload PDF
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode("paste")}
                  className={cn(
                    "flex-1 px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium",
                    uploadMode === "paste"
                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Paste Text
                </button>
              </div>

              {/* Upload Mode */}
              {uploadMode === "upload" && (
                <div
                  className={cn(
                    "mt-2 border-2 border-dashed rounded-lg p-6 transition-colors relative",
                    isDragOver
                      ? "border-amber-500 bg-amber-500/5"
                      : "border-muted-foreground/50 bg-muted/10"
                  )}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                  }}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="resume-upload"
                    accept="application/pdf"
                    onChange={extractText}
                    className="hidden"
                    disabled={loading}
                  />
                  <label
                    htmlFor="resume-upload"
                    className="flex flex-col items-center justify-center cursor-pointer gap-3"
                  >
                    {loading ? (
                      <>
                        <LoaderCircle className="w-8 h-8 text-amber-600 animate-spin" />
                        <p className="text-sm text-muted-foreground">Parsing resume...</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-amber-600" />
                        <div className="text-center">
                          <p className="text-sm font-medium text-foreground">
                            Drop your resume PDF here or click to browse
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PDF files only
                          </p>
                        </div>
                      </>
                    )}
                  </label>
                </div>
              )}

              {/* Paste Mode */}
              {uploadMode === "paste" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Paste Your Resume Content
                  </label>
                  <Textarea
                    placeholder="Paste your entire resume here... We'll analyze each claim and identify vague language."
                    value={resumeContent}
                    onChange={(e) => setResumeContent(e.target.value)}
                    className="border border-border/50 bg-muted/50 dark:bg-slate-800/50 text-card-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-amber-500/50 focus:outline-none rounded-lg min-h-[300px] transition-all duration-200"
                  />
                </div>
              )}

              <div className="flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={handleReset}>
                  Clear
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !resumeContent.trim()}
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <LoaderCircle className="animate-spin w-4 h-4" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Analyze Resume
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Summary Section */}
          <Card className="border border-primary/20 dark:border-primary/10 bg-gradient-to-br from-card to-card/95 dark:from-slate-900 dark:to-slate-800 rounded-2xl shadow-lg">
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-600/10 dark:from-amber-900/20 dark:to-orange-800/20 px-6 py-4 border-b border-primary/10 rounded-t-2xl">
              <CardTitle className="text-lg font-semibold text-foreground">
                Analysis Summary
              </CardTitle>
            </div>
            <CardContent className="pt-6 space-y-4">
              {analysis.summary?.high_risk_patterns && analysis.summary.high_risk_patterns.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">High-Risk Patterns Detected:</p>
                  <div className="space-y-2">
                    {analysis.summary.high_risk_patterns.map((pattern, idx) => (
                      <div
                        key={idx}
                        className="flex gap-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/30"
                      >
                        <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-foreground">{pattern}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-xs text-muted-foreground italic">
                  {analysis.summary?.global_uncertainty || "This analysis evaluates signal quality, not actual competence."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analysis */}
          <Card className="border border-primary/20 dark:border-primary/10 bg-gradient-to-br from-card to-card/95 dark:from-slate-900 dark:to-slate-800 rounded-2xl shadow-lg">
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-600/10 dark:from-amber-900/20 dark:to-orange-800/20 px-6 py-4 border-b border-primary/10 rounded-t-2xl">
              <CardTitle className="text-lg font-semibold text-foreground">
                Bullet Point Analysis ({analysis.analysis?.length || 0} items)
              </CardTitle>
            </div>
            <CardContent className="pt-6 space-y-3">
              {analysis.analysis && analysis.analysis.length > 0 ? (
                analysis.analysis.map((item, index) => (
                  <Collapsible
                    key={index}
                    open={expandedItems.has(index)}
                    onOpenChange={() => toggleItem(index)}
                  >
                    <CollapsibleTrigger asChild>
                      <div className="cursor-pointer p-4 rounded-lg border border-border/50 hover:border-primary/50 bg-muted/30 hover:bg-muted/50 transition-all duration-200">
                        <div className="flex items-start gap-3 justify-between">
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-foreground line-clamp-2">
                              {item.original_text}
                            </p>
                            <div className="flex gap-2 mt-2 flex-wrap">
                              {!item.evidence_present && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/10 text-red-700 dark:text-red-400 text-xs rounded-md border border-red-500/20">
                                  <AlertCircle className="w-3 h-3" />
                                  No Evidence
                                </span>
                              )}
                              {item.evidence_present && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-700 dark:text-green-400 text-xs rounded-md border border-green-500/20">
                                  <CheckCircle2 className="w-3 h-3" />
                                  {item.evidence_type}
                                </span>
                              )}
                              {item.vagueness_flags && item.vagueness_flags.length > 0 && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 text-xs rounded-md border border-yellow-500/20">
                                  <AlertCircle className="w-3 h-3" />
                                  Vague Language
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-muted-foreground">
                            {expandedItems.has(index) ? "−" : "+"}
                          </div>
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-3 pt-3 pl-4 border-l-2 border-primary/20">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Core Claim
                        </p>
                        <p className="text-sm text-foreground bg-muted/50 p-3 rounded-lg border border-border/50">
                          {item.claim}
                        </p>
                      </div>

                      {item.vagueness_flags && item.vagueness_flags.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Vague Language Detected
                          </p>
                          <div className="space-y-2">
                            {item.vagueness_flags.map((flag, idx) => (
                              <div key={idx} className="flex gap-2 p-2 bg-yellow-500/5 rounded border border-yellow-500/20">
                                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-foreground">"{flag}"</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {item.overconfidence_flags && item.overconfidence_flags.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Overconfidence Flags
                          </p>
                          <div className="space-y-2">
                            {item.overconfidence_flags.map((flag, idx) => (
                              <div key={idx} className="flex gap-2 p-2 bg-orange-500/5 rounded border border-orange-500/20">
                                <Zap className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-foreground">"{flag}"</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {item.missing_information && (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Missing Information
                          </p>
                          <p className="text-sm text-foreground bg-blue-500/5 p-3 rounded-lg border border-blue-500/20">
                            {item.missing_information}
                          </p>
                        </div>
                      )}

                      {item.evaluation_uncertainty && (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Evaluation Uncertainty
                          </p>
                          <p className="text-sm text-muted-foreground italic bg-slate-500/5 p-3 rounded-lg border border-slate-500/20">
                            {item.evaluation_uncertainty}
                          </p>
                        </div>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No bullet points found in the analysis
                </p>
              )}
            </CardContent>
          </Card>

          {/* Reset Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleReset}
              variant="outline"
              className="border border-primary/30 hover:bg-primary/10"
            >
              Analyze Another Resume
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
