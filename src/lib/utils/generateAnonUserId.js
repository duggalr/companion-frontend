
// TODO: 
    // abstract and replace in associated places

export default function generateUserID(){
    return new Promise(function(resolve){
        let user_id = Math.floor(Math.random() * 1000000000000000000).toString();
        resolve(user_id);
    });
}

