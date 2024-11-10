
export async function getUserAccessToken() {

    const res = await fetch('/api/get-access-token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const { accessToken } = await res.json();
    return accessToken;

}