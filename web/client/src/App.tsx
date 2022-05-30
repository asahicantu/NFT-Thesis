import Header from './components/Header'
import Loader from './components/loader'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { themeOptions } from './@types/theme'
import {ClientProvider} from './context/clientContext'
import Box from '@mui/material/Box';
import './App.css'
import Content from './components/Content';
import MessagePanel  from './components/MessagePanel';
export default function App() {
    const theme = createTheme(themeOptions)
    return (
        <ThemeProvider theme={theme}>
            <ClientProvider>
                <Box sx={{ margin:2}}>
                    <Header />
                    <Content/>
                    <Loader/>
                    <MessagePanel/>
                    {/* <NFTForm /> */}
                </Box>
            </ClientProvider>
        </ThemeProvider>
    );
}
