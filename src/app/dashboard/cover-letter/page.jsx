import { Loader2Icon, ArrowLeft, PenTool } from "lucide-react";
import { Suspense } from "react";
import AddNewCoverLetter from "./_components/AddNewCoverLetter";
import CoverLetterList from "./_components/CoverLetterList";
import Link from "next/link";

export default async function CoverLetterPage() {
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
          <div className="w-12 h-12 rounded-lg bg-rose-500/20 text-rose-500 flex items-center justify-center">
            <PenTool className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">Cover Letters</h1>
            <p className="text-lg text-muted-foreground">Generate compelling, job-specific cover letters that align with job descriptions and showcase your unique value.</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 md:px-20 pb-20">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <Loader2Icon className="animate-spin w-8 h-8 text-muted-foreground" />
            </div>
          }
        >
          <SuspendedComponent />
        </Suspense>
      </div>
    </div>
  );
}

const SuspendedComponent = () => {
  return (
    <div>
      {/* Add New Section */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-6">Create a New Cover Letter</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <AddNewCoverLetter />
        </div>
      </div>

      {/* Cover Letters List */}
      <div>
        <h2 className="text-xl font-semibold mb-6">Your Cover Letters</h2>
        <CoverLetterList />
      </div>
    </div>
  );
};
