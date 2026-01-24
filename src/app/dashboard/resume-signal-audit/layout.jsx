import { BackLink } from "@/components/BackLink";
import { Zap } from "lucide-react";
import ResumeSignalAuditClient from "./page";

export default function ResumeSignalAuditLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="px-6 md:px-20 py-8 md:py-12">
        <BackLink href="/dashboard">Back to Dashboard</BackLink>
        
        <div className="max-w-4xl mx-auto mt-4">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 dark:from-amber-900/30 dark:to-orange-800/30 flex items-center justify-center border border-primary/20">
              <Zap className="w-7 h-7 text-amber-600" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">
                Resume Signal <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">Audit</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Identify unsupported claims, vague language, and hiring signal weaknesses in your resume. Our AI evaluates claim-evidence alignment to strengthen your impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-20 pb-20 max-w-4xl mx-auto w-full">
        <ResumeSignalAuditClient />
      </section>
    </div>
  );
}
