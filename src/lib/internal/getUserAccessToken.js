// import handleAPIFetch from '../utils/handleAPIFetch';
import handleAPIFetch from '../utils/handleAPIFetch';

export async function getUserAccessToken() {

    const res = await handleAPIFetch(
        '/api/get-access-token',
        'POST',
        null,
        null
    )

    if (res !== null) {

        let access_token = res['accessToken'];
        return access_token;

    } else {

        return null;

    }

    // const res = await fetch('/api/get-access-token', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    // });
    // const { accessToken } = await res.json();
    // return accessToken;

}