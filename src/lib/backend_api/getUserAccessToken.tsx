import handleAPIFetch from "../utils/handleAPIFetch";

export async function getUserAccessToken(){

    const res = await handleAPIFetch(
        '/api/get-access-token',
        'POST',
        null,
        null
    )

    if ('accessToken' in res){
        const access_token = res['accessToken'];
        return access_token;
    } else {
        return null;
    }

}