export default function addQIDParam (current_qid){
    window.history.pushState({}, '', `/playground?qid=${current_qid}`);
};