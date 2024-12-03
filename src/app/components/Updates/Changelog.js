"use client";
import 'aos/dist/aos.css'; // Import AOS styles
import AOS from 'aos';
import { useEffect } from 'react';
import SparklesText from "@/components/ui/sparkles-text";


const updates = [
    {
        date: "2024-12-02",
        version: "1.0.4",
        title: "Added About Page",
        description:
          "Added About Section on Landing Page, along with text refactoring and animations.",
        type: "feature",
    },

    {
        date: "2024-11-28",
        version: "1.0.3",
        title: "Added MathJax Support",
        description:
          "Added MathJax support, when formatting the chat messages given from the AI. ",
        type: "feature",
    },

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

    const DISCORD_CHANNEL_URL = process.env.NEXT_PUBLIC_DISCORD_CHAT_URL;
    useEffect(() => {
        AOS.init({
            duration: 1000, // Animation duration in milliseconds
            once: true,     // Trigger animation only once
        });
    }, []);

    return (

        <div className="max-w-4xl mx-auto p-6 mt-4">

            <SparklesText text="Changelog" className="text-[30px] font-normal tracking-normal text-center" data-aos="fade-down"/>

            <p className="text-center dark:text-gray-400 text-gray-500 text-[16px] pt-2" data-aos="fade-down">
                Want to request a feature? <a className="text-blue-600 dark:text-blue-400 hover:underline" href={DISCORD_CHANNEL_URL}>Message us on Discord</a>
            </p>

            <ol class="relative border-s border-gray-200 dark:border-gray-700 mt-10" data-aos="fade-in">
                
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

            </ol>

        </div>

    );
};

export default Changelog;