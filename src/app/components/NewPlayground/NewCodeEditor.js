import { useEffect, useState, useRef } from "react";
import { ResizableBox } from "react-resizable";
import Editor from "@monaco-editor/react";


const NewCodeEditor = ({ codeState, _sendCodeSaveRequest, selectedProgrammingLanguage, _handlePgLangChange, _handleCodeEditorValueChange }) => {

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

    );
};

export default NewCodeEditor;