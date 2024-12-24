import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faCheck } from "@fortawesome/free-solid-svg-icons";


const testCases = [
    {
        id: 1,
        input: "Lorem ipsum input data for test case 1...",
        expectedOutput: "Lorem ipsum expected output for test case 1...",
        userOutput: "Lorem ipsum user program output for test case 1...",
    },
    {
        id: 2,
        input: "Lorem ipsum input data for test case 2...",
        expectedOutput: "Lorem ipsum expected output for test case 2...",
        userOutput: "Lorem ipsum user program output for test case 2...",
    },
    {
        id: 3,
        input: "Lorem ipsum input data for test case 3...",
        expectedOutput: "Lorem ipsum expected output for test case 3...",
        userOutput: "Lorem ipsum user program output for test case 3...",
    },
    {
        id: 4,
        input: "Lorem ipsum input data for test case 4...",
        expectedOutput: "Lorem ipsum expected output for test case 4...",
        userOutput: "Lorem ipsum user program output for test case 4...",
    },
    {
        id: 5,
        input: "Lorem ipsum input data for test case 5...",
        expectedOutput: "Lorem ipsum expected output for test case 5...",
        userOutput: "Lorem ipsum user program output for test case 5...",
    },
];

const mockSubmissions = [
    {
      submissionNumber: 1,
      date: "2024-12-21 14:30",
      status: "Pass",
    },
    {
      submissionNumber: 2,
      date: "2024-12-22 10:15",
      status: "Fail",
    },
    {
      submissionNumber: 3,
      date: "2024-12-23 08:45",
      status: "Pass",
    },
  ];

