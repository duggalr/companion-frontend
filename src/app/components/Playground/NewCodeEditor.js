import { useEffect, useState, useRef } from "react";
import { ResizableBox } from "react-resizable";
import Editor from "@monaco-editor/react";
import { usePlaygroundContext } from "../../../lib/hooks/usePlaygroundContext";
import { getFromLocalStorage } from "../../../lib/utils/localStorageUtils";
import { saveUserCode } from "../../../lib/api/saveUserCode";


// const NewCodeEditor = ({ codeState, _sendCodeSaveRequest, selectedProgrammingLanguage, _handlePgLangChange, _handleCodeEditorValueChange }) => {
const NewCodeEditor = ({ }) => {

    const { state, dispatch } = usePlaygroundContext();
    console.log('INITIAL PLAYGROUND STATE NEW CODE EDITOR:', state);
    // let currentProblemState = state;

    const monacoRef = useRef(null);
    const editorRef = useRef(null);
    const modelRef = useRef(null);
    // const [isEditorReady, setIsEditorReady] = useState(false);

    const [currentCode, setCurrentCode] = useState("");
    const codeRef = useRef("");

    const handleEditorDidMount = (editor, monaco) => {

        // // editorRef.current = editor;
        // editorRef.current = editor; // Store the editor instance
        // monacoRef.current = monaco; // Store the monaco instance

        // setIsEditorReady(true);

        // // Create the model
        // modelRef.current = monaco.editor.createModel(
        //     state.code,
        //     "python"
        // );

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

    useEffect(() => {

        const listenStorageChange = () => {
            const currentTheme = localStorage.getItem('theme') || 'light';
            monaco.editor.setTheme(currentTheme === 'dark' ? 'minimalistDark' : 'minimalistLight');
        };
        window.addEventListener("themeChange", listenStorageChange);

    }, []);


    const _handleCodeStateChange = (value) => {
 
        // TODO:
            // local-state-change here
            // reducer for code state update 
                // it should update state and local-storage

        // localStorage.setItem("codeState", JSON.stringify(codeStateTmpRef));l
        // localStorage.setItem("user_generated_code", value);
        // setCodeState(value);

        // _handleCodeEditorValueChange(value);

        // console.log('current-code-value-UPDATE:', value);
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

    // Command/Ctrl+s event-listener to prevent default saving behavior
    useEffect(() => {

        const handleKeyDown = (event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 's') {
                event.preventDefault();
                
                // _handleCodeStateChange(codeRef.current);
                
                showTemporaryAlert();

                console.log("CURRENT PLAYGROUND STATE ON SAVE:", state);

                // TODO: save code in backend
                // Anon Case
                // TODO: so much abstraction/refactoring possible due to duplicate code possible in the utils functions, fetch responses and backend...
                let anon_user_id = getFromLocalStorage("user_id");
                console.log('current-user-id:', anon_user_id);

                let payload = {
                    'user_id': anon_user_id,
                    'question_id': state.question_id,
                    'code': codeRef.current
                }
                console.log('SAVING USER CODE WITH PAYLOAD:', payload);
                saveUserCode(null, payload)

            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };

    }, [state]);


    useEffect(() => {
        console.log('current-state-code:', state.code);

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

            {/* // Monaco Editor */}
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