import { useEffect, useState, useRef } from "react";
// import { ResizableBox } from "react-resizable";
import Editor from "@monaco-editor/react";
import useUserContext from "@/lib/hooks/useUserContext";
import { usePlaygroundContext } from "@/lib/hooks/usePlaygroundContext";
import { getFromLocalStorage, saveToLocalStorage } from "@/lib/utils/localStorageUtils";
// import { saveUserCode } from "@/lib/backend_api/saveUserCode";
import { _handleUserSaveCode } from "@/lib/utils/handleSaveUserCode";
import addQIDParam from '@/lib/utils/addQidParam';


const NewCodeEditor = ({ }) => {

    const { isAuthenticated, userAccessToken } = useUserContext();

    const { state, dispatch } = usePlaygroundContext();
    // let currentProblemState = state;

    // const monacoRef = useRef(null);
    // const editorRef = useRef(null);
    // const modelRef = useRef(null);
    // const [isEditorReady, setIsEditorReady] = useState(false);

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


    // const _handleUserSaveCode = async (user_access_token, payload) => {

    //     let saveCodeRes = await saveUserCode(
    //         user_access_token,
    //         payload
    //     );
    //     console.log('SAVED-CODE-RES:', saveCodeRes);

    //     let question_object_id = saveCodeRes['data']['question_object_id'];

    //     dispatch({
    //         type: "SET_QUESTION_INPUT_OUTPUT",
    //         question_id: question_object_id,
    //         name: state.name,
    //         question: state.question,
    //         input_output_list: state.input_output_list,
    //         code: codeRef.current
    //     });

    //     let tmp_d = {
    //         question_id: question_object_id,
    //         name: state.name,
    //         question: state.question,
    //         input_output_list: state.input_output_list,
    //         code: codeRef.current
    //     };

    //     saveToLocalStorage('playground_question_dict', JSON.stringify(tmp_d));

    // };

    const handleSaveCodeInternal = async (payload) => {

        let user_save_code_response_dict = await _handleUserSaveCode(
            userAccessToken,
            payload
        );

        if (isAuthenticated){

            dispatch({
                type: "SET_QUESTION_INPUT_OUTPUT",
                question_id: user_save_code_response_dict['question_id'],
                name: state.name,
                question: state.question,
                input_output_list: state.input_output_list,
                code: codeRef.current
            });

            addQIDParam(user_save_code_response_dict['question_id']);
            
        } else {

            let tmp_d = {
                question_id: user_save_code_response_dict['question_id'],
                name: state.name,
                question: state.question,
                input_output_list: state.input_output_list,
                code: codeRef.current
            };

            dispatch({
                type: "SET_QUESTION_INPUT_OUTPUT",
                question_id: user_save_code_response_dict['question_id'],
                name: state.name,
                question: state.question,
                input_output_list: state.input_output_list,
                code: codeRef.current
            });
            saveToLocalStorage('playground_question_dict', JSON.stringify(tmp_d));

        }

    }

    // Command/Ctrl+s event-listener to prevent default saving behavior
    useEffect(() => {

        const handleKeyDown = (event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 's') {
                event.preventDefault();

                // _handleCodeStateChange(codeRef.current);

                showTemporaryAlert();

                let payload = {
                    'question_id': state.question_id,
                    'question_name': state.name,
                    'question_text': state.question,
                    'example_input_output_list': state.input_output_list,
                };

                dispatch({type: "UPDATE_CODE_STATE", code: codeRef.current});

                if (isAuthenticated){

                    // // // TODO: modify this and go from there
                    // // let payload = {
                    // //     'user_id': null,
                    // //     'question_id': state.question_id,
                    // //     'code': codeRef.current
                    // // };
                    
                    payload['user_id'] = null;
                    payload['code'] = codeRef.current;
                    // saveUserCode(
                    //     userAccessToken,
                    //     payload
                    // )

                    // _handleUserSaveCode(
                    //     userAccessToken,
                    //     payload
                    // );

                    handleSaveCodeInternal(
                        payload
                    );

                } else {
                
                    // Anon Case
                    let anon_user_id = getFromLocalStorage("user_id");

                    // let payload = {
                    //     'user_id': anon_user_id,
                    //     'question_id': state.question_id,
                    //     'code': codeRef.current
                    // };

                    payload['user_id'] = anon_user_id;
                    payload['code'] = codeRef.current;                    

                    // saveUserCode(
                    //     null,
                    //     payload
                    // );

                    // _handleUserSaveCode(
                    //     null,
                    //     payload
                    // );

                    handleSaveCodeInternal(
                        payload
                    );

                }
                
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