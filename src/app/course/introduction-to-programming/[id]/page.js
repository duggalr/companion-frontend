"use client";
import TopNavBar from '@/app/components/Utils/TopNavBar';
import LectureHomePage from '@/app/components/Course/LectureHomePage';

export default function LectureHomeLayout ({ params }) {

    let lecture_number = params.id;
    console.log('lecture_number:', lecture_number);

    return (

        <main>
            <TopNavBar/>
            <LectureHomePage lecture_number={lecture_number}/>
        </main>

    );

}