// "use client";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import React, { useEffect, useState } from "react";
// import dynamic from "next/dynamic";
// import useSpeechToText from "react-hook-speech-to-text";
// import { Mic } from "lucide-react";
// import { toast } from "sonner";
// import { useUser } from "@clerk/clerk-react";
// import { db } from "@/utils/db";
// import moment from "moment";
// import { UserAnswer } from "@/utils/schema";
// import { fetchAIResponse } from "@/utils/GeminiAIModal";

// // Dynamically import Webcam so it doesn't load on the server
// const Webcam = dynamic(() => import("react-webcam"), { ssr: false });

// function RecordAnswerSection({
//   mockInterviewQuestions,
//   activeQuestionIndex,
//   interviewData,
// }) {
//   const [userAnswer, setUserAnswer] = useState("");
//   const { user } = useUser();
//   const [loading, setLoading] = useState(false);
//   const [webcamError, setWebcamError] = useState("");

//   const {
//     error,
//     interimResult,
//     isRecording,
//     results,
//     startSpeechToText,
//     stopSpeechToText,
//     setResults,
//   } = useSpeechToText({
//     continuous: true,
//     useLegacyResults: false,
//     interimResults: true,
//   });

//   // Append speech-to-text results to userAnswer
//   useEffect(() => {
//     if (results && results.length > 0) {
//       results.forEach((result) => {
//         if (result?.transcript) {
//           setUserAnswer((prev) => prev + " " + result.transcript);
//         }
//       });
//     }
//   }, [results]);

//   // Save answer automatically after recording ends if length > 10
//   useEffect(() => {
//     if (!isRecording && userAnswer.length > 10) {
//       saveUserAnswerToDb();
//     }
//   }, [userAnswer, isRecording]);

//   const saveUserAnswer = async () => {
//     if (isRecording) {
//       stopSpeechToText();
//       toast("Recording stopped");
//     } else {
//       startSpeechToText();
//       toast("Recording started");
//     }
//   };

//   const saveUserAnswerToDb = async () => {
//     if (!interviewData || !interviewData.mockId) {
//       toast.error("Interview data is not available.");
//       return;
//     }

//     setLoading(true);

//     const questionText =
//       mockInterviewQuestions[activeQuestionIndex]?.question || "";
//     const correctAnswer =
//       mockInterviewQuestions[activeQuestionIndex]?.answer || "";

//     // ✅ Fixed variable names in feedbackPrompt
//     const feedbackPrompt = `Question:${mockInterviewQuestions[activeQuestionIndex]?.question} Answer:${userAnswer}, Depends on question and user answer for given interview question please give us rating for answer and feedback in JSON format with rating and feedback fields.Make sure that answer is in JSON format only. And also rating should be a number between 1 and 10`;

//     try {
//       const responseText = await fetchAIResponse(feedbackPrompt);

//       const cleanedResponse = responseText
//         .trim()
//         .replace(/```json/g, "")
//         .replace(/```/g, "")
//         .replace(/[\u0000-\u001F]+/g, "");

//       let jsonResponse;
//       try {
//         jsonResponse = JSON.parse(cleanedResponse);
//       } catch (parseError) {
//         console.error("Error parsing JSON:", parseError);
//         toast.error("Failed to parse feedback. Try again.");
//         setLoading(false);
//         return;
//       }

//       await db.insert(UserAnswer).values({
//         mockIdRef: interviewData.mockId,
//         question: questionText,
//         correctAns: correctAnswer,
//         userAns: userAnswer,
//         feedback: jsonResponse?.feedback || "",
//         rating: jsonResponse?.rating || "",
//         userEmail: user?.primaryEmailAddress?.emailAddress,
//         createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
//       });

//       toast.success("Answer recorded successfully!");
//       setUserAnswer("");
//       setResults([]);
//     } catch (error) {
//       console.error("Error saving answer:", error);
//       toast.error("Error saving answer. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleWebcamError = (error) => {
//     console.error("Webcam error:", error);
//     setWebcamError("Could not access webcam. Please check permissions.");
//     toast.error("Could not access webcam. Please check permissions.");
//   };

