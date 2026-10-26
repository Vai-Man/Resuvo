"use client";
import { getUserCoverLetters } from "@/actions/dashboard";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import CoverLetterCard from "./CoverLetterCard"; // You will create this similar to QuestionCardList

const CoverLetterList = () => {
  const { user } = useUser();
  const [coverLetters, setCoverLetters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchCoverLetters();
  }, [user]);

  const fetchCoverLetters = async () => {
    setLoading(true);
    try {
      const response = await getUserCoverLetters();

      setCoverLetters(response);
    } catch (error) {
      console.error("Error fetching cover letters:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="font-bold text-xl">Your AI-Generated Cover Letters</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2Icon size={60} className="animate-spin" />
        </div>
      ) : coverLetters.length === 0 ? (
        <p className="text-muted-foreground mt-4">
          You haven’t generated any cover letters yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-4 gap-5">
          {coverLetters.map((item) => (
            <CoverLetterCard key={item.id} letterItem={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CoverLetterList;
