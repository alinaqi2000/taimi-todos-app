import React from 'react'
import AuthResolver from '../hoc/AuthResolver'
import Header from './shared/Header'
import { Toaster } from '../ui/toaster'

export default function DefaultLayout(props: { children: JSX.Element | JSX.Element[] }) {
    return (
        <AuthResolver>
            <Header />
            <div className='mx-5'>
                {props.children}
            </div>
            <Toaster />
        </AuthResolver>
    )
}
