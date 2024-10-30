"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { chatSession } from "@/utils/GeminiAIModal";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { Mic } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import useSpeechToText from "react-hook-speech-to-text";
import Webcam from "react-webcam";
import { toast } from "sonner";

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
  const [userAnswer, setUserAnswer] = useState("");
  const {user}=useUser();
  const [loading, setLoading]=useState(false);
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    results.map((result) =>
      setUserAnswer((prevAns) => prevAns + result?.transcript)
    );
  }, [results]);
  
  useEffect(()=>{
    if(!isRecording&&userAnswer.length>10){
      UpdateUserAnswer();
    }
  },[userAnswer])

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();

      console.log(userAnswer);

    } else {
      startSpeechToText();
    }
  }

  const UpdateUserAnswer=async()=>{
    console.log(userAnswer);

    setLoading(true);

    const feedbackPrompt =
        "Question:" +
        mockInterviewQuestion[activeQuestionIndex]?.question +
        ", User Answer:" +
        userAnswer +
        ", Depends on question and user answer for given interview question " +
        "Please give us rating for answer and feedback as area of improvement if any " +
        "in just 3 to 5 lines to improve it in JSON format with rating field and feedback field";

      const result = await chatSession.sendMessage(feedbackPrompt);

      let mockJsonResp = result.response
        .text()
        .replace("```json", "")
        .replace("```", "")
        .trim();

      console.log(mockJsonResp);

      mockJsonResp = mockJsonResp.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]");

      console.log("Raw JSON Response:", mockJsonResp); // Log the raw response

      let JsonFeedbackResp;
      try {
        JsonFeedbackResp = JSON.parse(mockJsonResp);
        console.log("Parsed JSON:", JsonFeedbackResp);
      } catch (error) {
        console.error("Failed to parse JSON:", error);
        console.error("Response was:", mockJsonResp); // Log the response for further inspection
      }


      if (JsonFeedbackResp) {
        const resp = await db.insert(UserAnswer)
          .values({
            mockIdRef: interviewData?.mockId,
            Question:mockInterviewQuestion[activeQuestionIndex]?.question,
            correctAns:mockInterviewQuestion[activeQuestionIndex]?.answer,
            userAns:userAnswer,
            feedback:JsonFeedbackResp?.feedback,
            rating:JsonFeedbackResp?.rating,
            userEmail: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format('DD-MM-yyyy')
          })

          if(resp){
            toast('User answer recorded successfully');
            setUserAnswer('');
            setResults([]);
          }
          setResults([]);
          setLoading(false);
      }
  }

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5">
        <Image
          src={"/webcam.png"}
          width={400}
          height={200}
          className="absolute"
        />
        <Webcam
          mirrored={true}
          style={{ height: "100%", width: "100%", zIndex: 10 }}
        />
      </div>

      <Button
      disabled={loading}
        className="my-10 bg-green-400 text-black hover:bg-green-500"
        onClick={StartStopRecording}
      >
        {isRecording ? (
          <h2 className="text-red-600 flex gap-2 items-center">
            <Mic />
            Stop Recording
          </h2>
        ) : (
          <h2 className="text-black flex gap-2 items-center">
            <Mic />
            Record Answer
          </h2>
        )}
      </Button>
    </div>
  );
}

export default RecordAnswerSection;
