"use client";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/clerk-react";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import InterviewCardList from "./InterviewCardList";
import { Loader2Icon } from "lucide-react";

const InterviewList = () => {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) GetInterviewList();
  }, [user]);

  const GetInterviewList = async () => {
    setLoading(true); // start loading
    const response = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(MockInterview.id));

    setInterviewList(response);
    setLoading(false); // data loaded
  };

  return (
    <div>
      <h2 className="font-bold text-xl">Previous Mock Interviews</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2Icon size={60} className="animate-spin" />
        </div>
      ) : interviewList.length === 0 ? (
        <p className="text-muted-foreground mt-4">
          You don't have any mock interviews yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-4 gap-5">
          {interviewList.map((interview, index) => (
            <InterviewCardList key={index} interview={interview} />
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewList;
