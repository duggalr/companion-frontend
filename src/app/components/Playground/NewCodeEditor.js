import React, { useEffect, useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import useUserContext from "@/lib/hooks/useUserContext";
import { usePlaygroundContext } from "@/lib/hooks/usePlaygroundContext";
import { handleSaveUserCode } from "@/lib/utils/handleSaveUserCode";


const NewCodeEditor = () => {

    const { isAuthenticated, userAccessToken } = useUserContext();
    const { state, dispatch } = usePlaygroundContext();
    const [currentCode, setCurrentCode] = useState("");
    const codeRef = useRef("");

    const handleEditorDidMount = (editor, monaco) => {

        // Define the light theme
        monaco.editor.defineTheme('minimalistLight', {
            base: 'vs-dark', // inherit from vs-dark (dark theme)
            inherit: true,
            rules: [
                { token: 'comment', foreground: '6A737D', fontStyle: 'italic' }, 
                { token: 'keyword', foreground: '007ACC' },
                { token: 'identifier', foreground: 'D4D4D4' }, 
                { token: 'string', foreground: 'CE9178' }, 
                { token: 'number', foreground: 'B5CEA8' }, 
                { token: 'delimiter', foreground: '808080' }, 
                { token: 'type', foreground: '4EC9B0' }, 
            ],
            colors: {
                'editor.background': '#252526',
                'editor.foreground': '#D4D4D4', 
                'editorLineNumber.foreground': '#A0A0A0',
                'editorCursor.foreground': '#FFFFFF',
                'editor.selectionBackground': '#A7C6ED',
                'editor.inactiveSelectionBackground': '#2C2C2C',
                'editor.lineHighlightBackground': '#2D2D30', 
                'editorBracketMatch.background': '#515A6B', 
                'editorWhitespace.foreground': '#3B3B3B', 
            }
        });

        // Define the dark theme
        monaco.editor.defineTheme('minimalistDark', {
            base: 'vs-dark', // inherit from vs-dark (dark theme)
            inherit: true,
            rules: [
                { token: 'comment', foreground: 'A6C4DB', fontStyle: 'italic' }, 
                { token: 'keyword', foreground: 'C6C6FF' }, 
                { token: 'identifier', foreground: 'D4D4D4' }, 
                { token: 'string', foreground: '79C0FF' }, 
                { token: 'number', foreground: 'B5CEA8' }, 
                { token: 'delimiter', foreground: '808080' }, 
                { token: 'type', foreground: 'A2D3E0' }, 
            ],
            colors: {
                'editor.background': '#1C2631',
                'editor.foreground': '#D4D4D4', 
                'editorLineNumber.foreground': '#4E7A9A', 
                'editorCursor.foreground': '#AEAFAD', 
                'editor.selectionBackground': '#3D5A7F', 
                'editor.inactiveSelectionBackground': '#2C2C2C', 
                'editor.lineHighlightBackground': '#2D2D30', 
                'editorBracketMatch.background': '#516B80', 
                'editorWhitespace.foreground': '#3B3B3B', 
            }
        });

        // Set the initial theme based on the localStorage value
        const currentTheme = localStorage.getItem('theme') || 'light';
        monaco.editor.setTheme(currentTheme === 'dark' ? 'minimalistDark' : 'minimalistLight');

    };

    const _handleCodeStateChange = (value) => {
        codeRef.current = value;
        setCurrentCode(value);
        dispatch({type: "UPDATE_CODE_STATE", code: value});
    }

    const [showAlert, setShowAlert] = useState(false);
    const showTemporaryAlert = () => {

        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 1000);

    };

    // Theme Change
    useEffect(() => {

        const listenStorageChange = () => {
            const currentTheme = localStorage.getItem('theme') || 'light';
            monaco.editor.setTheme(currentTheme === 'dark' ? 'minimalistDark' : 'minimalistLight');
        };
        window.addEventListener("themeChange", listenStorageChange);

    }, []);


    const _handleSaveUserCodeRequest = async () => {

        if (state.lecture_question === true && !isAuthenticated){
            
            console.log('Not saving in this case...')

        }
        else {

            showTemporaryAlert();

            let payload = {
                'question_id': state.question_id,
                'question_name': state.name,
                'question_text': state.question,
                'example_input_output_list': state.input_output_list,
                'lecture_question': state.lecture_question,
                'code': codeRef.current,
                'user_id': null
            };
            console.log('payload-SAVE:', payload);
    
            const saveCodeResponse = await handleSaveUserCode(
                payload,
                dispatch, 
                isAuthenticated,
                userAccessToken,
                state
            );
    
            if ('error' in saveCodeResponse){
                console.log('Could not save user code...');
            };

        }

    }

    // Command/Ctrl+s event-listener to prevent default saving behavior
    useEffect(() => {

        const handleKeyDown = (event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 's') {
                event.preventDefault();

                // Save User Code and Update State
                _handleSaveUserCodeRequest();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };

    }, [state]);


    useEffect(() => {

        codeRef.current = state.code;
        setCurrentCode(state.code);

    }, [state]);


    return (

        <>

            {showAlert && (
                <div className="fixed top-1 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-1 rounded-md shadow-lg transition-opacity duration-300 text-[13px] z-50">
                    Code saved successfully! 🎉
                </div>
            )}

            {/* Monaco Editor */}
            <Editor
                width="100%"
                height="100%"
                language="python"
                options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    selectOnLineNumbers: true,
                    wordWrap: "on",
                }}
                onChange={(value) => _handleCodeStateChange(value ?? "")}
                onMount={handleEditorDidMount}
                value={currentCode}
            />

        </>

    );
};

export default NewCodeEditor;