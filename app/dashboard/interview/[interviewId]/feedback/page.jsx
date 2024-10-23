"use client";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function Feedback({ params }) {
  const [feedbackList, setFeedbackList] = useState([]);
  const [overallRating, setOverallRating] = useState(0); // State for overall rating
  const router = useRouter();

  useEffect(() => {
    GetFeedback();
  }, []);

  const GetFeedback = async () => {
    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.interviewId))
      .orderBy(UserAnswer.id);

    console.log(result);
    setFeedbackList(result);
    
    // Calculate overall rating
    if (result.length > 0) {
      const totalRating = result.reduce((sum, item) => sum + (item.rating / 5), 0); // Normalize each rating
      const averageRating = totalRating / result.length; // Calculate average of normalized ratings
      const scaledRating = averageRating * 10; // Scale to 0-10 range
      setOverallRating(scaledRating.toFixed(0)); // Store and format the overall rating
    } else {
      setOverallRating(0); // Reset overall rating if no feedback
    }
  };

  return (
    <div className="p-10">
      {feedbackList.length === 0 ? (
        <h2 className="font-bold text-2xl text-gray-500">
          No interview feedback record found
        </h2>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-green-500">Congratulations!</h2>
          <h2 className="font-bold text-2xl">
            Here is your interview feedback
          </h2>

          <h2 className="text-blue-700 text-lg my-3">
            Your overall interview rating: <strong>{overallRating}</strong>
          </h2>

          <h2 className="text-sm text-gray-500">
            Your Interview Question Insights: Correct Answer, Your Response, and
            Feedback for Further Development
          </h2>

          {feedbackList.map((item, index) => (
            <Collapsible key={index} className="mt-7">
              <CollapsibleTrigger className="p-2 w-full flex justify-between bg-secondary rounded-lg my-2 text-left gap-7">
                {item.Question} <ChevronsUpDown className="h-6 w-6" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-col gap-2">
                  <h2 className="text-red-500 p-2 border rounded-lg">
                    <strong>Rating: </strong>
                    {item.rating}{" "}
                  </h2>
                  <h2 className="p-2 border rounded-lg bg-red-50 text-sm text-red-900">
                    <strong>Your Answer: </strong> {item.userAns}
                  </h2>
                  <h2 className="p-2 border rounded-lg bg-green-50 text-sm text-green-900">
                    <strong>Correct Answer: </strong> {item.correctAns}
                  </h2>
                  <h2 className="p-2 border rounded-lg bg-blue-50 text-sm text-blue-900">
                    <strong>Feedback: </strong> {item.feedback}
                  </h2>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </>
      )}

      <Button onClick={() => router.replace("/dashboard")} className="mt-12">
        Go Home
      </Button>
    </div>
  );
}

export default Feedback;