const SubmissionLayout = ({}) => {

    // TODO:
        // if course question --> show the submission page + handle logic
        // else --> show the coming soon page

    const [currentTestCase, setCurrentTestCase] = useState(0);

    const handlePrevious = () => {
        if (currentTestCase > 0) {
            setCurrentTestCase((prev) => prev - 1);
        }
    };
    
    const handleNext = () => {
        if (currentTestCase < testCases.length - 1) {
            setCurrentTestCase((prev) => prev + 1);
        }
    };

    return (

        // <div className="p-4 bg-gray-900 min-h-screen text-white">
        <div className="p-4 min-h-screen mb-8">
            
            <div className="flex justify-between items-center mb-6">
                {/* <h1 className="font-semibold text-xl">
                    Submissions
                </h1> */}
                <h1 className="font-semibold text-[17px] mr-2">
                    Submissions
                </h1>
                <Button
                    className="w-[130px] py-4 mr-2 mt-1 text-[14px] text-white font-medium rounded-xl transition-all bg-green-400 hover:bg-green-500"
                >
                    Submit Solution
                </Button>

                {/* <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded shadow">
                    Submit
                </button> */}
            </div>

            <div className="mb-6">
                <h2 className="text-base font-semibold">
                    AI Tutor Feedback
                </h2>
                 <p className="px-0 pt-4 tracking-6 text-[14px] text-gray-800 dark:text-gray-300">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
                    interdum, metus non consectetur gravida, ex libero cursus nisl, vel
                    pharetra mi velit sed urna.
                </p>
            </div>


            <h2 className="text-base font-semibold pt-0">
                Test Cases
            </h2>

            <p className="px-0 pt-4 tracking-6 text-[14px] text-gray-800 dark:text-gray-300">
                All Test Cases Passed. <FontAwesomeIcon icon={faCheck} className="pr-1 text-green-600 text-[15px] ml-1"/> 
            </p>

            <div className="bg-gray-800 p-5 pb-10 rounded-lg shadow mb-6 mt-4">

                <div className="flex justify-between items-center mb-4">

                    <button
                        className={`text-gray-400 hover:text-gray-200 text-sm ${
                        currentTestCase === 0 ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={handlePrevious}
                        disabled={currentTestCase === 0}
                    >
                        ← Previous
                    </button>

                    <span className="text-[15px] text-gray-400 tracking-wide pr-4">
                        Test Case {currentTestCase + 1}/{testCases.length}
                    </span>

                    <button
                        className={`text-gray-400 hover:text-gray-200 text-sm ${
                        currentTestCase === testCases.length - 1
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={handleNext}
                        disabled={currentTestCase === testCases.length - 1}
                    >
                        Next →
                    </button>

                </div>

                <div className="space-y-6 mt-5">

                    <div>
                        <h3 className="font-semibold text-sm text-gray-300 mb-1">Input</h3>
                        <pre className="bg-gray-700 text-sm p-3 rounded-lg text-gray-200">
                        {testCases[currentTestCase].input}
                        </pre>
                    </div>

                    <div>
                        <h3 className="font-semibold text-sm text-gray-300 mb-1">
                        Expected Output
                        </h3>
                        <pre className="bg-gray-700 text-sm p-3 rounded-lg text-gray-200">
                        {testCases[currentTestCase].expectedOutput}
                        </pre>
                    </div>

                    <div>
                        <h3 className="font-semibold text-sm text-gray-300 mb-1">
                        User Program Output
                        </h3>
                        <pre className="bg-gray-700 text-sm p-3 rounded-lg text-gray-200">
                        {testCases[currentTestCase].userOutput}
                        </pre>
                    </div>

                </div>

            </div>


            <h2 className="text-base font-semibold pt-0 pb-4">
                Submission History
            </h2>

            {/* Submission History Table */}
            {/* <div className="bg-gray-800 p-4 rounded-lg shadow">
                <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-700 text-gray-300">
                    <th className="p-3">#</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {mockSubmissions.map((submission, index) => (
                    <tr
                        key={index}
                        className={`${
                        index % 2 === 0 ? "bg-gray-800" : "bg-gray-600"
                        }`}
                    >
                        <td className="p-3">{submission.submissionNumber}</td>
                        <td className="p-3">{submission.date}</td>
                        <td
                        className={`p-3 ${
                            submission.status === "Pass"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                        >
                        {submission.status}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div> */}

            {/* Submission History Table */}
            <div class="relative overflow-x-auto ">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                #
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Date
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>

                        {/* TODO:
                            - with full concentration:
                                - get full submission functionality completed / tested / finalized
                                - from there --> plan out next steps
                                    - testing to ensure all current lecture exercises work
                                    - finalizing entire UI (generate similar questions, etc.)
                                    - getting all lecture exercises in UI and test <-- push this to production and email all the registered people
                        */}

                        {mockSubmissions.map((submission, index) => (
                            <tr
                                key={index}
                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                            >
                                <td className="p-3">{submission.submissionNumber}</td>
                                <td className="p-3">{submission.date}</td>
                                <td
                                className={`p-3 ${
                                    submission.status === "Pass"
                                    ? "text-green-400"
                                    : "text-red-400"
                                }`}
                                >
                                {submission.status}
                                </td>
                            </tr>
                        ))}

                        {/* <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Apple MacBook Pro 17"
                            </th>
                            <td class="px-6 py-4">
                                Silver
                            </td>
                            <td class="px-6 py-4">
                                Laptop
                            </td>
                        </tr>
                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Microsoft Surface Pro
                            </th>
                            <td class="px-6 py-4">
                                White
                            </td>
                            <td class="px-6 py-4">
                                Laptop PC
                            </td>
                        </tr>
                        <tr class="bg-white dark:bg-gray-800">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Magic Mouse 2
                            </th>
                            <td class="px-6 py-4">
                                Black
                            </td>
                            <td class="px-6 py-4">
                                Accessories
                            </td>
                        </tr>
                         */}
                    </tbody>
                </table>
            </div>


        </div>

        // <div className="p-2 pl-4 pt-4">

            // <h1 className="font-semibold text-[17px] mr-2">
            //     Submissions
            // </h1>

            // <p className="pt-4 leading-7 text-[14px] text-gray-600 dark:text-gray-300">
            //     Submissions with dynamically generated tests are coming soon to the playground...
            // </p>

            // <p className="pt-2 leading-7 text-[14px] text-gray-600 dark:text-gray-300">
            //     Currently, this feature is implemented in the <a href="#" className="cursor-pointer text-blue-500 hover:text-blue-400">course (todo)</a>.
            // </p> 

        // </div>
        
    )

}

export default SubmissionLayout;