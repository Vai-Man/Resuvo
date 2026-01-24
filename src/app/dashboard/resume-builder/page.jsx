import { getResume } from "@/actions/resume";
import ResumeBuilder from "./_components/ResumeBuilder";
import { FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ResumePage() {
  const resume = await getResume();

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
          <div className="w-12 h-12 rounded-lg bg-purple-500/20 text-purple-500 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">Resume Builder</h1>
            <p className="text-lg text-muted-foreground">Create professional resumes with intelligent AI-assisted content suggestions and real-time preview.</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 md:px-20 pb-20">
        <ResumeBuilder initialContent={resume?.[0]?.content} />
      </div>
    </div>
  );
}