//   return (
//     <div className="flex flex-col items-center justify-center">
//       <div className="flex flex-col mt-20 justify-center items-center rounded-lg p-5 bg-card relative border border-border shadow-md">
//         {webcamError ? (
//           <p className="text-destructive">{webcamError}</p>
//         ) : (
//           <>
//             <Image
//               src="/webcam.png"
//               width={200}
//               height={200}
//               className="absolute opacity-30"
//               alt="Webcam Placeholder"
//             />
//             <Webcam
//               mirrored={true}
//               onUserMediaError={handleWebcamError}
//               style={{
//                 width: "100%",
//                 height: 300,
//                 zIndex: 10,
//                 borderRadius: "var(--radius)",
//               }}
//             />
//           </>
//         )}
//       </div>

//       <Button
//         variant="outline"
//         className="my-10 bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
//         disabled={loading}
//         onClick={saveUserAnswer}
//       >
//         {isRecording ? (
//           <h2 className="text-destructive flex gap-2 items-center">
//             <Mic /> Recording...
//           </h2>
//         ) : (
//           <h2 className="text-primary-foreground flex gap-2 items-center">
//             <Mic /> Record Answer
//           </h2>
//         )}
//       </Button>
//     </div>
//   );
// }

// export default RecordAnswerSection;

"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";
import { saveInterviewAnswer } from "@/actions/dashboard";
import { fetchAIResponse } from "@/utils/GeminiAIModal";
import { cn } from "@/lib/utils";

// Dynamically import Webcam so it doesn't load on the server
const Webcam = dynamic(() => import("react-webcam"), { ssr: false });

