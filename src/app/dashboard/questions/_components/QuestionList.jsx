"use client";
import { db } from "@/utils/db";
import { Question } from "@/utils/schema";
import { useUser } from "@clerk/clerk-react";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import QuestionCardList from "./QuestionCardList";
import { Loader2Icon } from "lucide-react";

const QuestionList = () => {
  const { user } = useUser();
  const [questionList, setQuestionList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) getQuestionList();
  }, [user]);

  const getQuestionList = async () => {
    setLoading(true);
    try {
      const response = await db
        .select()
        .from(Question)
        .where(eq(Question.createdBy, user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(Question.id));

      setQuestionList(response);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="font-bold text-xl">Your AI-Generated Questions</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2Icon size={60} className="animate-spin" />
        </div>
      ) : questionList.length === 0 ? (
        <p className="text-muted-foreground mt-4">
          You haven't generated any questions yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-4 gap-5">
          {questionList.map((questionItem) => (
            <QuestionCardList
              key={questionItem.id}
              questionItem={questionItem}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionList;
