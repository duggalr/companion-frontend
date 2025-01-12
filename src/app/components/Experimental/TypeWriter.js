import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';

const TypeWriter = ({ text }) => {

    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {

        console.log('text:', text, text.length);

        let timeout;

        if (currentIndex <= text.length-1){

            timeout = setTimeout( () => {

                setCurrentIndex(previous_index => previous_index + 1);
                setCurrentText(previousText => previousText + text[currentIndex]);

                // let new_index = currentIndex + 1;
                // let new_character = text[new_index];
                // let new_string = currentText + new_character;
                // setCurrentIndex(new_index);
                // setCurrentText(new_string);
                // console.log('test')
            }, 20);

        } else {
            // TODO:
        }

        return () => clearTimeout(timeout);

    });

    return <Markdown>{currentText}</Markdown>;


}

export default TypeWriter;