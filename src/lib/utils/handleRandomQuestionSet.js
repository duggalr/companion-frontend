// import { usePlaygroundContext } from "@/lib/hooks/usePlaygroundContext";
import { getRandomInitialPlaygroundQuestion } from '../backend_api/getRandomInitialPlaygroundQuestion';
import { saveToLocalStorage } from './localStorageUtils';


export default async function handleRandomQuestionSet(user_id) {

    // TODO: add the authenticated case

    let rnd_question_dict = await getRandomInitialPlaygroundQuestion(
        user_id,
        null
    );

    if (rnd_question_dict['success'] === true){

        let rnd_q_data = rnd_question_dict['data'];
        
        let tmp_d = {
            // question_id: rnd_q_data['question_id'],
            question_id: null,
            name: rnd_q_data['name'],
            question: rnd_q_data['text'],
            input_output_list: rnd_q_data['example_io_list'],
            code: rnd_q_data['starter_code'],
        };
        saveToLocalStorage('playground_question_dict', JSON.stringify(tmp_d));

        return tmp_d;

    } else {
        // TODO: how to handle error?
    }

};