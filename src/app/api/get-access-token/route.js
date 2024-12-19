import { NextResponse } from 'next/server';
import { getAccessToken } from '@auth0/nextjs-auth0';

export async function POST(req) {
    
    try {
        const res = new NextResponse();
        const { accessToken } = await getAccessToken(req, res, {
            scopes: ['openid', 'profile', 'email']
        });
        return new Response(JSON.stringify({ accessToken }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to retrieve access token', error_message: error }), { status: 500 });
    }

}