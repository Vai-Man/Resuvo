import { Loader2Icon, ArrowLeft, FileSearch } from "lucide-react";
import { Suspense } from "react";
import ResumePageClient from "./_components/ResumePageClient";
import Link from "next/link";

export default async function ResumeAnalyzerPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="px-6 md:px-20 pt-8 pb-12">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
            <FileSearch className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">Resume Analyzer</h1>
            <p className="text-lg text-muted-foreground">Get ATS-optimized feedback and improve your resume's impact with AI-powered suggestions for keywords, formatting, and structure.</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 md:px-20 pb-20">
        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <Loader2Icon className="animate-spin w-8 h-8 text-muted-foreground" />
          </div>
        }>
          <SuspendedComponent />
        </Suspense>
      </div>
    </div>
  );
}

async function SuspendedComponent() {
  return <ResumePageClient />;
}
