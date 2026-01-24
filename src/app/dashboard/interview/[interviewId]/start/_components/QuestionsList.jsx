"use client";
import { Lightbulb, Volume2 } from "lucide-react";
import React from "react";

function QuestionsList({ mockInterviewQuestions, activeQuestionIndex }) {
  const textToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);

      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(
        (voice) => voice.name.includes("Female") || voice.gender === "female"
      );

      if (femaleVoice) {
        speech.voice = femaleVoice;
      }

      window.speechSynthesis.speak(speech);
    } else {
      alert("Your browser does not support text to speech");
    }
  };

  if (!mockInterviewQuestions || mockInterviewQuestions.length === 0) return null;

  return (
    <div className="p-5 border border-border rounded-[var(--radius)] my-10 bg-card text-card-foreground shadow-md">
      {/* Question Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {mockInterviewQuestions.map((question, index) => (
          <button
            key={index}
            className={`p-2 rounded-full text-xs md:text-sm text-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring
              ${
                activeQuestionIndex === index
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:hover:bg-secondary/60"
              }`}
          >
            Question #{index + 1}
          </button>
        ))}
      </div>

      {/* Active Question */}
      <h2 className="my-5 text-md md:text-lg">{mockInterviewQuestions[activeQuestionIndex]?.question}</h2>
      <Volume2
        onClick={() => textToSpeech(mockInterviewQuestions[activeQuestionIndex]?.question)}
        className="cursor-pointer text-foreground hover:text-primary transition-colors duration-200"
      />

      {/* Note Section */}
      <div className="border border-border rounded-[var(--radius)] p-5 bg-blue-100 dark:bg-blue-900 mt-10">
        <h2 className="flex gap-2 items-center text-blue-800 dark:text-blue-400 font-semibold">
          <Lightbulb />
          <span>Note:</span>
        </h2>
        <p className="text-sm text-primary my-2">{process.env.NEXT_PUBLIC_INFO2}</p>
      </div>
    </div>
  );
}

export default QuestionsList;
