"use client"
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModal";
import { Loader, LoaderCircle } from "lucide-react";
import { db } from "@/utils/db"
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from 'uuid';
import moment from "moment";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

function AddNewInterview() {
    const [openDialog,setOpenDialog]=useState(false);
    const [jobPosition,setjobPosition]=useState();
    const [jobDesc,setjobDesc]=useState();
    const [jobExperience,setjobExperience]=useState();
    const [loading,setLoading]=useState(false);
    const [JsonResponse, setJsonResponse]=useState([]);
    const router=useRouter();
    const{user}=useUser();

    const onSubmit = async (e) => {
      setLoading(true);
      e.preventDefault();
      // console.log(jobPosition, jobDesc, jobExperience);
    
      const InputPrompt = `Job position: ${jobPosition}, Job Description: ${jobDesc}. Years of Experience: ${jobExperience}, Depends on Job Position, Job Description & Years of Experience give us ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview question along with Answer in JSON format, Give us question and answer field on JSON`;
    
      const result = await chatSession.sendMessage(InputPrompt);
      let MockJsonResp = (result.response.text()).replace('```json', '').replace('```', '').trim();
  
      // Sanitize the response
      MockJsonResp = MockJsonResp.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
      
      // console.log("Raw JSON Response:", MockJsonResp); // Log the raw response
  
      let parsedJson;
      try {
          parsedJson = JSON.parse(MockJsonResp);
          // console.log("Parsed JSON:", parsedJson);
      } catch (error) {
          console.error("Failed to parse JSON:", error);
          console.error("Response was:", MockJsonResp); // Log the response for further inspection
          setLoading(false);
          return; // Exit the function if parsing fails
      }
    
      if (parsedJson) {
        const resp = await db.insert(MockInterview)
          .values({
            mockId: uuidv4(),
            jsonMockResp: JSON.stringify(parsedJson), // Convert to string if needed
            jobPosition: jobPosition,
            jobDesc: jobDesc,
            jobExperience: jobExperience,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format('DD-MM-yyyy')
          })
          .returning({ mockId: MockInterview.mockId });
    
        // console.log("Inserted ID:", resp);
        if(resp){
          setOpenDialog(false);
          router.push('/dashboard/interview/'+resp[0]?.mockId);
        }
      } else {
        // console.log("ERROR: No valid JSON response");
      }
      setLoading(false);
    }
    

  return (
    <div>
      <div className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all" onClick={()=>setOpenDialog(true)}>
        <h2 className="text-lg text-center">+ Add New</h2>
      </div>

      <Dialog open={openDialog}>
        <DialogTrigger></DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Tell us more about the job you are interviewing</DialogTitle>
            <DialogDescription>
            <form onSubmit={onSubmit}>
              <div>
                <h2>Add Details about your job position/role, Job description and years of experience</h2>

                <div className="mt-7 my-3">
                    <label htmlFor="">Job Role/Job Position</label>
                    <Input placeholder="Ex. Full Stack Developer" required onChange={(event)=>setjobPosition(event.target.value)}/>
                </div>
                <div className="my-3">
                    <label htmlFor="">Job Description/Tech Stack (In Short)</label>
                    <Textarea placeholder="Ex. React, Angular, NodeJS, MySQL etc." required onChange={(event)=>setjobDesc(event.target.value)}/>
                </div>
                <div className="my-3">
                    <label htmlFor="">Years of Experience</label>
                    <Textarea placeholder="Ex. 5" type="number" max="100" required onChange={(event)=>setjobExperience(event.target.value)}/>
                </div>
              </div>
              <div className="flex gap-5 justify-end">
                <Button type="button" variant="ghost" onClick={()=>setOpenDialog(false)}>Cancel</Button>
                <Button type="submit" disabled={loading} >
                  {loading? 
                  <>
                  <LoaderCircle className="animate-spin"/>Generating from AI</>:'Start Interview'} 
                  </Button>
              </div>
            </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;