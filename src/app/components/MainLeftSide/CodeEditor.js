import { useEffect, useState, useRef } from "react";
import Editor from "@monaco-editor/react";


const CodeEditor = ({ codeState, setCodeState, codeStateTmpRef, _sendCodeSaveRequest, selectedProgrammingLanguage, _handlePgLangChange, _handleCodeEditorValueChange }) => {

    const monacoRef = useRef(null);
    const editorRef = useRef(null);
    const modelRef = useRef(null);
    const [isEditorReady, setIsEditorReady] = useState(false);


    const handleEditorDidMount = (editor, monaco) => {

        // editorRef.current = editor;
        editorRef.current = editor; // Store the editor instance
        monacoRef.current = monaco; // Store the monaco instance

        setIsEditorReady(true);

        // Create the model
        modelRef.current = monaco.editor.createModel(
            codeState ?? "",
            selectedProgrammingLanguage ?? "python"
        );

        // editor.setModel(modelRef.current);

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
 
        // localStorage.setItem("codeState", JSON.stringify(codeStateTmpRef));l
        // localStorage.setItem("user_generated_code", value);
        // setCodeState(value);

        _handleCodeEditorValueChange(value);

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
                _sendCodeSaveRequest();
                showTemporaryAlert();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };

    }, []);


    const handleLangSelectionChange = (event) => {

        let pg_lang = event.target.value;
        monacoRef.current.editor.setModelLanguage(modelRef.current, pg_lang);
        _handlePgLangChange(pg_lang);

    }


    // Create Model for Monaco Editor
    useEffect(() => {
        if (isEditorReady && codeState){
            // Create the model
            modelRef.current = monacoRef.current.editor.createModel(
                codeState ?? "",
                selectedProgrammingLanguage ?? "python"
            );
            editorRef.current.setModel(modelRef.current);
        }
    }, [codeState, selectedProgrammingLanguage, isEditorReady]);


    return (
        <div className="h-full w-full border-r-2 border-gray-300">
            {/* dark:bg-gray-800 */}
            
            {showAlert && (
                // <div className="fixed top-1 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-1 rounded-md shadow-lg transition-opacity duration-300 text-[13px]">
                //     Code saved successfully! 🎉
                // </div>
                <div className="fixed top-1 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-1 rounded-md shadow-lg transition-opacity duration-300 text-[13px] z-50">
                    Code saved successfully! 🎉
                </div>
            )}

            <div className="border-b-2 dark:border-gray-500 max-w dark:bg-gray-900">

                <form class="max-w-[200px]">
                    {/* <select id="programming_languages" class="bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                    dark:focus:ring-blue-500 dark:focus:border-blue-500"> */}
                    <select
                        id="programming_languages"
                        class="dark:bg-gray-900 text-gray-900 text-[13.5px] focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-300 dark:focus:ring-blue-500 dark:focus:border-blue-500 pl-2"
                        value={selectedProgrammingLanguage}
                        onChange={handleLangSelectionChange}
                    >
                        <option value="python">Python3</option>
                        <option value="javascript">Javascript</option>
                        {/* <option value="haskell">Haskell</option>
                        <option value="rust">Rust</option> */}
                    </select>
                </form>

            </div>
            

            <Editor
                height="100%"
                width="100%"
                options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    selectOnLineNumbers: true,
                    wordWrap: "on",
                }}
                onChange={(value) => _handleCodeStateChange(value ?? "")}
                onMount={handleEditorDidMount}
            />
        </div>
    );
};

export default CodeEditor;