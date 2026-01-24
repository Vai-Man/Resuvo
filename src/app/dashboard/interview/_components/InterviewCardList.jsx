import { Button } from "@/components/ui/button";
import React from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Calendar } from "lucide-react";

const InterviewCardList = ({ interview }) => {
  const router = useRouter();

  return (
    <div className="group relative rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300 overflow-hidden flex flex-col h-full p-6 shadow-sm hover:shadow-md">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>
      </div>

      <h2 className="font-bold text-lg mb-1 line-clamp-1">{interview?.jobPosition}</h2>
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
        <span>{interview?.jobExperience} Years Experience</span>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
        <Calendar className="w-4 h-4" />
        <span>Created: {interview?.createdAt?.slice(0, 10)}</span>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2 mt-auto">
        <Button
          size="sm"
          variant="outline"
          className="w-full rounded-lg font-medium"
          onClick={() =>
            router.push(`/dashboard/interview/${interview?.mockId}/feedback`)
          }
        >
          View Feedback
        </Button>

        <Button
          size="sm"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium"
          onClick={() =>
            router.push(`/dashboard/interview/${interview?.mockId}/start`)
          }
        >
          Continue Interview
        </Button>
      </div>
    </div>
  );
};

export default InterviewCardList;
