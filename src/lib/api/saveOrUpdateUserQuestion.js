
const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export async function saveOrUpdateUserQuestion(qid , qname, qtext) {

    let endPointUrl = API_BACKEND_URL + '/update_user_question';
    let d = {
        'question_id': qid,
        'question_name': qname,
        'question_text': qtext
    };

    const apiResponse = await fetch(endPointUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(d)
    });
    const data = await apiResponse.json();
    return data;

}