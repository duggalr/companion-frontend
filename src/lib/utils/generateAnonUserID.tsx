export default function generateAnonUserID(): Promise<string>{

    return new Promise(function(resolve){
        const user_id = Math.floor(Math.random() * 1000000000000000000).toString();
        resolve(user_id);
    });

}