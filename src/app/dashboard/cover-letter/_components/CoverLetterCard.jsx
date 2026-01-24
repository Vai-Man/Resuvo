import { Button } from "@/components/ui/button";
import React from "react";
import { useRouter } from "next/navigation";
import { FileText, Building2, Briefcase, Calendar } from "lucide-react";

const CoverLetterCard = ({ letterItem }) => {
  const router = useRouter();

  return (
    <div className="group relative rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300 overflow-hidden flex flex-col h-full p-6 shadow-sm hover:shadow-md">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400">
          <FileText className="w-5 h-5" />
        </div>
      </div>

      <h2 className="font-bold text-lg mb-1 line-clamp-1">{letterItem.jobPosition}</h2>
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
        <Building2 className="w-4 h-4 flex-shrink-0" />
        <span className="truncate">{letterItem.companyName}</span>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
        <Briefcase className="w-4 h-4 flex-shrink-0" />
        <span>{letterItem.experience}</span>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1 mb-4">
        {letterItem.skills?.split(",").slice(0, 2).map((skill, idx) => (
          <span key={idx} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full border border-border">
            {skill.trim()}
          </span>
        ))}
        {letterItem.skills?.split(",").length > 2 && (
          <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full border border-border">
            +{letterItem.skills?.split(",").length - 2}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
        <Calendar className="w-4 h-4" />
        <span>Created: {letterItem.createdAt?.slice(0, 10)}</span>
      </div>

      {/* Button */}
      <Button
        size="sm"
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium mt-auto"
        onClick={() =>
          router.push(`/dashboard/cover-letter/${letterItem.coverLetterId}`)
        }
      >
        View Letter
      </Button>
    </div>
  );
};

export default CoverLetterCard;
