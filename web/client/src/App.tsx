import React, { useState } from 'react';
import Header from './components/Header'
import Loader from './components/loader'
import NFTForm from './components/NFTForm';
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { themeOptions } from './@types/theme'
import {ClientProvider} from './context/clientContext'
import Box from '@mui/material/Box';
import './App.css'
export default function App() {
    const theme = createTheme(themeOptions)
    return (
        <ThemeProvider theme={theme}>
            <ClientProvider>
                <Box sx={{ flexGrow: 1 }}>
                    <Loader/>
                    <Header />
                    <NFTForm />
                </Box>
            </ClientProvider>
        </ThemeProvider>
    );
}
