"use client";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React from "react";
import { db } from "@/utils/db";
import Webcam from "react-webcam";
import { Lightbulb, Loader2, WebcamIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function InterviewWrapper({ params }) {
  // Unwrap params promise safely
  const { interviewId } = React.use(params);
  return <Interview interviewId={interviewId} />;
}

function Interview({ interviewId }) {
  const [interviewData, setInterviewData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchInterviewDetails();
  }, [interviewId]);

  const fetchInterviewDetails = async () => {
    try {
        setLoading(true);
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, interviewId));
      setInterviewData(result[0]);
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
    finally{
        setLoading(false);
    }
  };

   if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin size-24 mx-auto" />
      </div>
    );
  }

  return (
    <div className="my-8">
      <h2 className="font-bold text-3xl text-foreground">Let's Get Started</h2>
      <div className="flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 my-10">
          {/* Left Panel: Job Details + Info */}
          {interviewData && (
            <div className="flex flex-col gap-5">
              {/* Job Details */}
              <div className="p-5 border border-border rounded-[var(--radius)] bg-card text-card-foreground shadow-md">
                <h2 className="text-lg font-semibold">
                  Job Post:{" "}
                  <span className="font-normal">
                    {interviewData.jobPosition}
                  </span>
                </h2>
                <h2 className="text-lg font-semibold mt-2">
                  Job Description / TechStack:{" "}
                  <span className="font-normal">{interviewData.jobDesc}</span>
                </h2>
                <h2 className="text-lg font-semibold mt-2">
                  Years of Experience:{" "}
                  <span className="font-normal">
                    {interviewData.jobExperience}
                  </span>
                </h2>
              </div>

              {/* Information Box */}
              <div className="p-5 border border-yellow-300 rounded-[var(--radius)] bg-yellow-100 dark:bg-yellow-900 dark:border-yellow-600">
                <h2 className="flex items-center text-yellow-600 dark:text-yellow-400 font-semibold">
                  <Lightbulb className="mr-2" />
                  Information
                </h2>
                <p className="mt-3 text-sm text-foreground dark:text-card-foreground">
                  Enable your webcam and microphone to start the interview. You
                  will answer 5 questions, and at the end, you will receive a
                  report with your responses. NOTE: We never record your video.
                </p>
              </div>
            </div>
          )}

          {/* Right Panel: Webcam */}
          <WebCamSettings />
        </div>
      </div>

      {/* Start Interview Button */}
      <div className="flex justify-end">
        <Link href={`/dashboard/interview/${interviewId}/start`}>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Start Interview
          </Button>
        </Link>
      </div>
    </div>
  );
}

function WebCamSettings() {
  const [webcamEnabled, setWebcamEnabled] = React.useState(false);
  const [webcamError, setWebcamError] = React.useState(null);
  const webcamRef = React.useRef(null);

  const videoConstraints = {
    width: 600,
    height: 600,
    facingMode: "user",
  };

  const handleWebcamError = (error) => {
    console.error("Webcam error:", error);
    setWebcamError("Unable to access camera. Please check permissions and try again.");
    setWebcamEnabled(false);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      {webcamEnabled ? (
        <div className="relative">
          {webcamError ? (
            <div className="h-72 w-72 flex flex-col justify-center items-center bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-[var(--radius)]">
              <div className="text-center px-4">
                <p className="text-red-700 dark:text-red-300 text-sm font-medium mb-4">{webcamError}</p>
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => {
                    setWebcamError(null);
                    setWebcamEnabled(false);
                  }}
                >
                  Go Back
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Webcam
                ref={webcamRef}
                audio={true}
                videoConstraints={videoConstraints}
                mirrored={true}
                className="h-72 w-72 rounded-[var(--radius)]"
                onUserMediaError={handleWebcamError}
              />
              <Button
                className="mt-5 bg-red-600 text-white hover:bg-red-700 w-full"
                onClick={() => {
                  setWebcamEnabled(false);
                  setWebcamError(null);
                }}
              >
                Disable Webcam
              </Button>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="h-72 w-72 flex justify-center items-center bg-gray-200 dark:bg-gray-800 rounded-[var(--radius)] border border-border">
            <WebcamIcon className="h-16 w-16 text-gray-600 dark:text-gray-300" />
          </div>
          <Button
            className="mt-5 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setWebcamEnabled(true)}
          >
            Enable Webcam and Microphone
          </Button>
          {webcamError && (
            <p className="mt-3 text-sm text-red-600 dark:text-red-400">{webcamError}</p>
          )}
        </>
      )}
    </div>
  );
}
export default InterviewWrapper;
