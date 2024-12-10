// src/context/types.ts

export interface QuestionInputOutputPair{
    input: string;
    output: string;
}

export interface PlaygroundState {
    question_id: string | null;
    name: string;
    question: string;
    input_output_list: QuestionInputOutputPair[];
    code: string;
    console_output: string | null;
}

export type PlaygroundAction =
    | { type: "SET_QUESTION"; payload: string }
    | { type: "SET_OTHER_DATA"; payload: Record<string, any> };