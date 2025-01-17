import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faComment, faXmark, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { getFromLocalStorage, saveToLocalStorage, removeFromLocalStorage } from '@/lib/utils/localStorageUtils';


const NoteLayout = ({ note_dict }) => {

    const [noteDict, setNoteDict] = useState({});

    useEffect(() => {

        setNoteDict(note_dict);

    });

    return (

        <div className="space-y-4 pr-2">
            <div>
                {/* <h3 className="text-gray-900 font-bold">
                    {noteDict.title}
                </h3> */}
                <p className="text-[15px] tracking-normal leading-9 pt-0">
                    {/* <TypeWriter text={noteDict.description} /> */}
                    <Markdown>
                        {currentNoteText}
                    </Markdown>
                </p>
            </div>
        </div>

    )

};

export default NoteLayout;