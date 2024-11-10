"use client";
import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import TopNavBar from '../components/Utils/TopNavBar';
import MainLayout from '../components/PlaygroundLayout/MainLayout';
import Head from 'next/head';


export default function Dashboard() {

    // TODO:
        // Fetch the user's saved code

    return (
       
        <>
            <Head>
                <title>Dashboard</title>
            </Head>
            <main>
                
                <ul>
                    <li>
                        Test One
                    </li>
                    <li>
                        Test Two
                    </li>
                </ul>

            </main>
        </>

    );

}