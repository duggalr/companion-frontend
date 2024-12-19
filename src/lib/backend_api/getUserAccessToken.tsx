import handleAPIFetch from "../utils/handleAPIFetch";

export async function getUserAccessToken(){

    const res = await handleAPIFetch(
        '/api/get-access-token',
        'POST',
        null,
        null
    )
    // console.log('GET TOKEN RES:', res);

    if ('accessToken' in res){
        let access_token = res['accessToken'];
        return access_token;
    } else {
        return null;
    }

}