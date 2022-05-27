import React, { useState } from 'react';
import Header from './components/Header'
import Loader from './components/loader'
import NFTForm from './components/NFTForm';
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { themeOptions } from './@types/theme'
import {ClientProvider} from './context/clientContext'
import Box from '@mui/material/Box';
import './App.css'
import MintNFT from './components/MintNFT';
import RegisterOrganizationModal from './components/RegisterOrganization';
import Content from './components/Content';
export default function App() {
    const theme = createTheme(themeOptions)
    return (
        <ThemeProvider theme={theme}>
            <ClientProvider>
                <Box sx={{ flexGrow: 1 }}>
                    <Header />
                    <Content/>
                    <Loader/>
                    {/* <NFTForm /> */}
                </Box>
            </ClientProvider>
        </ThemeProvider>
    );
}
