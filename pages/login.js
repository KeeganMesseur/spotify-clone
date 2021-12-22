import React from 'react'
import { getProviders, signIn } from "next-auth/react"

function login({ }) {
    return (
        <div>
            <h1>Login Page</h1>
        </div>
    );
}

export default login;

export async function getServerSideProps() {
    const providers = await getProviders();

    return {
        props: {
            providers,
        },
    };
}