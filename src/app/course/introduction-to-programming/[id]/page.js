"use client";
import React, { useEffect, useState } from 'react';
import TopNavBar from '@/app/components/Utils/TopNavBar';
import LectureHomePage from '@/app/components/Course/LectureHomePage';
import useUserContext from "@/lib/hooks/useUserContext";
import LoadingScreen from '@/app/components/ui/Loading';
import { fetchLectureData } from '@/lib/backend_api/fetchLectureData';
import { isNullOrUndefined } from 'util';


export default function LectureHomeLayout ({ params }) {

    const { isAuthenticated, userAccessToken } = useUserContext();

    let lecture_number = params.id;
    console.log('lecture_number:', lecture_number);

    const [isLoading, setIsLoading] = useState(true);
    let [lectureData, setLectureData] = useState(null);
    let [lectureExerciseData, setLectureExerciseData] = useState(null);
    let [problemSetData, setProblemSetData] = useState(null);

    // handle-lecture-data-fetch
    const _handleLectureDataFetch = async () => {

        let lecture_data_res = await fetchLectureData(lecture_number);
        console.log('lecture_data:', lecture_data_res);

        // TODO: set and display
        if (lecture_data_res['success'] === true){

            let lect_data = lecture_data_res['lecture_data'];
            let lect_exercise_data = lecture_data_res['exercise_data'];
            let problem_set_data = lecture_data_res['problem_set_data'];
            console.log('lect_data', lect_data);
            console.log('lect_exercise_data', lect_exercise_data);
            console.log('problem_set_data', problem_set_data);

            setLectureData(lect_data);
            setLectureExerciseData(lect_exercise_data);
            setProblemSetData(problem_set_data);
            setIsLoading(false);

        }

    }

    // initial-load
    useEffect(() => {
    
        // if (userAccessToken) {
        //     _handleLectureDataFetch();
        // } else {            
        // }

        _handleLectureDataFetch();

    }, [userAccessToken, isAuthenticated]);


    if (isLoading){
        return <h1>Loading...</h1>;
    }

    return (

        <main>
            <TopNavBar/>
            <LectureHomePage 
                // accessToken={userAccessToken}
                // userAuthenticated={isAuthenticated}
                lecture_number={lecture_number}
                lectureData={lectureData}
                lectureExerciseData={lectureExerciseData}
                problemSetData={problemSetData}
            />
        </main>

    );

}