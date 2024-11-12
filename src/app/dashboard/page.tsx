"use client";
import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import TopNavBar from '../components/Utils/TopNavBar';
import MainLayout from '../components/PlaygroundLayout/MainLayout';
import Head from 'next/head';


export default function Dashboard() {

    // TODO:
        // Design the UI
        // Ensure this page is only accessible if user is authenticated (else, redirect to landing)
        // Display user fetched parent code objects

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