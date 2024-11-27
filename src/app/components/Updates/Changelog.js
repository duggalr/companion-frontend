import SparklesText from "@/components/ui/sparkles-text";

// const updates = [
//     {
//         date: "November 26, 2024",
//         changes: [
//           "Dark mode toggle for accessibility.",
//           "Improved profile management page.",
//         ],
//       },
//       {
//         date: "November 20, 2024",
//         changes: [
//           "Fixed login issue with Google accounts.",
//           "Enhanced user dashboard performance.",
//         ],
//       },
//       {
//         date: "November 15, 2024",
//         changes: [
//           "Revamped homepage UI.",
//           "Introduced notifications for user activity.",
//         ],
//       },
// ];

const updates = [
    {
      date: "2024-11-26",
      version: "1.0.2",
      title: "Added Javascript to the IDE",
      description:
        "Added everyone's favorite language to our online REPL environment, Javascript... 😅",
      type: "feature",
    },
    {
      date: "2024-11-22",
      version: "1.0.1",
      title: "Added User Authentication",
      description:
        "Implemented Auth0 based user authentication. This now enables individuals to create multiple different code files, along with saving them and tracking progress.",
      type: "feature",
    },
    {
      date: "2024-10-30",
      version: "1.0.0",
      title: "MVP Launched 🎉",
      description:
        "Launched the first version of Companion publicly.",
      type: "launch",
    },
];

const Changelog = () => {
    return (

        <div className="max-w-4xl mx-auto p-6 mt-4">

            <SparklesText text="Changelog" className="text-[30px] font-normal tracking-normal text-center" />

            <ol class="relative border-s border-gray-200 dark:border-gray-700 mt-10">
                
                {updates.map((update, index) => (

                    <li
                        key={index}
                        class="mb-10 ms-4 px-4 py-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                    >
                        <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                        {/* <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                            {update.date}
                        </time> */}

                        <div className="flex justify-between items-center">
                            <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                                {update.date}
                            </time>
                            {/* <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                Version {update.version}
                            </span> */}
                             <span className="px-2 py-1 text-xs font-medium text-white bg-blue-400 rounded-full shadow-md">
                                Version {update.version}
                            </span>
                        </div>
                        <h3 class="text-[19px] font-semibold text-gray-900 dark:text-white pt-1">
                            {update.title}
                        </h3>
                        <p class="px-0 mb-4 text-[15px] tracking-normal font-normal text-gray-500 dark:text-gray-400 pt-1">
                            {update.description}
                        </p>
                    </li>

                ))}

                {/* <li class="mb-10 ms-4 dark:bg-gray-800 bg-white px-4 py-4 rounded-lg"> */}
                {/* <li class="mb-10 ms-4 px-4 py-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                    <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">February 2022</time>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white pt-1">Application UI code in Tailwind CSS</h3>
                    <p class="px-0 mb-4 text-[14.5px] tracking-normal font-normal text-gray-500 dark:text-gray-400 pt-1">Get access to over 20+ pages including a dashboard layout, charts, kanban board, calendar, and pre-order E-commerce & Marketing pages.</p>
                </li>

                <li class="mb-10 ms-4 bg-gray-50 dark:bg-gray-900 px-4 py-4 rounded-lg">
                    <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                    <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">February 2022</time>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Application UI code in Tailwind CSS</h3>
                    <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">Get access to over 20+ pages including a dashboard layout, charts, kanban board, calendar, and pre-order E-commerce & Marketing pages.</p>
                </li>

                <li class="mb-10 ms-4 bg-gray-900 px-4 py-4 rounded-lg">
                    <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                    <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">February 2022</time>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Application UI code in Tailwind CSS</h3>
                    <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">Get access to over 20+ pages including a dashboard layout, charts, kanban board, calendar, and pre-order E-commerce & Marketing pages.</p>
                </li> */}


                {/* <li class="mb-10 ms-4">
                    <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                    <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">March 2022</time>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Marketing UI design in Figma</h3>
                    <p class="text-base font-normal text-gray-500 dark:text-gray-400">All of the pages and components are first designed in Figma and we keep a parity between the two versions even as we update the project.</p>
                </li>
                <li class="ms-4">
                    <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                    <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">April 2022</time>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">E-Commerce UI code in Tailwind CSS</h3>
                    <p class="text-base font-normal text-gray-500 dark:text-gray-400">Get started with dozens of web components and interactive elements built on top of Tailwind CSS.</p>
                </li> */}
            </ol>

        </div>


        // <div className="max-w-4xl mx-auto p-6">
        //     <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        //         Changelog
        //     </h2>
        //     <div className="space-y-6">
        //         {updates.map((update, index) => (

        //             <div
        //                 key={index}
        //                 className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
        //             >
        //                 <h3>
        //                     {update.title}
        //                 </h3>

        //             </div>


        //             // <div
        //             //     key={index}
        //             //     className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 border-l-4"
        //             //     style={{
        //             //     borderColor:
        //             //         update.type === "feature"
        //             //         ? "#34d399"
        //             //         : update.type === "bugfix"
        //             //         ? "#f87171"
        //             //         : "#60a5fa",
        //             //     }}
        //             // >
        //             //     <div className="flex justify-between items-center">
        //             //         <div>
        //             //             <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
        //             //             {update.title}
        //             //             </h3>
        //             //             <p className="text-sm text-gray-500 dark:text-gray-400">
        //             //             Version {update.version} - {update.date}
        //             //             </p>
        //             //         </div>
        //             //         <span
        //             //             className={`inline-flex items-center px-2 py-1 text-sm font-medium rounded ${
        //             //             update.type === "feature"
        //             //                 ? "bg-green-100 text-green-700"
        //             //                 : update.type === "bugfix"
        //             //                 ? "bg-red-100 text-red-700"
        //             //                 : "bg-blue-100 text-blue-700"
        //             //             }`}
        //             //         >
        //             //             {update.type.charAt(0).toUpperCase() + update.type.slice(1)}
        //             //         </span>
        //             //     </div>
        //             //     <p className="mt-2 text-gray-700 dark:text-gray-300">
        //             //         {update.description}
        //             //     </p>
        //             // </div>
        //         ))}
        //     </div>
        // </div>

    );
};

export default Changelog;
