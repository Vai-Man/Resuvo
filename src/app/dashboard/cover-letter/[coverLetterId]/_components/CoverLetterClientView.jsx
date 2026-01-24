"use client";

import React, { useState } from "react";
import { db } from "@/utils/db"; // your db import
import { CoverLetterDesc } from "@/utils/schema";
import { toast } from "sonner";
import moment from "moment";
import { eq } from "drizzle-orm";

const EditableCoverLetter = ({ data }) => {
  const [coverLetter, setCoverLetter] = useState(data.coverLetter);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await db
        .update(CoverLetterDesc)
        .set({
          coverLetter,
          updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        })
        .where(eq(CoverLetterDesc.coverLetterId, data.coverLetterId));

      toast.success("Cover letter saved!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to save cover letter.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter);
      toast.success("Cover letter copied to clipboard!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy cover letter.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 bg-card text-card-foreground rounded-xl shadow-md">
      {/* Job Position @ Company */}
      <h1 className="text-3xl font-semibold mb-4">
        {data.jobPosition} @ {data.companyName}
      </h1>

      {/* Edit / Save / Copy Buttons */}
      <div className="flex justify-end gap-2 mb-2">
        {!isEditing ? (
          <button
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        ) : (
          <button
            className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-medium hover:opacity-90 transition"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        )}
        <button
          className="px-4 py-2 rounded-md bg-accent text-accent-foreground font-medium hover:opacity-90 transition"
          onClick={handleCopy}
        >
          Copy
        </button>
      </div>

      {/* Cover Letter */}
      {isEditing ? (
        <textarea
          className="w-full h-96 min-h-[300px] p-4 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring focus:ring-ring resize-none"
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
        />
      ) : (
        <p className="whitespace-pre-wrap leading-relaxed text-foreground">
          {coverLetter}
        </p>
      )}
    </div>
  );
};

export default EditableCoverLetter;
