import React from 'react'
import Head from 'next/head'

import Header from './Header'


import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = ({ children, title = 'Room Book - Book Best Hotels for your Holiday' }) => {
    return (
        <div>
            <Head>
                <title>{title}</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Header />
            <ToastContainer position="top-right" />
            {children}
        </div>
    )
}

export default Layout
