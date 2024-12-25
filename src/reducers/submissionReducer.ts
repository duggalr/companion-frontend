import { SubmissionState } from '@/context/types';

export type SubmissionAction =
    | {type: "SET_TEST_CASE_SUBMISSION"; result: boolean | null, output_list: any;}

// TODO: 

// Reducer logic
export const submissionReducer = (state: SubmissionState, action: SubmissionAction): SubmissionState => {
    switch (action.type) {

        case "SET_TEST_CASE_SUBMISSION": {

            return {
                result: action.result,
                output_list: action.output_list
            }

        }

    }
};