function RecordAnswerSection({
  mockInterviewQuestions,
  activeQuestionIndex,
  interviewData,
}) {
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false); // ✅ new state to handle "saving" period
  const [webcamError, setWebcamError] = useState("");

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
    interimResults: true,
  });

  // Log hook errors
  useEffect(() => {
    if (error) {
      console.error("🔴 Speech-to-Text Error:", error);
      toast.error(`Recording error: ${error}`);
    }
  }, [error]);

  // Log state changes for debugging
  useEffect(() => {
    console.log("📊 Recording State:", { isRecording, interimResult, resultsCount: results?.length || 0 });
  }, [isRecording, interimResult, results]);

  // Append speech-to-text results to userAnswer (only when recording ends)
  useEffect(() => {
    if (!isRecording && results && results.length > 0) {
      const finalTranscript = results
        .map((result) => result?.transcript || "")
        .join(" ")
        .trim();
      
      if (finalTranscript) {
        setUserAnswer((prev) => {
          const newAnswer = prev ? prev + " " + finalTranscript : finalTranscript;
          return newAnswer.trim();
        });
      }
      // Clear results after processing to avoid duplicates
      setResults([]);
    }
  }, [isRecording]); // Only depend on isRecording, not results

  // ✅ Save answer automatically after recording stops, and wait until saved
  useEffect(() => {
    const handleSave = async () => {
      if (!isRecording && userAnswer.length > 10) {
        setSaving(true);
        await saveUserAnswerToDb();
        setSaving(false);
      }
    };
    handleSave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAnswer, isRecording]);

  const saveUserAnswer = async () => {
    console.log("🔵 Button clicked - Current state:", {
      isRecording,
      saving,
      loading,
      startSpeechToText: typeof startSpeechToText,
      stopSpeechToText: typeof stopSpeechToText,
    });

    if (saving) {
      console.log("⏳ Already saving, ignoring click");
      toast("Please wait, saving your previous answer...");
      return;
    }

    if (isRecording) {
      console.log("🛑 Stopping recording...");
      stopSpeechToText();
      console.log("🛑 Recording stopped");
      toast("Recording stopped");
    } else {
      console.log("🎤 Starting recording...");
      console.log("startSpeechToText function exists:", !!startSpeechToText);
      startSpeechToText();
      console.log("🎤 Recording started");
      toast("Recording started - speak now!");
    }
  };

  const saveUserAnswerToDb = async () => {
    if (!interviewData || !interviewData.mockId) {
      toast.error("Interview data is not available.");
      return;
    }

    setLoading(true);

    const questionText =
      mockInterviewQuestions[activeQuestionIndex]?.question || "";
    const correctAnswer =
      mockInterviewQuestions[activeQuestionIndex]?.answer || "";

    const feedbackPrompt = `Question:${questionText} Answer:${userAnswer}. Based on the question and user answer, please give a rating (1–10) and feedback in JSON format with fields "rating" and "feedback" only. Also remember that this answer is using a speech to text model so make sure to factor that in while giving rating and feedback. Make sure that answer is in JSON format only.`;

    try {
      const responseText = await fetchAIResponse(feedbackPrompt);

      const cleanedResponse = responseText
        .trim()
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .replace(/[\u0000-\u001F]+/g, "");

      let jsonResponse;
      try {
        jsonResponse = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        toast.error("Failed to parse feedback. Try again.");
        setLoading(false);
        return;
      }

      await saveInterviewAnswer({
        mockIdRef: interviewData.mockId,
        question: questionText,
        correctAns: correctAnswer,
        userAns: userAnswer,
        feedback: jsonResponse?.feedback || "",
        rating: jsonResponse?.rating || "",
      });

      toast.success("Answer saved successfully!");
      setUserAnswer("");
      setResults([]);
    } catch (error) {
      console.error("Error saving answer:", error);
      toast.error("Error saving answer. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleWebcamError = (error) => {
    console.error("Webcam error:", error);
    setWebcamError("Could not access webcam. Please check permissions.");
    toast.error("Could not access webcam. Please check permissions.");
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* Recording Indicator */}
      {isRecording && (
        <div className="animate-pulse">
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-red-600">RECORDING IN PROGRESS</span>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Webcam Card */}
      <div className="w-full rounded-2xl overflow-hidden border border-primary/20 shadow-lg bg-card">
        <div className="relative bg-black">
          {webcamError ? (
            <div className="w-full h-80 flex items-center justify-center bg-muted/50">
              <div className="text-center">
                <p className="text-destructive font-medium mb-2">Camera Access Denied</p>
                <p className="text-sm text-muted-foreground">{webcamError}</p>
              </div>
            </div>
          ) : (
            <div className="relative">
              <Image
                src="/webcam.png"
                width={200}
                height={200}
                className="absolute opacity-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                alt="Webcam Placeholder"
              />
              <Webcam
                mirrored={true}
                onUserMediaError={handleWebcamError}
                style={{
                  width: "100%",
                  height: 320,
                  zIndex: 10,
                }}
              />
              {isRecording && (
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-xs font-semibold">REC</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Record Button */}
      <Button
        className={cn(
          "w-full h-14 text-lg font-semibold rounded-xl transition-all duration-300",
          isRecording
            ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-600/50"
            : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
        )}
        disabled={loading || saving}
        onClick={saveUserAnswer}
      >
        {saving ? (
          <span className="flex items-center gap-2">
            <LoaderCircle className="w-5 h-5 animate-spin" />
            Saving Answer...
          </span>
        ) : isRecording ? (
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            Stop Recording
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Record Answer
          </span>
        )}
      </Button>

      {/* Answer Preview with Real-time Transcription */}
      <div className="w-full bg-muted/50 border border-border/50 rounded-lg p-4 min-h-24">
        <p className="text-xs font-semibold text-muted-foreground mb-2">Your Answer:</p>
        <div className="text-sm text-foreground">
          {userAnswer && <p>{userAnswer}</p>}
          {isRecording && interimResult && (
            <p className="italic text-muted-foreground">{interimResult}</p>
          )}
          {!userAnswer && !isRecording && (
            <p className="text-muted-foreground">Click "Record Answer" to start speaking...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecordAnswerSection;
