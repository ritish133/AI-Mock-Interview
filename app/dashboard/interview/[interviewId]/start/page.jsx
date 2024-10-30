"use client";
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function StartInterview({ params }) {
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  useEffect(() => {
    if (params.interviewId) {
      GetInterviewDetails();
    }
  }, [params.interviewId]);

  const GetInterviewDetails = async () => {
    try {
      // console.log("Fetching interview details for ID:", params.interviewId);
      
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId));
      
      // console.log("Query Result:", result);

      // Check if the result is empty
      if (result.length === 0) {
        console.error("No interview found with the given ID.");
        return;
      }

      let jsonMockResp;
      try {
        jsonMockResp = JSON.parse(result[0].jsonMockResp);
        // console.log("Parsed JSON Response:", jsonMockResp);
      } catch (error) {
        console.error("Failed to parse JSON:", error);
        return; // Exit if parsing fails
      }

      setMockInterviewQuestion(jsonMockResp);
      setInterviewData(result[0]);
      // console.log("Interview Data:", result[0]);
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
        {/* Questions */}
        <QuestionsSection 
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
        />

        {/* Video/Audio Recording */}
        <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData} // Pass interviewData here
        />
      </div>

      <div className='flex justify-end gap-6'>
        {activeQuestionIndex>0&& 
        <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)} className="bg-green-400 hover:bg-green-500  text-black">Previous Question</Button>}

        {activeQuestionIndex!=mockInterviewQuestion?.length-1&& 
        <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)} className="bg-green-400 hover:bg-green-500  text-black">Next Question</Button>}

        {activeQuestionIndex==mockInterviewQuestion?.length-1&& 
        <Link href={'/dashboard/interview/'+interviewData?.mockId+'/feedback'}>
        <Button className="bg-green-400 hover:bg-green-500 text-black">End Interview</Button>
        </Link>}
      </div>

    </div>
  );
}

export default StartInterview;
