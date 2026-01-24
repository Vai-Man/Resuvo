import { Suspense } from "react";
import { Loader2Icon } from "lucide-react";
import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
import { CoverLetterDesc } from "@/utils/schema";
import CoverLetterClientView from "./_components/CoverLetterClientView";

export default async function CoverLetterViewPage({ params }) {
  const { coverLetterId } = await params;

  return (
    <Suspense
      fallback={
        <div className="h-screen-header flex items-center justify-center">
          <Loader2Icon className="animate-spin size-24" />
        </div>
      }
    >
      <SuspendedComponent coverLetterId={coverLetterId} />
    </Suspense>
  );
}

async function SuspendedComponent({ coverLetterId }) {
  const data = await db
    .select()
    .from(CoverLetterDesc)
    .where(eq(CoverLetterDesc.coverLetterId, coverLetterId));

  return (
    <CoverLetterClientView
      coverLetterId={coverLetterId}
      data={data?.[0]}
    />
  );
}
