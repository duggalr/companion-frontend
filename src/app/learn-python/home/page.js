"use client";
import React, { useEffect } from 'react';
// import StartLayout from "@/app/components/Experimental/StartLayout";
import CourseHomeLayout from "@/app/components/Experimental/CourseHomeLayout";

export default function Home() {

    // Update page title
    useEffect(() => {

        document.title = "Learn Python with an AI"; 
        
    }, []);

    return (

        <main className="h-screen">
            {/* <ExperimentalLayout/> */}
            {/* <StartLayout /> */}
            <CourseHomeLayout />
        </main>

    );
}