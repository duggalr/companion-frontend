export interface QuestionInputOutputPair{
    input: string;
    output: string;
}

type TestCase = { [key: string]: any };

export interface PlaygroundState {
    question_id: string | null;
    name: string;
    question: string;
    input_output_list: QuestionInputOutputPair[];
    code: string;
    console_output: string | null;
    lecture_question: boolean | null;
    test_case_list: TestCase | TestCase[] | [];

    all_test_cases_passed: boolean | null;
    program_output_result: [];
    ai_tutor_feedback: string | null;
    user_code_submission_history_objects: []
}

export type PlaygroundAction =
    | { type: "SET_QUESTION"; payload: string }
    // | { type: "SET_OTHER_DATA"; payload: Record<string, any> };


export interface SubmissionState {
    result: boolean | null;
    ai_tutor_feedback: string | null;
    output_list: any;
}