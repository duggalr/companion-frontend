import { NextResponse } from 'next/server';
import { getAccessToken } from '@auth0/nextjs-auth0';

export async function POST(req) {
    
    const AUTH0_AUDIENCE_URL = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE_URL;

    try {
        const res = new NextResponse();

        const { accessToken } = await getAccessToken(req, res, {
            scopes: ['openid', 'profile', 'email'],
            audience: AUTH0_AUDIENCE_URL
        });
        return new Response(JSON.stringify({ accessToken }), { status: 200 });
    } catch (error) {
        // console.error("Error fetching access token:", error);
        return new Response(JSON.stringify({ error: 'Failed to retrieve access token', error_message: error }), { status: 500 });
    }

}